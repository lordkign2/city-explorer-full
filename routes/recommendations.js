// routes/recommendations.js
const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const { loginRequired } = require('../middleware/auth');

// GET /recommendations/cities - Get personalized city recommendations
router.get('/cities', loginRequired, recommendationController.getRecommendedCities);

// GET /recommendations/places/:cityId - Get personalized place recommendations for a city
router.get('/places/:cityId', recommendationController.getRecommendedPlaces);

// GET /recommendations/trending - Get trending cities
router.get('/trending', recommendationController.getTrending);

// GET /recommendations/similar/:cityId - Get similar cities
router.get('/similar/:cityId', recommendationController.getSimilar);

// PUT /recommendations/preferences - Update user preferences
router.put('/preferences', loginRequired, recommendationController.updatePreferences);

module.exports = router;