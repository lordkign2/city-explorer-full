// routes/places.js
const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');
const { loginRequired, isAdmin } = require('../middleware/auth');

// GET /places - Get all places with filtering
router.get('/', placeController.getAllPlaces);

// GET /places/:id - Get a specific place by ID
router.get('/:id', placeController.getPlaceById);

// POST /places - Create a new place (admin only)
router.post('/', loginRequired, isAdmin, placeController.createPlace);

// PUT /places/:id - Update a place (admin only)
router.put('/:id', loginRequired, isAdmin, placeController.updatePlace);

// DELETE /places/:id - Delete a place (admin only)
router.delete('/:id', loginRequired, isAdmin, placeController.deletePlace);

// GET /places/city/:cityId - Get places by city with pagination
router.get('/city/:cityId', placeController.getPlacesByCity);

// POST /places/import - Import places from Google Places API (admin only)
router.post('/import', loginRequired, isAdmin, placeController.importPlaces);

module.exports = router;