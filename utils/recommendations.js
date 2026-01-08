// utils/recommendations.js
const City = require('../models/City');
const Place = require('../models/Place');
const User = require('../models/User');

/**
 * Get personalized city recommendations for a user
 * @param {string} userId - User ID
 * @param {number} limit - Number of recommendations to return
 * @returns {Promise<Array>} Recommended cities
 */
async function getCityRecommendations(userId, limit = 10) {
  try {
    // Get user information
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Start with all cities
    let cities = await City.find({}).populate('country');
    
    // Score cities based on user preferences
    cities = cities.map(city => {
      let score = 0;
      
      // Boost score based on user interests
      if (user.preferences && user.preferences.interests) {
        const cityTags = [...(city.categories || []), ...(city.tags || [])];
        const matchingInterests = user.preferences.interests.filter(interest => 
          cityTags.some(tag => tag.toLowerCase().includes(interest.toLowerCase()))
        );
        score += matchingInterests.length * 10;
      }
      
      // Boost score based on user location (if available)
      if (user.location) {
        // This would require reverse geocoding to compare locations
        // For now, we'll skip this
      }
      
      // Boost score based on popularity
      score += city.viewCount || 0;
      
      return {
        ...city.toObject(),
        recommendationScore: score
      };
    });
    
    // Sort by recommendation score
    cities.sort((a, b) => b.recommendationScore - a.recommendationScore);
    
    // Return top recommendations
    return cities.slice(0, limit);
  } catch (error) {
    console.error('Error getting city recommendations:', error);
    throw error;
  }
}

/**
 * Get personalized place recommendations for a city
 * @param {string} userId - User ID
 * @param {string} cityId - City ID
 * @param {number} limit - Number of recommendations to return
 * @returns {Promise<Array>} Recommended places
 */
async function getPlaceRecommendations(userId, cityId, limit = 10) {
  try {
    // Get user information
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Get city information
    const city = await City.findById(cityId);
    if (!city) {
      throw new Error('City not found');
    }
    
    // Get places in this city
    let places = await Place.find({ cityId });
    
    // Score places based on user preferences
    places = places.map(place => {
      let score = 0;
      
      // Boost score based on user interests
      if (user.preferences && user.preferences.interests) {
        const placeTags = [...(place.categories || []), ...(place.tags || [])];
        const matchingInterests = user.preferences.interests.filter(interest => 
          placeTags.some(tag => tag.toLowerCase().includes(interest.toLowerCase()))
        );
        score += matchingInterests.length * 15;
      }
      
      // Boost score based on place type preference
      if (user.preferences && user.preferences.interests) {
        if (user.preferences.interests.includes('food') && place.type === 'restaurant') {
          score += 20;
        }
        if (user.preferences.interests.includes('hotel') && place.type === 'hotel') {
          score += 20;
        }
        if (user.preferences.interests.includes('attraction') && place.type === 'attraction') {
          score += 20;
        }
      }
      
      // Boost score based on ratings
      if (place.rating && place.rating.average) {
        score += place.rating.average * 5; // Up to 25 points for 5-star rating
      }
      
      // Boost score based on popularity
      score += place.viewCount || 0;
      
      return {
        ...place.toObject(),
        recommendationScore: score
      };
    });
    
    // Sort by recommendation score
    places.sort((a, b) => b.recommendationScore - a.recommendationScore);
    
    // Return top recommendations
    return places.slice(0, limit);
  } catch (error) {
    console.error('Error getting place recommendations:', error);
    throw error;
  }
}

/**
 * Get trending cities based on view counts and recent activity
 * @param {number} limit - Number of cities to return
 * @returns {Promise<Array>} Trending cities
 */
async function getTrendingCities(limit = 10) {
  try {
    // Get cities sorted by view count
    const cities = await City.find({})
      .populate('country')
      .sort({ viewCount: -1 })
      .limit(limit);
    
    return cities;
  } catch (error) {
    console.error('Error getting trending cities:', error);
    throw error;
  }
}

/**
 * Get similar cities based on categories/tags
 * @param {string} cityId - City ID to find similar cities for
 * @param {number} limit - Number of similar cities to return
 * @returns {Promise<Array>} Similar cities
 */
async function getSimilarCities(cityId, limit = 5) {
  try {
    // Get the reference city
    const referenceCity = await City.findById(cityId);
    if (!referenceCity) {
      throw new Error('City not found');
    }
    
    // Get all other cities
    const cities = await City.find({ _id: { $ne: cityId } }).populate('country');
    
    // Score cities based on similarity to reference city
    const scoredCities = cities.map(city => {
      let score = 0;
      
      // Compare categories/tags
      const refTags = [...(referenceCity.categories || []), ...(referenceCity.tags || [])];
      const cityTags = [...(city.categories || []), ...(city.tags || [])];
      
      const commonTags = refTags.filter(tag => 
        cityTags.some(ctag => ctag.toLowerCase() === tag.toLowerCase())
      );
      
      score += commonTags.length * 10;
      
      // Compare country/region
      if (referenceCity.country && city.country) {
        if (referenceCity.country._id.toString() === city.country._id.toString()) {
          score += 15;
        } else if (referenceCity.country.region === city.country.region) {
          score += 10;
        }
      }
      
      return {
        ...city.toObject(),
        similarityScore: score
      };
    });
    
    // Sort by similarity score
    scoredCities.sort((a, b) => b.similarityScore - a.similarityScore);
    
    // Return top similar cities
    return scoredCities.slice(0, limit);
  } catch (error) {
    console.error('Error getting similar cities:', error);
    throw error;
  }
}

module.exports = {
  getCityRecommendations,
  getPlaceRecommendations,
  getTrendingCities,
  getSimilarCities
};