const logger = require('../config/logger');

/**
 * Validation middleware for request parameters
 */
class ValidationMiddleware {
  /**
   * Validate date format (YYYY-MM-DD)
   */
  static validateDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) {
      return false;
    }
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }

  /**
   * Validate numeric ID
   */
  static validateId(id) {
    return /^\d+$/.test(id);
  }

  /**
   * Validate season year
   */
  static validateSeason(season) {
    const currentYear = new Date().getFullYear();
    const year = parseInt(season);
    return year >= 2000 && year <= currentYear + 1;
  }

  /**
   * Sanitize string input
   */
  static sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/[<>]/g, '');
  }

  /**
   * Middleware to validate match ID parameter
   */
  static validateMatchId(req, res, next) {
    const { id } = req.params;
    
    if (!id || !ValidationMiddleware.validateId(id)) {
      logger.warn(`Invalid match ID: ${id}`);
      return res.status(400).json({
        success: false,
        error: 'Invalid match ID. Must be a positive number.'
      });
    }
    
    next();
  }

  /**
   * Middleware to validate team ID parameter
   */
  static validateTeamId(req, res, next) {
    const { teamId, id } = req.params;
    const teamIdValue = teamId || id;
    
    if (!teamIdValue || !ValidationMiddleware.validateId(teamIdValue)) {
      logger.warn(`Invalid team ID: ${teamIdValue}`);
      return res.status(400).json({
        success: false,
        error: 'Invalid team ID. Must be a positive number.'
      });
    }
    
    next();
  }

  /**
   * Middleware to validate league ID parameter
   */
  static validateLeagueId(req, res, next) {
    const { leagueId, id } = req.params;
    const leagueIdValue = leagueId || id;
    
    if (!leagueIdValue || !ValidationMiddleware.validateId(leagueIdValue)) {
      logger.warn(`Invalid league ID: ${leagueIdValue}`);
      return res.status(400).json({
        success: false,
        error: 'Invalid league ID. Must be a positive number.'
      });
    }
    
    next();
  }

  /**
   * Middleware to validate date query parameters
   */
  static validateDateQuery(req, res, next) {
    const { date, from, to } = req.query;
    
    if (date && !ValidationMiddleware.validateDate(date)) {
      logger.warn(`Invalid date format: ${date}`);
      return res.status(400).json({
        success: false,
        error: 'Invalid date format. Use YYYY-MM-DD.'
      });
    }
    
    if (from && !ValidationMiddleware.validateDate(from)) {
      logger.warn(`Invalid from date format: ${from}`);
      return res.status(400).json({
        success: false,
        error: 'Invalid from date format. Use YYYY-MM-DD.'
      });
    }
    
    if (to && !ValidationMiddleware.validateDate(to)) {
      logger.warn(`Invalid to date format: ${to}`);
      return res.status(400).json({
        success: false,
        error: 'Invalid to date format. Use YYYY-MM-DD.'
      });
    }
    
    if (from && to && new Date(from) > new Date(to)) {
      logger.warn(`Invalid date range: ${from} to ${to}`);
      return res.status(400).json({
        success: false,
        error: 'Invalid date range. "from" date must be before "to" date.'
      });
    }
    
    next();
  }

  /**
   * Middleware to validate season query parameter
   */
  static validateSeasonQuery(req, res, next) {
    const { season } = req.query;
    
    if (season && !ValidationMiddleware.validateSeason(season)) {
      logger.warn(`Invalid season: ${season}`);
      return res.status(400).json({
        success: false,
        error: 'Invalid season. Must be a year between 2000 and current year + 1.'
      });
    }
    
    next();
  }

  /**
   * Middleware to validate search query parameter
   */
  static validateSearchQuery(req, res, next) {
    const { name, q, query } = req.query;
    const searchTerm = name || q || query;
    
    if (searchTerm) {
      if (typeof searchTerm !== 'string' || searchTerm.trim().length < 2) {
        logger.warn(`Invalid search query: ${searchTerm}`);
        return res.status(400).json({
          success: false,
          error: 'Search query must be at least 2 characters long.'
        });
      }
      
      if (searchTerm.length > 100) {
        logger.warn(`Search query too long: ${searchTerm.length} characters`);
        return res.status(400).json({
          success: false,
          error: 'Search query must be less than 100 characters.'
        });
      }
      
      // Sanitize the search term
      req.query.name = ValidationMiddleware.sanitizeString(searchTerm);
      req.query.q = req.query.name;
      req.query.query = req.query.name;
    } else {
      return res.status(400).json({
        success: false,
        error: 'Search query parameter is required.'
      });
    }
    
    next();
  }

  /**
   * Middleware to validate favorite request body
   */
  static validateFavoriteBody(req, res, next) {
    const { userId, type } = req.body;
    
    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      logger.warn('Invalid userId in favorite request');
      return res.status(400).json({
        success: false,
        error: 'Valid userId is required.'
      });
    }
    
    // Validate type-specific fields
    if (type === 'team') {
      const { teamId, teamName } = req.body;
      if (!teamId || !ValidationMiddleware.validateId(teamId)) {
        return res.status(400).json({
          success: false,
          error: 'Valid teamId is required.'
        });
      }
      if (!teamName || typeof teamName !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Valid teamName is required.'
        });
      }
    }
    
    if (type === 'league') {
      const { leagueId, leagueName } = req.body;
      if (!leagueId || !ValidationMiddleware.validateId(leagueId)) {
        return res.status(400).json({
          success: false,
          error: 'Valid leagueId is required.'
        });
      }
      if (!leagueName || typeof leagueName !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Valid leagueName is required.'
        });
      }
    }
    
    if (type === 'match') {
      const { matchId } = req.body;
      if (!matchId || !ValidationMiddleware.validateId(matchId)) {
        return res.status(400).json({
          success: false,
          error: 'Valid matchId is required.'
        });
      }
    }
    
    next();
  }

  /**
   * Middleware to validate pagination parameters
   */
  static validatePagination(req, res, next) {
    const { page, limit } = req.query;
    
    if (page) {
      const pageNum = parseInt(page);
      if (isNaN(pageNum) || pageNum < 1) {
        return res.status(400).json({
          success: false,
          error: 'Page must be a positive number.'
        });
      }
      req.query.page = pageNum;
    }
    
    if (limit) {
      const limitNum = parseInt(limit);
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        return res.status(400).json({
          success: false,
          error: 'Limit must be between 1 and 100.'
        });
      }
      req.query.limit = limitNum;
    }
    
    next();
  }
}

module.exports = ValidationMiddleware;
