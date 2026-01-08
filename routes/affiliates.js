// routes/affiliates.js
const express = require('express');
const router = express.Router();
const affiliateController = require('../controllers/affiliateController');
// Removed unused middleware import

// POST /affiliates/link - Generate affiliate link
router.post('/link', affiliateController.generateLink);

// POST /affiliates/click - Track affiliate click
router.post('/click', affiliateController.trackClick);

// POST /affiliates/commission - Calculate estimated commission
router.post('/commission', affiliateController.estimateCommission);

// GET /affiliates/disclosure - Get affiliate disclosure
router.get('/disclosure', affiliateController.getDisclosure);

module.exports = router;