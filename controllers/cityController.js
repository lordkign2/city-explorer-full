// controllers/cityController.js
const mongoose = require('mongoose');
const City = require('../models/City');
const Trivia = require('../models/Trivia');
const fetchWeather = require('../utils/weather');
const fetchHotels = require('../utils/hotels');
const fetchSchools = require('../utils/schools');
const { getCityImage } = require('../utils/unsplash');
const redisClient = require('../redisClient');
const User = require('../models/User'); // Required to update trivia scores
const Message = require('../models/Message'); // For required like "content" "cityId" "senderName"
const axios = require('axios')

exports.getAllCities = async (req, res) => {
  try {
    const cached = await redisClient.get('cities');

    let cities;
    if (cached) {
      cities = JSON.parse(cached);
    } else {
       // First populate, then lean
       cities = await City.find().populate('country').lean();

       // Cache the enriched data
       await redisClient.set('cities', JSON.stringify(cities), { EX: 300 });
    
       
    }
    res.render('pages/cities', {
      cities,
      user: req.user
    });

  } catch (err) {
    console.error('Error loading cities page:', err);
    req.flash('error', 'Unable to load cities.');
    res.render('pages/cities', { cities: [], user: req.user });
  }
};

exports.getCityPage = async (req, res) => {
  try {
    var id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid city ID format' });
    }
    const city = await City.findById(req.params.id).populate("country").lean();
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }
    
    const cityId = city._id
    const {slug} = req.params;
    console.log(req.params.id)

   

    if (!city) {
      req.flash('error', 'City not found');
      return res.redirect('/');
    }

    // Weather info
    const weather = await fetchWeather(city.name);

    // Schools (mock for now)
    const schools = await fetchSchools(city.name);

    // Trivia questions for this city

    // If no image URL, fetch from Unsplash and update
    if (!city.imageUrl) {
      const imageUrl = await getCityImage(city.name);
      city.imageUrl = imageUrl;
      await City.findByIdAndUpdate(city._id, { imageUrl });
    }

    const messages = await Message.find({ cityId }).sort({ timestamp: 1 }).lean();

    const allHotels = await fetchHotels(city.name);
    const search = req.query.search?.toLowerCase() || "";
    const maxPrice = req.query.maxPrice || Infinity;
    const page = parseInt(req.query.page) || 1;
    const perPage = 8;
    const filteredHotels = allHotels.filter(h =>
      h.hotelName.toLowerCase().includes(search) &&
      parseFloat(h.price.replace(/[^\d.]/g, '')) <= maxPrice
    ); 
    const paginatedHotels = filteredHotels.slice((page - 1) * perPage, page * perPage);
    
    
    res.render('pages/city', {
      title: `${city.name} | City Info`,
      city,
      hotels: paginatedHotels,
      currentPage: page,
      totalPages: Math.ceil(filteredHotels.length / perPage),
      query: req.query,
      weather,
      messages,
      schools,
      user: req.user,
      cityId
    });
  } catch (err) {
    console.error('City page error:', err);
    req.flash('error', 'Failed to load city information');
    res.redirect('/');
  }
};

exports.getTrivia = async (req, res) => {
  const city = req.params.city.toLowerCase();
  const redisKey = `trivia:${city}`;

  try {
   
    // Try Redis first
    let cached = await redisClient.get(redisKey);

    if (cached) {
      let questions = JSON.parse(cached);

      if (questions.length > 0) {
        const trivia = questions.shift();

        // Update Redis with remaining questions
        await redisClient.setEx(redisKey, 3600, JSON.stringify(questions)); // 1 hour TTL

        return res.json(formatTrivia(trivia));
      }
    }

    // If no cache or empty, fetch fresh from API
    const response = await axios.get("https://the-trivia-api.com/api/questions", {
      params: {
        limit: 20,
        categories: "geography,history,society_and_culture",
      },
    });

    const allQuestions = response.data;

    // Optional: prioritize questions containing city name
    const matching = allQuestions.filter(q =>
      q.question.toLowerCase().includes(city)
    );

    const selectedQuestions = matching.length > 0 ? matching : allQuestions;

    const trivia = selectedQuestions.shift(); // Get first question
    await redisClient.setEx(redisKey, 3600, JSON.stringify(selectedQuestions)); // Cache rest

    function formatTrivia(trivia) {
      const allAnswers = [...trivia.incorrectAnswers, trivia.correctAnswer];
      const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);
    
      return {
        question: trivia.question,
        correct_answer: trivia.correctAnswer,
        options: shuffledAnswers,
      };
    }
    return res.json(formatTrivia(trivia));

  } catch (err) {
    console.error("Trivia error:", err);
    return res.status(500).json({ error: "Trivia API or Redis error." });
  }
};

exports.submitTrivia = async (req, res) => {
  try {
    const {
      city,
      question,
      selectedAnswer,
      correctAnswer,
      isCorrect,
      score,
      streak,
    } = req.body;
    const userId = req.user?._id?.toString()
    const log = new Trivia({
      city,
      question,
      selectedAnswer,
      correctAnswer,
      isCorrect,
      score,
      streak,
      userId
    });

    await log.save();

    // Update Redis leaderboard
    const leaderboardKey = `trivia:leaderboard:${city.toLowerCase()}`;
    await redisClient.zAdd(leaderboardKey, {
      score: parseFloat(score),
      value: userId,
    });

    // keep top 50
    await redisClient.zRemRangeByRank(leaderboardKey, 0, -51);
    res.json({ success: true, message: "Trivia saved." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error saving trivia." });
  }
};

exports.getLeaderboard = async (req, res) => {
  const city = req.params.city;
  //const cacheKey = `leaderboard:${city.toLowerCase()}`;

  try {
    // 1. Check Redis
    /* const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json({ leaderboard: JSON.parse(cached) });
    }
 */
    // 2. Fetch top players from DB
    const topPlayers = await Trivia.aggregate([
      { $match: { city } },
      {
        $group: {
          _id: "$userId",
          score: { $max: "$score" },
        },
      },
      { $sort: { score: -1 } },
      { $limit: 10 },
    ]);

    // 3. Populate usernames
    const leaderboard = await Promise.all(
      topPlayers.map(async (entry) => {
        const user = await User.findById(entry._id).select("username");
        return {
          username: user?.username || "Anonymous",
          score: entry.score,
        };
      })
    );

    // 4. Cache in redisClient (expire after 5 minutes)
    //await redisClient.set(cacheKey, JSON.stringify(leaderboard), "EX", 60 * 5);

    res.render('pages/leaderboard',{ leaderboard });
  } catch (err) {
    console.error(err);
    res.render('pages/leaderboard',{leaderboard: null });
  }
};


exports.toggleFavorite = async (req, res) => {
  const { city } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    const index = user?.favorites?.indexOf(city);
    if (index > -1) {
      user?.favorites?.splice(index, 1); // remove
    } else {
      user?.favorites?.push(city); // add
    }

    await user.save();
    res.json({ success: true, favorites: user?.favorites });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Unable to toggle favourites.');
  }
};
