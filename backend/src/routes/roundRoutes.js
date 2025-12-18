const express = require('express');
const router = express.Router();
const roundController = require('../controllers/roundController');

router.get('/', roundController.getRounds);
router.get('/:id', roundController.getRoundById);

module.exports = router;
