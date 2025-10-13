const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

// Search teams
router.get('/search', teamController.searchTeams.bind(teamController));

// Teams by league
router.get('/league/:leagueId', teamController.getTeamsByLeague.bind(teamController));

// Team by ID
router.get('/:id', teamController.getTeamById.bind(teamController));

// Team statistics
router.get('/:id/statistics', teamController.getTeamStatistics.bind(teamController));

// Team squad
router.get('/:id/squad', teamController.getTeamSquad.bind(teamController));

module.exports = router;
