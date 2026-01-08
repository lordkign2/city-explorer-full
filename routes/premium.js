// routes/premium.js
const express = require('express');
const router = express.Router();
const premiumController = require('../controllers/premiumController');
const { loginRequired } = require('../middleware/auth');

// GET /premium/status - Get user's premium status
router.get('/status', loginRequired, premiumController.getPremiumStatus);

// POST /premium/upgrade - Upgrade user to premium (demo only)
router.post('/upgrade', loginRequired, premiumController.upgradeToPremium);

// POST /premium/unlimited-itinerary - Create unlimited itinerary (premium feature)
router.post('/unlimited-itinerary', loginRequired, premiumController.requirePremium, premiumController.createUnlimitedItinerary);

// GET /premium/export - Export itinerary (premium feature)
router.get('/export', loginRequired, premiumController.requirePremium, premiumController.exportItinerary);

module.exports = router;