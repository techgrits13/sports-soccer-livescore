const apiManager = require('../services/apiManager');

class ApiUsageController {
  async getApiUsage(req, res) {
    try {
      const usage = {};
      
      // Add stats for each API provider
      Object.entries(apiManager.apis).forEach(([key, api]) => {
        usage[key] = {
          name: api.name,
          requestsToday: api.requestsToday,
          dailyLimit: api.dailyLimit,
          lastReset: api.lastReset,
          quotaPercentage: Math.round((api.requestsToday / api.dailyLimit) * 100)
        };
      });
      
      res.json(usage);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get API usage' });
    }
  }
  
  async getSportMonksUsage(req, res) {
    try {
      const sportmonks = apiManager.apis.sportMonks;
      res.json({
        name: sportmonks.name,
        requestsToday: sportmonks.requestsToday,
        dailyLimit: sportmonks.dailyLimit,
        lastReset: sportmonks.lastReset,
        quotaPercentage: Math.round((sportmonks.requestsToday / sportmonks.dailyLimit) * 100)
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get SportMonks usage' });
    }
  }
}

module.exports = new ApiUsageController();
