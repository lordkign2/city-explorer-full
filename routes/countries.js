// routes/countries.js
const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');
const { loginRequired } = require('../middleware/auth');

// GET: View a single country and its cities
router.get('/:id', loginRequired, countryController.getCountryPage);

module.exports = router;