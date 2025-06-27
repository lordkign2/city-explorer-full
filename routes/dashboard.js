// routes/dashboard.js
const express = require('express');
const router = express.Router();
const { loginRequired } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');

// All dashboard routes require login
router.use(loginRequired);

// GET /dashboard
router.get('/', dashboardController.getDashboard);

// GET /dashboard/settings
router.get('/settings', dashboardController.getSettings);

// // POST /dashboard/settings
router.post('/settings', dashboardController.updateSettings);

// // GET /dashboard/favorites
router.get('/favorites', dashboardController.getFavorites);

// // GET /dashboard/trivia-history
router.get('/trivia-history', dashboardController.getTriviaHistory);

module.exports = router;