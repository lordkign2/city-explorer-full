// routes/index.js
const express = require('express');
const router = express.Router();
const City = require('../models/City');
const redisClient = require('../redisClient');

// GET: Landing page with trending cities
router.get('/', async (req, res) => {
  try {
    // Try Redis cache
    let trendingCities = await redisClient.get('trending_cities');
    if (trendingCities) {
      trendingCities = JSON.parse(trendingCities);
    } else {
      // Fetch from DB and cache in Redis
      trendingCities = await City.find().sort({ views: -1 }).limit(6).lean();
      await redisClient.set('trending_cities', JSON.stringify(trendingCities), { EX: 3600 }); // 1 hour
    }

    res.render('pages/landing', {
      trendingCities,
      user: req.user
    });
  } catch (err) {
    console.error('Error loading landing page:', err);
    req.flash('error', 'Unable to load trending cities.');
    res.render('pages/landing', { trendingCities: [], user: req.user });
  }
});

module.exports = router;