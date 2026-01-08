// utils/googlePlaces.js
const axios = require('axios');

/**
 * Search for places using Google Places API
 * @param {Object} options - Search options
 * @param {string} options.query - Search query
 * @param {string} options.location - Latitude,longitude coordinates
 * @param {number} options.radius - Search radius in meters
 * @param {string} options.type - Type of place (restaurant, hotel, etc.)
 * @returns {Promise<Array>} Array of places
 */
async function searchPlaces(options) {
  try {
    if (!process.env.GOOGLE_PLACES_API_KEY) {
      throw new Error('GOOGLE_PLACES_API_KEY is not configured');
    }

    const { query, location, radius = 5000, type } = options;
    
    // Use Text Search endpoint
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
      params: {
        query: query || type,
        location,
        radius,
        type: type || '',
        key: process.env.GOOGLE_PLACES_API_KEY
      }
    });

    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${response.data.status}`);
    }

    return response.data.results.map(place => ({
      name: place.name,
      address: place.formatted_address,
      coordinates: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      },
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      price_level: place.price_level,
      types: place.types,
      photos: place.photos ? place.photos.map(photo => ({
        photo_reference: photo.photo_reference,
        width: photo.width,
        height: photo.height
      })) : [],
      place_id: place.place_id
    }));
  } catch (error) {
    console.error('Google Places API Error:', error.message);
    throw error;
  }
}

/**
 * Get detailed information about a place
 * @param {string} placeId - Google Place ID
 * @returns {Promise<Object>} Detailed place information
 */
async function getPlaceDetails(placeId) {
  try {
    if (!process.env.GOOGLE_PLACES_API_KEY) {
      throw new Error('GOOGLE_PLACES_API_KEY is not configured');
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id: placeId,
        key: process.env.GOOGLE_PLACES_API_KEY,
        fields: 'name,formatted_address,geometry,rating,user_ratings_total,price_level,types,photos,opening_hours,website,formatted_phone_number,reviews'
      }
    });

    if (response.data.status !== 'OK') {
      throw new Error(`Google Places API error: ${response.data.status}`);
    }

    const place = response.data.result;
    
    return {
      name: place.name,
      address: place.formatted_address,
      coordinates: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      },
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      price_level: place.price_level,
      types: place.types,
      photos: place.photos ? place.photos.map(photo => ({
        photo_reference: photo.photo_reference,
        width: photo.width,
        height: photo.height
      })) : [],
      opening_hours: place.opening_hours,
      website: place.website,
      phone: place.formatted_phone_number,
      reviews: place.reviews ? place.reviews.map(review => ({
        author_name: review.author_name,
        author_url: review.author_url,
        rating: review.rating,
        text: review.text,
        time: review.time,
        relative_time_description: review.relative_time_description
      })) : []
    };
  } catch (error) {
    console.error('Google Places Details API Error:', error.message);
    throw error;
  }
}

/**
 * Get photo URL from photo reference
 * @param {string} photoReference - Photo reference from Google Places
 * @param {number} maxWidth - Maximum width of image
 * @returns {string} Photo URL
 */
function getPhotoUrl(photoReference, maxWidth = 400) {
  if (!photoReference || !process.env.GOOGLE_PLACES_API_KEY) {
    return null;
  }
  
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
}

module.exports = {
  searchPlaces,
  getPlaceDetails,
  getPhotoUrl
};