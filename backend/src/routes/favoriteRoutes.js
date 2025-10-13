const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');

// Add team favorite
router.post('/team', favoriteController.addTeamFavorite.bind(favoriteController));

// Add league favorite
router.post('/league', favoriteController.addLeagueFavorite.bind(favoriteController));

// Add match favorite
router.post('/match', favoriteController.addMatchFavorite.bind(favoriteController));

// Get user favorites
router.get('/:userId', favoriteController.getUserFavorites.bind(favoriteController));

// Check if favorited
router.get('/:userId/check', favoriteController.checkFavorite.bind(favoriteController));

// Remove favorite
router.delete('/:id', favoriteController.removeFavorite.bind(favoriteController));

module.exports = router;
