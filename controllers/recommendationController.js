// controllers/recommendationController.js
const { 
  getCityRecommendations, 
  getPlaceRecommendations, 
  getTrendingCities, 
  getSimilarCities 
} = require('../utils/recommendations');
const City = require('../models/City');
const Place = require('../models/Place');

/**
 * Get personalized city recommendations for authenticated user
 */
exports.getRecommendedCities = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required for personalized recommendations' 
      });
    }
    
    const { limit = 10 } = req.query;
    const recommendations = await getCityRecommendations(req.user._id, parseInt(limit));
    
    res.json({
      success: true,
      recommendations
    });
  } catch (err) {
    console.error('Error getting city recommendations:', err);
    res.status(500).json({ success: false, message: 'Failed to get recommendations' });
  }
};

/**
 * Get personalized place recommendations for a city
 */
exports.getRecommendedPlaces = async (req, res) => {
  try {
    const { cityId } = req.params;
    const { limit = 10 } = req.query;
    
    // Validate city ID
    const city = await City.findById(cityId);
    if (!city) {
      return res.status(404).json({ success: false, message: 'City not found' });
    }
    
    let recommendations;
    
    if (req.user) {
      // Personalized recommendations for authenticated users
      recommendations = await getPlaceRecommendations(req.user._id, cityId, parseInt(limit));
    } else {
      // Generic recommendations based on ratings and popularity
      recommendations = await Place.find({ cityId })
        .sort({ 'rating.average': -1, viewCount: -1 })
        .limit(parseInt(limit));
    }
    
    res.json({
      success: true,
      recommendations
    });
  } catch (err) {
    console.error('Error getting place recommendations:', err);
    res.status(500).json({ success: false, message: 'Failed to get recommendations' });
  }
};

/**
 * Get trending cities
 */
exports.getTrending = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const trendingCities = await getTrendingCities(parseInt(limit));
    
    res.json({
      success: true,
      cities: trendingCities
    });
  } catch (err) {
    console.error('Error getting trending cities:', err);
    res.status(500).json({ success: false, message: 'Failed to get trending cities' });
  }
};

/**
 * Get similar cities
 */
exports.getSimilar = async (req, res) => {
  try {
    const { cityId } = req.params;
    const { limit = 5 } = req.query;
    
    // Validate city ID
    const city = await City.findById(cityId);
    if (!city) {
      return res.status(404).json({ success: false, message: 'City not found' });
    }
    
    const similarCities = await getSimilarCities(cityId, parseInt(limit));
    
    res.json({
      success: true,
      cities: similarCities
    });
  } catch (err) {
    console.error('Error getting similar cities:', err);
    res.status(500).json({ success: false, message: 'Failed to get similar cities' });
  }
};

/**
 * Update user preferences
 */
exports.updatePreferences = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required to update preferences' 
      });
    }
    
    const { budget, interests } = req.body;
    
    // Validate inputs
    const validBudgets = ['low', 'medium', 'high'];
    if (budget && !validBudgets.includes(budget)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid budget value. Must be low, medium, or high' 
      });
    }
    
    // Update user preferences
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (budget) user.preferences.budget = budget;
    if (interests) user.preferences.interests = interests;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (err) {
    console.error('Error updating preferences:', err);
    res.status(500).json({ success: false, message: 'Failed to update preferences' });
  }
};