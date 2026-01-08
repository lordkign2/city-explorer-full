// routes/maps.js
const express = require('express');
const router = express.Router();
const mapController = require('../controllers/mapController');

// GET /maps/city/:cityId - Get map data for a city
router.get('/city/:cityId', mapController.getCityMapData);

// GET /maps/directions - Get directions between two points
router.get('/directions', mapController.getDirections);

// GET /maps/nearby - Get nearby places
router.get('/nearby', mapController.getNearbyPlaces);

// GET /maps/place/:placeId - Get place details for map popup
router.get('/place/:placeId', mapController.getPlaceMapDetails);

module.exports = router;