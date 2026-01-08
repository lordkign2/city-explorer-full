// controllers/itineraryController.js
const Itinerary = require('../models/Itinerary');
const City = require('../models/City');
const Place = require('../models/Place');
const User = require('../models/User');
const redisClient = require('../redisClient');
const axios = require('axios');
const { generateItinerary } = require('../utils/aiItinerary');

exports.getAllItineraries = async (req, res) => {
  try {
    const { cityId, userId, isPublic } = req.query;
    let filter = {};

    if (cityId) filter.cityId = cityId;
    if (userId) filter.userId = userId;
    if (isPublic !== undefined) filter.isPublic = isPublic === 'true';

    const itineraries = await Itinerary.find(filter)
      .populate('userId', 'username')
      .populate('cityId')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, itineraries });
  } catch (err) {
    console.error('Error fetching itineraries:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch itineraries' });
  }
};

exports.getItineraryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to get from cache first
    const cacheKey = `itinerary_${id}`;
    const cached = await redisClient.get(cacheKey);
    
    if (cached) {
      return res.json({ success: true, itinerary: JSON.parse(cached) });
    }

    const itinerary = await Itinerary.findById(id)
      .populate('userId', 'username')
      .populate('cityId');

    if (!itinerary) {
      return res.status(404).json({ success: false, message: 'Itinerary not found' });
    }

    // Increment view count for public itineraries
    if (itinerary.isPublic) {
      itinerary.viewCount += 1;
      await itinerary.save();
    }

    // Cache for 30 minutes
    await redisClient.setEx(cacheKey, 1800, JSON.stringify(itinerary));

    res.json({ success: true, itinerary });
  } catch (err) {
    console.error('Error fetching itinerary:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch itinerary' });
  }
};

exports.createItinerary = async (req, res) => {
  try {
    const itineraryData = { ...req.body };
    
    // Set userId if authenticated
    if (req.user) {
      itineraryData.userId = req.user._id;
    } else {
      // For anonymous users, use session ID
      itineraryData.sessionId = req.sessionID;
    }

    const itinerary = new Itinerary(itineraryData);
    await itinerary.save();

    res.status(201).json({ success: true, itinerary });
  } catch (err) {
    console.error('Error creating itinerary:', err);
    res.status(500).json({ success: false, message: 'Failed to create itinerary' });
  }
};

exports.updateItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };

    // Check ownership
    const itinerary = await Itinerary.findById(id);
    if (!itinerary) {
      return res.status(404).json({ success: false, message: 'Itinerary not found' });
    }

    // Check if user owns this itinerary
    const isOwner = (req.user && itinerary.userId && req.user._id.toString() === itinerary.userId.toString()) ||
                   (!req.user && req.sessionID === itinerary.sessionId);
                   
    if (!isOwner) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this itinerary' });
    }

    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'username')
     .populate('cityId');

    // Clear cache
    await redisClient.del(`itinerary_${id}`);

    res.json({ success: true, itinerary: updatedItinerary });
  } catch (err) {
    console.error('Error updating itinerary:', err);
    res.status(500).json({ success: false, message: 'Failed to update itinerary' });
  }
};

exports.deleteItinerary = async (req, res) => {
  try {
    const { id } = req.params;

    // Check ownership
    const itinerary = await Itinerary.findById(id);
    if (!itinerary) {
      return res.status(404).json({ success: false, message: 'Itinerary not found' });
    }

    // Check if user owns this itinerary
    const isOwner = (req.user && itinerary.userId && req.user._id.toString() === itinerary.userId.toString()) ||
                   (!req.user && req.sessionID === itinerary.sessionId);
                   
    if (!isOwner) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this itinerary' });
    }

    await Itinerary.findByIdAndDelete(id);

    // Clear cache
    await redisClient.del(`itinerary_${id}`);

    res.json({ success: true, message: 'Itinerary deleted successfully' });
  } catch (err) {
    console.error('Error deleting itinerary:', err);
    res.status(500).json({ success: false, message: 'Failed to delete itinerary' });
  }
};

