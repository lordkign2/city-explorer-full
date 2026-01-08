// routes/exports.js
const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const { loginRequired } = require('../middleware/auth');

// GET /exports/itinerary/:id/pdf - Export itinerary as PDF
router.get('/itinerary/:id/pdf', loginRequired, exportController.exportItineraryPDF);

// GET /exports/itinerary/:id/json - Export itinerary as JSON
router.get('/itinerary/:id/json', loginRequired, exportController.exportItineraryJSON);

// GET /exports/itinerary/:id/calendar - Export itinerary to calendar (ICS)
router.get('/itinerary/:id/calendar', loginRequired, exportController.exportItineraryCalendar);

module.exports = router;