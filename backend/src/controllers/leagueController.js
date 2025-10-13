const leagueService = require('../services/leagueService');
const logger = require('../config/logger');

class LeagueController {
  /**
   * GET /api/leagues
   */
  async getAllLeagues(req, res) {
    try {
      const leagues = await leagueService.getAllLeagues();
      
      res.json({
        success: true,
        count: leagues.length,
        data: leagues
      });
    } catch (error) {
      logger.error('Error in getAllLeagues:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/leagues/popular
   */
  async getPopularLeagues(req, res) {
    try {
      const leagues = await leagueService.getPopularLeagues();
      
      res.json({
        success: true,
        count: leagues.length,
        data: leagues
      });
    } catch (error) {
      logger.error('Error in getPopularLeagues:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/leagues/:id
   */
  async getLeagueById(req, res) {
    try {
      const { id } = req.params;
      const league = await leagueService.getLeagueById(id);

      res.json({
        success: true,
        data: league
      });
    } catch (error) {
      logger.error('Error in getLeagueById:', error.message);
      res.status(error.message === 'League not found' ? 404 : 500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/leagues/country/:country
   */
  async getLeaguesByCountry(req, res) {
    try {
      const { country } = req.params;
      const leagues = await leagueService.getLeaguesByCountry(country);

      res.json({
        success: true,
        count: leagues.length,
        data: leagues
      });
    } catch (error) {
      logger.error('Error in getLeaguesByCountry:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/leagues/:id/standings
   */
  async getStandings(req, res) {
    try {
      const { id } = req.params;
      const { season } = req.query;
      
      const standings = await leagueService.getStandings(id, season);

      res.json({
        success: true,
        data: standings
      });
    } catch (error) {
      logger.error('Error in getStandings:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/leagues/:id/topscorers
   */
  async getTopScorers(req, res) {
    try {
      const { id } = req.params;
      const { season } = req.query;
      
      const scorers = await leagueService.getTopScorers(id, season);

      res.json({
        success: true,
        count: scorers.length,
        data: scorers
      });
    } catch (error) {
      logger.error('Error in getTopScorers:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/leagues/:id/topassists
   */
  async getTopAssists(req, res) {
    try {
      const { id } = req.params;
      const { season } = req.query;
      
      const assists = await leagueService.getTopAssists(id, season);

      res.json({
        success: true,
        count: assists.length,
        data: assists
      });
    } catch (error) {
      logger.error('Error in getTopAssists:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new LeagueController();
