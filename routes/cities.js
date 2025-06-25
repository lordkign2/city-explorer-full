const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');
const {cache} = require("../middleware/cache");
const { loginRequired } = require('../middleware/auth');

// GET: View a single city page with weather, map, trivia, chat, etc.
router.get('/:id', loginRequired, cityController.getCityPage);

// POST: Submit trivia answers
router.post('/:id/trivia', loginRequired, cityController.submitTrivia);

// Optional: Add or remove a favorite city
router.post('/:id/favorite', loginRequired, cityController.toggleFavorite);

// GET: trending cache
router.get('/trending', cache("trending_cities"), cityController.getTrendingCites);

module.exports = router;