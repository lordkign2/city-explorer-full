// controllers/mapController.js
const City = require('../models/City');
const Place = require('../models/Place');
const { calculateDistance, clusterPlaces, generateDirectionsUrl } = require('../utils/maps');

/**
 * Get map data for a city
 */
exports.getCityMapData = async (req, res) => {
  try {
    const { cityId } = req.params;
    const { type, category } = req.query;
    
    // Get city information
    const city = await City.findById(cityId);
    if (!city) {
      return res.status(404).json({ success: false, message: 'City not found' });
    }
    
    // Get places for this city
    let filter = { cityId };
    if (type) filter.type = type;
    if (category) filter.categories = { $in: [category] };
    
    const places = await Place.find(filter);
    
    // Cluster nearby places
    const clusters = clusterPlaces(places, 1); // 1km clustering distance
    
    res.json({
      success: true,
      city: {
        name: city.name,
        coordinates: city.coordinates
      },
      places,
      clusters
    });
  } catch (err) {
    console.error('Error fetching map data:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch map data' });
  }
};

/**
 * Get directions between two points
 */
exports.getDirections = async (req, res) => {
  try {
    const { originLat, originLng, destLat, destLng, mode } = req.query;
    
    // Validate coordinates
    if (!originLat || !originLng || !destLat || !destLng) {
      return res.status(400).json({ 
        success: false, 
        message: 'Origin and destination coordinates are required' 
      });
    }
    
    const origin = {
      lat: parseFloat(originLat),
      lng: parseFloat(originLng)
    };
    
    const destination = {
      lat: parseFloat(destLat),
      lng: parseFloat(destLng)
    };
    
    // Calculate distance
    const distance = calculateDistance(origin, destination);
    
    // Generate directions URL
    const directionsUrl = generateDirectionsUrl(origin, destination, mode);
    
    res.json({
      success: true,
      origin,
      destination,
      distance: distance.toFixed(2),
      distanceUnit: 'km',
      directionsUrl,
      mode: mode || 'driving'
    });
  } catch (err) {
    console.error('Error generating directions:', err);
    res.status(500).json({ success: false, message: 'Failed to generate directions' });
  }
};

/**
 * Get nearby places
 */
exports.getNearbyPlaces = async (req, res) => {
  try {
    const { lat, lng, radius = 5, type, category } = req.query;
    
    // Validate coordinates
    if (!lat || !lng) {
      return res.status(400).json({ 
        success: false, 
        message: 'Latitude and longitude are required' 
      });
    }
    
    const userLocation = {
      lat: parseFloat(lat),
      lng: parseFloat(lng)
    };
    
    // Get all places (this would ideally be optimized with geospatial queries)
    let filter = {};
    if (type) filter.type = type;
    if (category) filter.categories = { $in: [category] };
    
    const allPlaces = await Place.find(filter);
    
    // Filter places within radius
    const nearbyPlaces = allPlaces.filter(place => {
      if (!place.coordinates) return false;
      const distance = calculateDistance(userLocation, place.coordinates);
      return distance <= radius;
    });
    
    // Sort by distance
    nearbyPlaces.sort((a, b) => {
      const distA = calculateDistance(userLocation, a.coordinates);
      const distB = calculateDistance(userLocation, b.coordinates);
      return distA - distB;
    });
    
    res.json({
      success: true,
      places: nearbyPlaces.slice(0, 20), // Limit to 20 results
      count: nearbyPlaces.length,
      radius: parseFloat(radius),
      radiusUnit: 'km'
    });
  } catch (err) {
    console.error('Error finding nearby places:', err);
    res.status(500).json({ success: false, message: 'Failed to find nearby places' });
  }
};

/**
 * Get place details for map popup
 */
exports.getPlaceMapDetails = async (req, res) => {
  try {
    const { placeId } = req.params;
    
    const place = await Place.findById(placeId)
      .populate('cityId', 'name');
      
    if (!place) {
      return res.status(404).json({ success: false, message: 'Place not found' });
    }
    
    res.json({
      success: true,
      place: {
        id: place._id,
        name: place.name,
        type: place.type,
        coordinates: place.coordinates,
        rating: place.rating,
        priceRange: place.priceRange,
        city: place.cityId ? place.cityId.name : null,
        address: place.address,
        description: place.description
      }
    });
  } catch (err) {
    console.error('Error fetching place map details:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch place details' });
  }
};