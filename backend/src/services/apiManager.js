const axios = require('axios');
const NodeCache = require('node-cache');
const logger = require('../config/logger');
const { QuotaExceededError, ExternalAPIError, ServiceUnavailableError } = require('../utils/customErrors');
require('dotenv').config();

/**
 * Smart API Manager to handle multiple football API keys
 * Implements intelligent routing, caching, and quota management
 */
class APIManager {
  constructor() {
    // Initialize cache with different TTL for different data types
    this.cache = new NodeCache({ 
      stdTTL: 600, // 10 minutes default
      checkperiod: 120 // Check for expired keys every 2 minutes
    });

    // API configurations
    this.apis = {
      apiFootball: {
        name: 'API-Football',
        baseURL: 'https://v3.football.api-sports.io',
        key: process.env.API_FOOTBALL_KEY,
        headers: {
          'x-rapidapi-key': process.env.API_FOOTBALL_KEY,
          'x-rapidapi-host': 'v3.football.api-sports.io'
        },
        dailyLimit: parseInt(process.env.API_FOOTBALL_DAILY_LIMIT) || 100,
        requestsToday: 0,
        lastReset: new Date().toDateString(),
        // Best for: Live scores, detailed match data, lineups, statistics
        priority: ['live', 'fixtures', 'lineups', 'statistics', 'players', 'leagues']
      },
      footballData: {
        name: 'Football-Data.org',
        baseURL: 'https://api.football-data.org/v4',
        key: process.env.FOOTBALL_DATA_KEY,
        headers: {
          'X-Auth-Token': process.env.FOOTBALL_DATA_KEY
        },
        dailyLimit: parseInt(process.env.FOOTBALL_DATA_DAILY_LIMIT) || 10,
        requestsToday: 0,
        lastReset: new Date().toDateString(),
        // Best for: Competition/league data, standings, team info
        priority: ['competitions', 'standings', 'teams', 'leagues']
      }
    };

    // Cache TTL configuration (in seconds)
    this.cacheTTL = {
      live: 30,           // 30 seconds for live matches
      fixtures: 1800,     // 30 minutes for fixtures
      standings: 3600,    // 1 hour for standings
      teams: 86400,       // 24 hours for team data
      leagues: 86400,     // 24 hours for league data
      players: 86400,     // 24 hours for player data
      statistics: 300     // 5 minutes for statistics
    };

    // Retry configuration
    this.retryConfig = {
      maxRetries: 3,
      retryDelay: 1000, // 1 second
      backoffMultiplier: 2
    };

    this.initializeQuotaTracking();
  }

