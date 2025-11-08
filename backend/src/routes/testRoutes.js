const express = require('express');
const router = express.Router();
const apiManager = require('../services/apiManager');
const axios = require('axios');

/**
 * Test Livescore API connectivity
 */
router.get('/livescore', async (req, res) => {
  try {
    console.log('🧪 Testing Livescore API...');
    
    const key = process.env.LIVESCORE_API_KEY;
    const secret = process.env.LIVESCORE_API_SECRET;
    
    console.log('Key:', key ? key.substring(0, 10) + '...' : 'MISSING');
    console.log('Secret:', secret ? secret.substring(0, 10) + '...' : 'NOT SET');
    
    // Test direct API call
    const url = 'https://livescore-api.com/api-client/scores/live.json';
    const params = { key, secret };
    
    console.log('Calling:', url);
    console.log('Params:', { key: key?.substring(0, 10) + '...', secret: secret ? 'set' : 'not set' });
    
    const response = await axios.get(url, { params, timeout: 10000 });
    
    console.log('✅ Livescore API Response:', response.status);
    console.log('Data keys:', Object.keys(response.data || {}));
    
    res.json({
      success: true,
      api: 'Livescore API',
      status: response.status,
      dataKeys: Object.keys(response.data || {}),
      sampleData: response.data
    });
  } catch (error) {
    console.error('❌ Livescore API Error:', error.message);
    console.error('Response:', error.response?.data);
    
    res.status(500).json({
      success: false,
      error: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
});

/**
 * Test SoccersAPI connectivity
 */
router.get('/soccers', async (req, res) => {
  try {
    console.log('🧪 Testing SoccersAPI...');
    
    const user = process.env.SOCCERS_API_USER;
    const token = process.env.SOCCERS_API_TOKEN;
    
    console.log('User:', user);
    console.log('Token:', token);
    
    // Test direct API call - list leagues
    const url = 'https://api.soccersapi.com/v2.2/leagues/';
    const params = { user, token, t: 'list' };
    
    console.log('Calling:', url);
    console.log('Params:', params);
    
    const response = await axios.get(url, { params, timeout: 10000 });
    
    console.log('✅ SoccersAPI Response:', response.status);
    console.log('Data keys:', Object.keys(response.data || {}));
    
    res.json({
      success: true,
      api: 'SoccersAPI',
      status: response.status,
      dataKeys: Object.keys(response.data || {}),
      sampleData: response.data
    });
  } catch (error) {
    console.error('❌ SoccersAPI Error:', error.message);
    console.error('Response:', error.response?.data);
    
    res.status(500).json({
      success: false,
      error: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
});

/**
 * Test API-Football connectivity (legacy)
 */
router.get('/api-football', async (req, res) => {
  try {
    console.log('🧪 Testing API-Football...');
    
    const key = process.env.API_FOOTBALL_KEY;
    console.log('Key:', key ? key : 'MISSING');
    
    // Test direct API call
    const url = 'https://v3.football.api-sports.io/fixtures';
    const params = { live: 'all' };
    const headers = {
      'x-apisports-key': key,
      'Accept': 'application/json'
    };
    
    console.log('Calling:', url);
    console.log('Headers:', { 'x-apisports-key': key });
    
    const response = await axios.get(url, { params, headers, timeout: 10000 });
    
    console.log('✅ API-Football Response:', response.status);
    console.log('Data keys:', Object.keys(response.data || {}));
    
    res.json({
      success: true,
      api: 'API-Football',
      status: response.status,
      dataKeys: Object.keys(response.data || {}),
      results: response.data?.results,
      sampleData: response.data
    });
  } catch (error) {
    console.error('❌ API-Football Error:', error.message);
    console.error('Response:', error.response?.data);
    
    res.status(500).json({
      success: false,
      error: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
});

/**
 * Test API Manager
 */
router.get('/api-manager', async (req, res) => {
  try {
    console.log('🧪 Testing API Manager...');
    
    // Get quota status
    const quotaStatus = apiManager.getQuotaStatus();
    
    // Get cache stats
    const cacheStats = apiManager.cache.getStats();
    
    console.log('Quota Status:', quotaStatus);
    console.log('Cache Stats:', cacheStats);
    
    res.json({
      success: true,
      quotaStatus,
      cacheStats,
      cacheTTL: apiManager.cacheTTL,
      apis: Object.keys(apiManager.apis),
      message: 'API Manager is configured with caching enabled'
    });
  } catch (error) {
    console.error('❌ API Manager Error:', error.message);
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Test SoccersAPI livescores endpoint (correct endpoint!)
 */
router.get('/soccers-matches', async (req, res) => {
  try {
    console.log('🧪 Testing SoccersAPI livescores endpoint...');
    
    const user = process.env.SOCCERS_API_USER;
    const token = process.env.SOCCERS_API_TOKEN;
    
    // Test live matches using correct endpoint
    const url = 'https://api.soccersapi.com/v2.2/livescores/';
    const params = { user, token, t: 'today' };  // Use 'today' for all today's matches
    
    console.log('Calling:', url);
    console.log('Params:', params);
    
    const response = await axios.get(url, { params, timeout: 15000 });
    
    console.log('✅ SoccersAPI Livescores Response:', response.status);
    console.log('Data keys:', Object.keys(response.data || {}));
    console.log('Match count:', response.data?.data?.length || 0);
    
    res.json({
      success: true,
      api: 'SoccersAPI Livescores',
      status: response.status,
      dataKeys: Object.keys(response.data || {}),
      matchCount: response.data?.data?.length || 0,
      sampleData: response.data
    });
  } catch (error) {
    console.error('❌ SoccersAPI Livescores Error:', error.message);
    console.error('Response:', error.response?.data);
    
    res.status(500).json({
      success: false,
      error: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
});

/**
 * Get cache statistics
 */
router.get('/cache-stats', (req, res) => {
  try {
    const stats = apiManager.cache.getStats();
    const ttls = apiManager.cacheTTL;
    
    res.json({
      success: true,
      cacheStats: stats,
      cacheTTLs: ttls,
      message: 'Cache is working to save your API quota!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Clear cache (for testing)
 */
router.post('/clear-cache', (req, res) => {
  try {
    const dataType = req.body.dataType || req.query.dataType;
    
    if (dataType) {
      apiManager.clearCache(dataType);
      console.log(`🗑️  Cleared cache for: ${dataType}`);
      res.json({
        success: true,
        message: `Cache cleared for ${dataType}`
      });
    } else {
      apiManager.clearCache();
      console.log('🗑️  Cleared ALL cache');
      res.json({
        success: true,
        message: 'All cache cleared'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
