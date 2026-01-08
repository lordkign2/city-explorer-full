// routes/itineraries.js
const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itineraryController');
const { loginRequired } = require('../middleware/auth');

// GET /itineraries - Get all itineraries with filtering
router.get('/', itineraryController.getAllItineraries);

// GET /itineraries/:id - Get a specific itinerary by ID
router.get('/:id', itineraryController.getItineraryById);

// POST /itineraries - Create a new itinerary
router.post('/', itineraryController.createItinerary);

// PUT /itineraries/:id - Update an itinerary
router.put('/:id', loginRequired, itineraryController.updateItinerary);

// DELETE /itineraries/:id - Delete an itinerary
router.delete('/:id', loginRequired, itineraryController.deleteItinerary);

// POST /itineraries/generate - Generate AI itinerary
router.post('/generate', itineraryController.generateItinerary);

// GET /itineraries/user - Get authenticated user's itineraries
router.get('/user', loginRequired, itineraryController.getUserItineraries);

// POST /itineraries/save - Save an itinerary to user profile
router.post('/save', loginRequired, itineraryController.saveItinerary);

module.exports = router;