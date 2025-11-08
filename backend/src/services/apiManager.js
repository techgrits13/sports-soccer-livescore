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
      livescoreApi: {
        name: 'LivescoreAPI',
        baseURL: 'https://livescore-api.com/api-client',
        key: process.env.LIVESCORE_API_KEY,
        secret: process.env.LIVESCORE_API_SECRET,
        headers: {
          'Accept': 'application/json'
        },
        dailyLimit: parseInt(process.env.LIVESCORE_DAILY_LIMIT) || 10000,
        requestsToday: 0,
        lastReset: new Date().toDateString(),
        priority: ['*'] // Primary API for all data types
      },
      soccersApi: {
        name: 'SoccersAPI',
        baseURL: 'https://api.soccersapi.com/v2.2',
        username: process.env.SOCCERS_API_USER,
        token: process.env.SOCCERS_API_TOKEN,
        headers: {
          'Accept': 'application/json'
        },
        dailyLimit: parseInt(process.env.SOCCERS_API_DAILY_LIMIT) || 1000,
        requestsToday: 0,
        lastReset: new Date().toDateString(),
        priority: ['*'] // Failover API
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
          this.apis.livescoreApi.requestsToday = usage.livescore_requests || 0;
          this.apis.soccersApi.requestsToday = usage.soccers_requests || 0;
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

    // Filter APIs that support this dataType and have remaining quota
    const availableAPIs = Object.entries(this.apis)
      .filter(([key, api]) => {
        return api.priority.includes('*') || api.priority.includes(dataType);
      })
      .filter(([key, api]) => {
        return api.requestsToday < api.dailyLimit;
      })
      .sort((a, b) => {
        // Priority: livescoreApi first, then soccersApi
        const order = { livescoreApi: 0, soccersApi: 1 };
        return (order[a[0]] || 99) - (order[b[0]] || 99);
      });

    if (availableAPIs.length === 0) {
      logger.error(`No available APIs for ${dataType} or quota exceeded`);
      throw new QuotaExceededError('API quota exceeded for all providers');
    }

    // Return the highest priority API with available quota
    const selectedApi = availableAPIs[0][0];
    logger.info(`Selected ${this.apis[selectedApi].name} for ${dataType}`);
    return selectedApi;
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
        logger.info(`✅ Cache HIT for ${dataType} - API call saved!`);
        console.log(`💰 Cache saved API request for ${dataType}`);
        return { data: cachedData, fromCache: true };
      }
    }
    
    logger.info(`❌ Cache MISS for ${dataType} - fetching from API`);
    console.log(`🌐 No cache, calling API for ${dataType}`);

    // Select best API
    const apiKey = this.selectAPI(dataType);
    const api = this.apis[apiKey];

    try {
      logger.info(`Making request to ${api.name} for ${dataType}`);
      
      // Build request config based on API type
      let requestConfig = {
        method: 'GET',
        headers: api.headers,
        params: { ...params }
      };
      
      // Add authentication based on API type
      if (apiKey === 'livescoreApi') {
        // Livescore API uses key and secret as URL parameters
        requestConfig.params.key = api.key;
        if (api.secret) {
          requestConfig.params.secret = api.secret;
        }
      } else if (apiKey === 'soccersApi') {
        // SoccersAPI uses user and token as URL parameters
        requestConfig.params.user = api.username;
        requestConfig.params.token = api.token;
      }
      
      const response = await this.makeRequestWithRetry(
        `${api.baseURL}${endpoint}`,
        requestConfig,
        api.name
      );

      // Increment usage counter
      api.requestsToday++;
      await this.trackUsage(apiKey);

      // Cache the response
      const ttl = this.cacheTTL[dataType] || 600;
      this.cache.set(cacheKey, response.data, ttl);
      
      const ttlMinutes = Math.floor(ttl / 60);
      const ttlSeconds = ttl % 60;
      console.log(`💾 Cached ${dataType} for ${ttlMinutes}m ${ttlSeconds}s`);

      logger.info(`${api.name} request successful. Quota: ${api.requestsToday}/${api.dailyLimit}`);
      
      return { 
        data: response.data, 
        fromCache: false,
        apiUsed: api.name,
        quotaRemaining: api.dailyLimit - api.requestsToday
      };

    } catch (error) {
      logger.error(`API request failed for ${api.name}:`, error.message);
      
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
        livescore_requests: this.apis.livescoreApi.requestsToday,
        soccers_requests: this.apis.soccersApi.requestsToday,
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
      livescoreApi: {
        used: this.apis.livescoreApi.requestsToday,
        limit: this.apis.livescoreApi.dailyLimit,
        remaining: this.apis.livescoreApi.dailyLimit - this.apis.livescoreApi.requestsToday,
        percentage: Math.round((this.apis.livescoreApi.requestsToday / this.apis.livescoreApi.dailyLimit) * 100)
      },
      soccersApi: {
        used: this.apis.soccersApi.requestsToday,
        limit: this.apis.soccersApi.dailyLimit,
        remaining: this.apis.soccersApi.dailyLimit - this.apis.soccersApi.requestsToday,
        percentage: Math.round((this.apis.soccersApi.requestsToday / this.apis.soccersApi.dailyLimit) * 100)
      },
      lastReset: this.apis.livescoreApi.lastReset
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
