// controllers/placeController.js
const Place = require('../models/Place');
const City = require('../models/City');
const Review = require('../models/Review');
const { searchPlaces, getPlaceDetails, getPhotoUrl } = require('../utils/googlePlaces');
const { generateAffiliateLink } = require('../utils/affiliate');
const redisClient = require('../redisClient');

exports.getAllPlaces = async (req, res) => {
  try {
    const { cityId, type, category, search } = req.query;
    let filter = {};

    if (cityId) filter.cityId = cityId;
    if (type) filter.type = type;
    if (category) filter.categories = { $in: [category] };
    if (search) filter.name = { $regex: search, $options: 'i' };

    const places = await Place.find(filter)
      .populate('cityId')
      .sort({ rating: -1, viewCount: -1 })
      .limit(50);

    res.json({ success: true, places });
  } catch (err) {
    console.error('Error fetching places:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch places' });
  }
};

exports.getPlaceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to get from cache first
    const cacheKey = `place_${id}`;
    const cached = await redisClient.get(cacheKey);
    
    if (cached) {
      return res.json({ success: true, place: JSON.parse(cached) });
    }

    const place = await Place.findById(id)
      .populate('cityId')
      .populate('countryId');

    if (!place) {
      return res.status(404).json({ success: false, message: 'Place not found' });
    }

    // Increment view count
    place.viewCount += 1;
    await place.save();

    // Cache for 1 hour
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(place));

    // Get recent reviews for this place
    const reviews = await Review.find({ placeId: id })
      .populate('userId', 'username avatarUrl')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, place, reviews });
  } catch (err) {
    console.error('Error fetching place:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch place' });
  }
};

exports.createPlace = async (req, res) => {
  try {
    const placeData = { ...req.body };
    
    // Validate required fields
    if (!placeData.name || !placeData.cityId || !placeData.type) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, cityId, and type are required' 
      });
    }

    const place = new Place(placeData);
    await place.save();

    res.status(201).json({ success: true, place });
  } catch (err) {
    console.error('Error creating place:', err);
    res.status(500).json({ success: false, message: 'Failed to create place' });
  }
};

exports.updatePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };

    const place = await Place.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!place) {
      return res.status(404).json({ success: false, message: 'Place not found' });
    }

    // Clear cache
    await redisClient.del(`place_${id}`);

    res.json({ success: true, place });
  } catch (err) {
    console.error('Error updating place:', err);
    res.status(500).json({ success: false, message: 'Failed to update place' });
  }
};

exports.deletePlace = async (req, res) => {
  try {
    const { id } = req.params;

    const place = await Place.findByIdAndDelete(id);

    if (!place) {
      return res.status(404).json({ success: false, message: 'Place not found' });
    }

    // Clear cache
    await redisClient.del(`place_${id}`);

    res.json({ success: true, message: 'Place deleted successfully' });
  } catch (err) {
    console.error('Error deleting place:', err);
    res.status(500).json({ success: false, message: 'Failed to delete place' });
  }
};

// Import places from Google Places API
exports.importPlaces = async (req, res) => {
  try {
    const { cityId, query, type } = req.body;
    
    // Validate required fields
    if (!cityId || !query) {
      return res.status(400).json({ 
        success: false, 
        message: 'City ID and query are required' 
      });
    }

    // Get city information
    const city = await City.findById(cityId);
    if (!city) {
      return res.status(404).json({ success: false, message: 'City not found' });
    }

    // Search places using Google Places API
    const places = await searchPlaces({
      query,
      location: `${city.coordinates.lat},${city.coordinates.lng}`,
      type
    });

    // Convert to our Place model format
    const importedPlaces = [];
    
    for (const googlePlace of places) {
      // Check if place already exists
      const existingPlace = await Place.findOne({
        name: googlePlace.name,
        cityId
      });
      
      if (existingPlace) {
        // Update existing place
        existingPlace.rating = {
          average: googlePlace.rating,
          count: googlePlace.user_ratings_total
        };
        existingPlace.coordinates = googlePlace.coordinates;
        existingPlace.categories = googlePlace.types;
        
        // Generate affiliate link for hotels
        if (googlePlace.types.includes('lodging')) {
          existingPlace.affiliateLink = generateAffiliateLink(
            'booking.com',
            'https://booking.com',
            { ss: googlePlace.name }
          );
        }
        
        await existingPlace.save();
        importedPlaces.push(existingPlace);
      } else {
        // Create new place
        const newPlace = new Place({
          name: googlePlace.name,
          cityId,
          countryId: city.country,
          type: determinePlaceType(googlePlace.types),
          address: googlePlace.address,
          coordinates: googlePlace.coordinates,
          categories: googlePlace.types,
          rating: {
            average: googlePlace.rating,
            count: googlePlace.user_ratings_total
          },
          // Generate affiliate link for hotels
          affiliateLink: googlePlace.types.includes('lodging') ? 
            generateAffiliateLink('booking.com', 'https://booking.com', { ss: googlePlace.name }) :
            null
        });
        
        await newPlace.save();
        importedPlaces.push(newPlace);
      }
    }

    res.json({ 
      success: true, 
      message: `Imported ${importedPlaces.length} places`,
      places: importedPlaces
    });
  } catch (err) {
    console.error('Error importing places:', err);
    res.status(500).json({ success: false, message: 'Failed to import places' });
  }
};

// Helper function to determine place type
function determinePlaceType(types) {
  if (types.includes('restaurant')) return 'restaurant';
  if (types.includes('lodging')) return 'hotel';
  if (types.includes('tourist_attraction')) return 'attraction';
  if (types.includes('museum')) return 'attraction';
  if (types.includes('park')) return 'attraction';
  return 'attraction'; // default
}

// Get places by city with pagination
exports.getPlacesByCity = async (req, res) => {
  try {
    const { cityId } = req.params;
    const { page = 1, limit = 10, type, category } = req.query;
    
    let filter = { cityId };
    if (type) filter.type = type;
    if (category) filter.categories = { $in: [category] };

    const places = await Place.find(filter)
      .populate('cityId')
      .sort({ rating: -1, viewCount: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Place.countDocuments(filter);

    res.json({
      success: true,
      places,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPlaces: total
      }
    });
  } catch (err) {
    console.error('Error fetching places by city:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch places' });
  }
};