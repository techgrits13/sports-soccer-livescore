const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const ValidationMiddleware = require('../middleware/validation');

// Live matches
router.get('/live', matchController.getLiveMatches);

// Matches by league (must come before /:id to avoid conflicts)
router.get(
  '/league/:leagueId',
  ValidationMiddleware.validateLeagueId,
  ValidationMiddleware.validateSeasonQuery,
  matchController.getMatchesByLeague
);

// Matches by team
router.get(
  '/team/:teamId',
  ValidationMiddleware.validateTeamId,
  ValidationMiddleware.validateSeasonQuery,
  matchController.getMatchesByTeam
);

// Get matches with filters
router.get(
  '/',
  ValidationMiddleware.validateDateQuery,
  matchController.getMatches
);

// Match details
router.get(
  '/:id',
  ValidationMiddleware.validateMatchId,
  matchController.getMatchDetails
);

// Match statistics
router.get(
  '/:id/statistics',
  ValidationMiddleware.validateMatchId,
  matchController.getMatchStatistics
);

// Match events
router.get(
  '/:id/events',
  ValidationMiddleware.validateMatchId,
  matchController.getMatchEvents
);

// Match lineups
router.get(
  '/:id/lineups',
  ValidationMiddleware.validateMatchId,
  matchController.getMatchLineups
);

module.exports = router;
