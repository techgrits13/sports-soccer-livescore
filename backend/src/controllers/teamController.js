const teamService = require('../services/teamService');
const logger = require('../config/logger');

class TeamController {
  /**
   * GET /api/teams/:id
   */
  async getTeamById(req, res) {
    try {
      const { id } = req.params;
      const team = await teamService.getTeamById(id);

      res.json({
        success: true,
        data: team
      });
    } catch (error) {
      logger.error('Error in getTeamById:', error.message);
      res.status(error.message === 'Team not found' ? 404 : 500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/teams/search?name=
   */
  async searchTeams(req, res) {
    try {
      const { name } = req.query;

      if (!name) {
        return res.status(400).json({
          success: false,
          error: 'Name parameter is required'
        });
      }

      const teams = await teamService.searchTeams(name);

      res.json({
        success: true,
        count: teams.length,
        data: teams
      });
    } catch (error) {
      logger.error('Error in searchTeams:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/teams/:id/statistics
   */
  async getTeamStatistics(req, res) {
    try {
      const { id } = req.params;
      const { league, season } = req.query;

      if (!league) {
        return res.status(400).json({
          success: false,
          error: 'League parameter is required'
        });
      }

      const statistics = await teamService.getTeamStatistics(id, league, season);

      res.json({
        success: true,
        data: statistics
      });
    } catch (error) {
      logger.error('Error in getTeamStatistics:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/teams/:id/squad
   */
  async getTeamSquad(req, res) {
    try {
      const { id } = req.params;
      const squad = await teamService.getTeamSquad(id);

      res.json({
        success: true,
        data: squad
      });
    } catch (error) {
      logger.error('Error in getTeamSquad:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/teams/league/:leagueId
   */
  async getTeamsByLeague(req, res) {
    try {
      const { leagueId } = req.params;
      const { season } = req.query;

      const teams = await teamService.getTeamsByLeague(leagueId, season);

      res.json({
        success: true,
        count: teams.length,
        data: teams
      });
    } catch (error) {
      logger.error('Error in getTeamsByLeague:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new TeamController();
