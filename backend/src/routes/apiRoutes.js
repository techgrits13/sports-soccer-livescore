const express = require('express');
const router = express.Router();
const apiManager = require('../services/apiManager');

/**
 * GET /api/status - Get API quota status
 */
router.get('/status', (req, res) => {
  try {
    const status = apiManager.getQuotaStatus();
    const cacheStats = apiManager.getCacheStats();

    res.json({
      success: true,
      data: {
        quota: status,
        cache: cacheStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/cache/clear - Clear cache
 */
router.post('/cache/clear', (req, res) => {
  try {
    const { dataType } = req.body;
    apiManager.clearCache(dataType);

    res.json({
      success: true,
      message: dataType 
        ? `Cache cleared for ${dataType}` 
        : 'All cache cleared'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
