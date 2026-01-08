// routes/gamification.js
const express = require('express');
const router = express.Router();
const gamificationController = require('../controllers/gamificationController');
const { loginRequired } = require('../middleware/auth');

// GET /gamification/badges - Get all badges
router.get('/badges', gamificationController.getAllBadges);

// GET /gamification/badges/:userId - Get user's badges
router.get('/badges/:userId', gamificationController.getUserBadges);

// POST /gamification/badges/award - Award a badge to user (admin only)
router.post('/badges/award', loginRequired, gamificationController.awardBadge);

// GET /gamification/leaderboard - Get leaderboard
router.get('/leaderboard', gamificationController.getLeaderboard);

// GET /gamification/rank - Get user's rank
router.get('/rank', loginRequired, gamificationController.getUserRank);

module.exports = router;