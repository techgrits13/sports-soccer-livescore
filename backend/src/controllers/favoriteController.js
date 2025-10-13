const favoriteService = require('../services/favoriteService');
const logger = require('../config/logger');

class FavoriteController {
  /**
   * POST /api/favorites/team
   */
  async addTeamFavorite(req, res) {
    try {
      const { userId, teamId, teamName, teamLogo } = req.body;

      if (!userId || !teamId || !teamName) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields'
        });
      }

      const favorite = await favoriteService.addTeamFavorite(
        userId, teamId, teamName, teamLogo
      );

      res.status(201).json({
        success: true,
        data: favorite
      });
    } catch (error) {
      logger.error('Error in addTeamFavorite:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * POST /api/favorites/league
   */
  async addLeagueFavorite(req, res) {
    try {
      const { userId, leagueId, leagueName, leagueLogo } = req.body;

      if (!userId || !leagueId || !leagueName) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields'
        });
      }

      const favorite = await favoriteService.addLeagueFavorite(
        userId, leagueId, leagueName, leagueLogo
      );

      res.status(201).json({
        success: true,
        data: favorite
      });
    } catch (error) {
      logger.error('Error in addLeagueFavorite:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * POST /api/favorites/match
   */
  async addMatchFavorite(req, res) {
    try {
      const { userId, matchId, matchData } = req.body;

      if (!userId || !matchId || !matchData) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields'
        });
      }

      const favorite = await favoriteService.addMatchFavorite(
        userId, matchId, matchData
      );

      res.status(201).json({
        success: true,
        data: favorite
      });
    } catch (error) {
      logger.error('Error in addMatchFavorite:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * DELETE /api/favorites/:id
   */
  async removeFavorite(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }

      await favoriteService.removeFavorite(userId, id);

      res.json({
        success: true,
        message: 'Favorite removed successfully'
      });
    } catch (error) {
      logger.error('Error in removeFavorite:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/favorites/:userId
   */
  async getUserFavorites(req, res) {
    try {
      const { userId } = req.params;
      const { type } = req.query;

      const favorites = await favoriteService.getUserFavorites(userId, type);

      res.json({
        success: true,
        count: favorites.length,
        data: favorites
      });
    } catch (error) {
      logger.error('Error in getUserFavorites:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/favorites/:userId/check?entityId=&type=
   */
  async checkFavorite(req, res) {
    try {
      const { userId } = req.params;
      const { entityId, type } = req.query;

      if (!entityId || !type) {
        return res.status(400).json({
          success: false,
          error: 'Entity ID and type are required'
        });
      }

      const isFavorited = await favoriteService.isFavorited(userId, entityId, type);

      res.json({
        success: true,
        isFavorited
      });
    } catch (error) {
      logger.error('Error in checkFavorite:', error.message);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new FavoriteController();
