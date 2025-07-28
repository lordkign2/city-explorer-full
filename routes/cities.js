const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');
const {cache} = require("../middleware/cache");
const { loginRequired } = require('../middleware/auth');

// GET: List of all available cities
router.get('/', cityController.getAllCities);
// GET: View a single city page with weather, map, trivia, chat, etc.
router.get('/:id', loginRequired, cityController.getCityPage);

// POST: Submit trivia answers
router.post('/:id/trivia', loginRequired, cityController.submitTrivia);

//GET: get trivia from API
router.get('/:id/trivia/:city', loginRequired, cityController.getTrivia);

router.get('/trivia/leaderboard/:city', loginRequired, cityController.getLeaderboard);


// Add or remove a favorite city
router.post("/toggle", loginRequired, cityController.toggleFavorite);

module.exports = router;