  /**
   * Initialize or restore quota tracking from database
   */
  async initializeQuotaTracking() {
    try {
      const supabase = require('../config/database');
      const { data, error } = await supabase
        .from('api_usage')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        const usage = data[0];
        const today = new Date().toDateString();
        
        if (usage.date === today) {
          this.apis.apiFootball.requestsToday = usage.api_football_requests || 0;
          this.apis.footballData.requestsToday = usage.football_data_requests || 0;
          logger.info('Restored API quota tracking from database');
        }
      }
    } catch (error) {
      logger.warn('Could not restore quota tracking:', error.message);
    }
  }

  /**
   * Reset daily counters if a new day has started
   */
  resetDailyCountersIfNeeded() {
    const today = new Date().toDateString();
    
    Object.keys(this.apis).forEach(apiKey => {
      if (this.apis[apiKey].lastReset !== today) {
        this.apis[apiKey].requestsToday = 0;
        this.apis[apiKey].lastReset = today;
        logger.info(`Reset daily counter for ${this.apis[apiKey].name}`);
      }
    });
  }

  /**
   * Determine which API to use based on data type and availability
   */
  selectAPI(dataType) {
    this.resetDailyCountersIfNeeded();

    // Check which APIs can handle this data type
    const availableAPIs = Object.entries(this.apis)
      .filter(([key, api]) => {
        // Check if API can handle this data type
        const canHandle = api.priority.some(p => dataType.includes(p));
        // Check if API has quota remaining
        const hasQuota = api.requestsToday < api.dailyLimit;
        return canHandle && hasQuota;
      })
      .sort((a, b) => {
        // Sort by priority for this data type
        const aIndex = a[1].priority.findIndex(p => dataType.includes(p));
        const bIndex = b[1].priority.findIndex(p => dataType.includes(p));
        return aIndex - bIndex;
      });

    if (availableAPIs.length === 0) {
      logger.error(`No API available for data type: ${dataType}`);
      throw new QuotaExceededError('API quota exceeded for all providers');
    }

    return availableAPIs[0][0]; // Return the key of the best API
  }

  /**
   * Sleep function for retry delays
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Make HTTP request with retry logic
   */
  async makeRequestWithRetry(url, config, apiName, retryCount = 0) {
    try {
      const response = await axios({
        ...config,
        url,
        timeout: 10000
      });
      return response;
    } catch (error) {
      const isRetryable = error.code === 'ECONNABORTED' || 
                         error.code === 'ETIMEDOUT' ||
                         error.code === 'ENOTFOUND' ||
                         (error.response && error.response.status >= 500);

      if (isRetryable && retryCount < this.retryConfig.maxRetries) {
        const delay = this.retryConfig.retryDelay * Math.pow(this.retryConfig.backoffMultiplier, retryCount);
        logger.warn(`Request failed, retrying in ${delay}ms... (attempt ${retryCount + 1}/${this.retryConfig.maxRetries})`);
        await this.sleep(delay);
        return this.makeRequestWithRetry(url, config, apiName, retryCount + 1);
      }

      // Throw custom error
      if (error.response) {
        throw new ExternalAPIError(
          error.response.data?.message || `${apiName} API error: ${error.response.status}`,
          apiName
        );
      } else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new ServiceUnavailableError(`${apiName} API timeout`);
      } else {
        throw new ExternalAPIError(error.message, apiName);
      }
    }
  }

  /**
   * Make a request with smart API selection and caching
   */
  async request(dataType, endpoint, params = {}, options = {}) {
    const cacheKey = `${dataType}:${endpoint}:${JSON.stringify(params)}`;
    
    // Check cache first
    if (!options.skipCache) {
      const cachedData = this.cache.get(cacheKey);
      if (cachedData) {
        logger.debug(`Cache hit for ${cacheKey}`);
        return { data: cachedData, fromCache: true };
      }
    }

    // Select best API
    const apiKey = this.selectAPI(dataType);
    const api = this.apis[apiKey];

    try {
      logger.info(`Making request to ${api.name} for ${dataType}`);
      
      const response = await this.makeRequestWithRetry(
        `${api.baseURL}${endpoint}`,
        {
          method: 'GET',
          headers: api.headers,
          params: params
        },
        api.name
      );

      // Increment usage counter
      api.requestsToday++;
      await this.trackUsage(apiKey);

      // Cache the response
      const ttl = this.cacheTTL[dataType] || 600;
      this.cache.set(cacheKey, response.data, ttl);

      logger.info(`${api.name} request successful. Quota: ${api.requestsToday}/${api.dailyLimit}`);
      
      return { 
        data: response.data, 
        fromCache: false,
        apiUsed: api.name,
        quotaRemaining: api.dailyLimit - api.requestsToday
      };

    } catch (error) {
      logger.error(`API request failed for ${api.name}:`, error.message);
      
      // Try fallback API if available
      if (options.allowFallback !== false) {
        logger.info('Attempting fallback API...');
        try {
          const fallbackAPIs = Object.keys(this.apis).filter(k => k !== apiKey);
          for (const fallbackKey of fallbackAPIs) {
            const fallbackApi = this.apis[fallbackKey];
            if (fallbackApi.requestsToday < fallbackApi.dailyLimit) {
              return await this.request(dataType, endpoint, params, { 
                ...options, 
                skipCache: true, 
                allowFallback: false 
              });
            }
          }
        } catch (fallbackError) {
          logger.error('Fallback API also failed:', fallbackError.message);
        }
      }
      
      throw error;
    }
  }

  /**
   * Track API usage in database
   */
  async trackUsage(apiKey) {
    try {
      const supabase = require('../config/database');
      const today = new Date().toDateString();
      
      const usageData = {
        date: today,
        api_football_requests: this.apis.apiFootball.requestsToday,
        football_data_requests: this.apis.footballData.requestsToday,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('api_usage')
        .upsert(usageData, { onConflict: 'date' });

      if (error) {
        logger.error('Failed to track API usage:', error.message);
      }
    } catch (error) {
      logger.warn('Could not track usage in database:', error.message);
    }
  }

  /**
   * Get current quota status
   */
  getQuotaStatus() {
    this.resetDailyCountersIfNeeded();
    
    return {
      apiFootball: {
        used: this.apis.apiFootball.requestsToday,
        limit: this.apis.apiFootball.dailyLimit,
        remaining: this.apis.apiFootball.dailyLimit - this.apis.apiFootball.requestsToday,
        percentage: Math.round((this.apis.apiFootball.requestsToday / this.apis.apiFootball.dailyLimit) * 100)
      },
      footballData: {
        used: this.apis.footballData.requestsToday,
        limit: this.apis.footballData.dailyLimit,
        remaining: this.apis.footballData.dailyLimit - this.apis.footballData.requestsToday,
        percentage: Math.round((this.apis.footballData.requestsToday / this.apis.footballData.dailyLimit) * 100)
      },
      lastReset: this.apis.apiFootball.lastReset
    };
  }

  /**
   * Clear cache for specific data type or all
   */
  clearCache(dataType = null) {
    if (dataType) {
      const keys = this.cache.keys().filter(key => key.startsWith(dataType));
      keys.forEach(key => this.cache.del(key));
      logger.info(`Cleared cache for ${dataType}`);
    } else {
      this.cache.flushAll();
      logger.info('Cleared all cache');
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      keys: this.cache.keys().length,
      hits: this.cache.getStats().hits,
      misses: this.cache.getStats().misses,
      hitRate: this.cache.getStats().hits / (this.cache.getStats().hits + this.cache.getStats().misses)
    };
  }
}

// Export singleton instance
module.exports = new APIManager();
