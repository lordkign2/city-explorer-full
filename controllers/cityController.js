// controllers/cityController.js
const City = require('../models/City');
const Trivia = require('../models/Trivia');
// const fetchWeather = require('../utils/weather');
// const fetchHotels = require('../utils/hotels');
// const fetchSchools = require('../utils/schools');
const { getCityImage } = require('../utils/unsplash');
const User = require('../models/User'); // Required to update trivia scores

exports.getCityPage = async (req, res) => {
  try {
    const city = await City.findById(req.params.id).lean();

    if (!city) {
      req.flash('error', 'City not found');
      return res.redirect('/');
    }

    // Weather info
    const weather = await fetchWeather(city.name);

    // Hotels (mock or API)
    const hotels = await fetchHotels(city.name);

    // Schools (mock for now)
    const schools = await fetchSchools(city.name);

    // Trivia questions for this city
    
   

    // If no image URL, fetch from Unsplash and update
    if (!city.imageUrl) {
      const imageUrl = await getCityImage(city.name);
      city.imageUrl = imageUrl;
      await City.findByIdAndUpdate(city._id, { imageUrl });
    }

    res.render('pages/city', {
      title: `${city.name} | City Info`,
      city,
      weather,
      hotels,
      schools,
      trivia,
      user: req.user
    });
  } catch (err) {
    console.error('City page error:', err);
    req.flash('error', 'Failed to load city information');
    res.redirect('/');
  }
};
exports.submitTrivia = async (req, res) => {
  try {
    const trivia = await Trivia.find({ city: city._id }).lean();
    const { questions = [], correctAnswers = [], answers = [] } = req.body;
    let score = 0;

    // Compare submitted answers with correct ones
    correctAnswers.forEach((correct, index) => {
      if (answers[index] && answers[index].trim() === correct.trim()) {
        score++;
      }
    });

    const total = correctAnswers.length;

    // Save trivia result in user history
    await User.findByIdAndUpdate(req.session.userId, {
      $push: {
        triviaScores: {
          cityId: req.params.id,
          cityName: req.body.cityName || 'Unknown City',
          correct: score,
          total: total
        }
      }
    });

    req.flash('success', `You got ${score} out of ${total} correct!`);
    res.redirect(`/cities/${req.params.id}`);
  } catch (err) {
    console.error('Trivia submission failed:', err);
    req.flash('error', 'Error grading your quiz.');
    res.redirect(`/cities/${req.params.id}`);
  }
};