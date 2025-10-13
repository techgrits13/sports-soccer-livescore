const matchService = require('../services/matchService');
const logger = require('../config/logger');
const asyncHandler = require('../utils/asyncHandler');
const { NotFoundError } = require('../utils/customErrors');

class MatchController {
  /**
   * GET /api/matches/live
   */
  getLiveMatches = asyncHandler(async (req, res) => {
    try {
      const matches = await matchService.getLiveMatches();
      return res.json({
        success: true,
        count: matches.length,
        data: matches,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Soft-fail live matches:', error.message);
      return res.json({
        success: true,
        count: 0,
        data: [],
        timestamp: new Date().toISOString()
      });
    }
  });

  /**
   * GET /api/matches?date=YYYY-MM-DD
   */
  getMatches = asyncHandler(async (req, res) => {
    const { date, from, to } = req.query;
    try {
      let matches;
      if (from && to) {
        matches = await matchService.getMatchesByDateRange(from, to);
      } else if (date) {
        matches = await matchService.getMatchesByDate(date);
      } else {
        const today = new Date().toISOString().split('T')[0];
        matches = await matchService.getMatchesByDate(today);
      }

      return res.json({
        success: true,
        count: matches.length,
        data: matches,
        filters: { date, from, to }
      });
    } catch (error) {
      logger.error('Soft-fail matches list:', error.message);
      return res.json({
        success: true,
        count: 0,
        data: [],
        filters: { date, from, to }
      });
    }
  });

  /**
   * GET /api/matches/:id
   */
  getMatchDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const match = await matchService.getMatchDetails(id);
      if (!match) {
        return res.json({ success: true, data: null });
      }
      return res.json({ success: true, data: match });
    } catch (error) {
      logger.error('Soft-fail match details:', error.message);
      return res.json({ success: true, data: null });
    }
  });

  /**
   * GET /api/matches/:id/statistics
   */
  getMatchStatistics = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const statistics = await matchService.getMatchStatistics(id);
      return res.json({ success: true, data: statistics });
    } catch (error) {
      logger.error('Soft-fail match statistics:', error.message);
      return res.json({ success: true, data: null });
    }
  });

  /**
   * GET /api/matches/:id/events
   */
  getMatchEvents = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const events = await matchService.getMatchEvents(id);
      return res.json({ success: true, count: events.length, data: events });
    } catch (error) {
      logger.error('Soft-fail match events:', error.message);
      return res.json({ success: true, count: 0, data: [] });
    }
  });

  /**
   * GET /api/matches/:id/lineups
   */
  getMatchLineups = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const lineups = await matchService.getMatchLineups(id);
      return res.json({ success: true, data: lineups });
    } catch (error) {
      logger.error('Soft-fail match lineups:', error.message);
      return res.json({ success: true, data: [] });
    }
  });

  /**
   * GET /api/matches/league/:leagueId
   */
  getMatchesByLeague = asyncHandler(async (req, res) => {
    const { leagueId } = req.params;
    const { season } = req.query;
    try {
      const matches = await matchService.getMatchesByLeague(leagueId, season);
      return res.json({
        success: true,
        count: matches.length,
        data: matches,
        filters: { leagueId, season }
      });
    } catch (error) {
      logger.error('Soft-fail matches by league:', error.message);
      return res.json({
        success: true,
        count: 0,
        data: [],
        filters: { leagueId, season }
      });
    }
  });

  /**
   * GET /api/matches/team/:teamId
   */
  getMatchesByTeam = asyncHandler(async (req, res) => {
    const { teamId } = req.params;
    const { season } = req.query;
    try {
      const matches = await matchService.getMatchesByTeam(teamId, season);
      return res.json({
        success: true,
        count: matches.length,
        data: matches,
        filters: { teamId, season }
      });
    } catch (error) {
      logger.error('Soft-fail matches by team:', error.message);
      return res.json({
        success: true,
        count: 0,
        data: [],
        filters: { teamId, season }
      });
    }
  });
}

module.exports = new MatchController();
