const express = require('express');
const router = express.Router();
const leagueController = require('../controllers/leagueController');

// Popular leagues
router.get('/popular', leagueController.getPopularLeagues.bind(leagueController));

// All leagues
router.get('/', leagueController.getAllLeagues.bind(leagueController));

// League by ID
router.get('/:id', leagueController.getLeagueById.bind(leagueController));

// Leagues by country
router.get('/country/:country', leagueController.getLeaguesByCountry.bind(leagueController));

// League standings
router.get('/:id/standings', leagueController.getStandings.bind(leagueController));

// Top scorers
router.get('/:id/topscorers', leagueController.getTopScorers.bind(leagueController));

// Top assists
router.get('/:id/topassists', leagueController.getTopAssists.bind(leagueController));

module.exports = router;