// AI-powered itinerary generation
exports.generateItinerary = async (req, res) => {
  try {
    const { cityId, days, budget, interests, startDate } = req.body;
    
    // Validate required fields
    if (!cityId || !days || !budget) {
      return res.status(400).json({ 
        success: false, 
        message: 'City, days, and budget are required' 
      });
    }

    // Get city information
    const city = await City.findById(cityId);
    if (!city) {
      return res.status(404).json({ success: false, message: 'City not found' });
    }

    // Get weather information
    let weatherInfo = null;
    try {
      const weatherApiKey = process.env.WEATHER_API_KEY;
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&units=metric&appid=${weatherApiKey}`
      );
      weatherInfo = {
        condition: weatherResponse.data.weather[0].main,
        temperature: weatherResponse.data.main.temp
      };
    } catch (weatherErr) {
      console.error('Weather API error:', weatherErr.message);
    }

    // Prepare preferences for AI
    const preferences = {
      city: city.name,
      days: parseInt(days),
      budget,
      interests: interests || [],
      weather: weatherInfo
    };

    // Generate itinerary with AI
    const aiGeneratedItinerary = await generateItinerary(preferences);
    
    const itineraryData = {
      userId: req.user ? req.user._id : null,
      sessionId: req.user ? null : req.sessionID,
      cityId,
      cityName: city.name,
      title: aiGeneratedItinerary.title || `${days}-Day ${city.name} Adventure`,
      description: aiGeneratedItinerary.description || `A personalized ${days}-day itinerary for ${city.name} based on your preferences.`,
      days: aiGeneratedItinerary.days || [],
      preferences: {
        budget,
        interests,
        startDate: startDate ? new Date(startDate) : new Date()
      },
      weather: weatherInfo
    };

    const itinerary = new Itinerary(itineraryData);
    await itinerary.save();

    res.status(201).json({ 
      success: true, 
      itinerary,
      message: 'Itinerary generated successfully with AI!' 
    });
  } catch (err) {
    console.error('Error generating itinerary:', err);
    
    // Fallback to template-based generation if AI fails
    try {
      const { cityId, days, budget, interests, startDate } = req.body;
      const city = await City.findById(cityId);
      
      let weatherInfo = null;
      try {
        const weatherApiKey = process.env.WEATHER_API_KEY;
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&units=metric&appid=${weatherApiKey}`
        );
        weatherInfo = {
          condition: weatherResponse.data.weather[0].main,
          temperature: weatherResponse.data.main.temp
        };
      } catch (weatherErr) {
        console.error('Weather API error:', weatherErr.message);
      }
      
      const preferences = {
        city: city.name,
        days: parseInt(days),
        budget,
        interests: interests || [],
        weather: weatherInfo
      };
      
      const templateItinerary = await generateItinerary(preferences);
      
      const itineraryData = {
        userId: req.user ? req.user._id : null,
        sessionId: req.user ? null : req.sessionID,
        cityId,
        cityName: city.name,
        title: templateItinerary.title || `${days}-Day ${city.name} Adventure`,
        description: templateItinerary.description || `A personalized ${days}-day itinerary for ${city.name} based on your preferences.`,
        days: templateItinerary.days || [],
        preferences: {
          budget,
          interests,
          startDate: startDate ? new Date(startDate) : new Date()
        },
        weather: weatherInfo
      };

      const itinerary = new Itinerary(itineraryData);
      await itinerary.save();

      res.status(201).json({ 
        success: true, 
        itinerary,
        message: 'Itinerary generated successfully with template fallback!' 
      });
    } catch (fallbackErr) {
      console.error('Error in fallback itinerary generation:', fallbackErr);
      res.status(500).json({ success: false, message: 'Failed to generate itinerary' });
    }
  }
};

// Get user's saved itineraries
exports.getUserItineraries = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const itineraries = await Itinerary.find({ userId: req.user._id })
      .populate('cityId')
      .sort({ createdAt: -1 });

    res.json({ success: true, itineraries });
  } catch (err) {
    console.error('Error fetching user itineraries:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch itineraries' });
  }
};

// Save itinerary to user profile
exports.saveItinerary = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { itineraryId } = req.body;

    // Check if already saved
    const user = await User.findById(req.user._id);
    if (user.savedItineraries.includes(itineraryId)) {
      return res.status(400).json({ success: false, message: 'Itinerary already saved' });
    }

    user.savedItineraries.push(itineraryId);
    await user.save();

    res.json({ success: true, message: 'Itinerary saved successfully' });
  } catch (err) {
    console.error('Error saving itinerary:', err);
    res.status(500).json({ success: false, message: 'Failed to save itinerary' });
  }
};