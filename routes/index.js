// routes/index.js
const express = require('express');
const router = express.Router();
const axios= require("axios");
const cityController = require('../controllers/cityController');
const {cache} = require("../middleware/cache");
const City = require('../models/City');
const redisClient = require('../redisClient');
const fetchSchools = require('../utils/schools');
const Country = require('../models/Country');

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

    countries = await Country.find().sort({ views: -1 }).limit(6).lean();
    
    console.log(countries._id);
    // let countries = [];
    // trendingCities.forEach( city => {
    //   countries.push(city.country)
      
    // });
   
    
    res.render('pages/landing', {
      trendingCities,
      countries,
      user: req.user
    });
  } catch (err) {
    console.error('Error loading landing page:', err);
    req.flash('error', 'Unable to load trending cities.');
    res.render('pages/landing', { trendingCities: [], user: req.user });
  }
});

// GETA: free city search (general city)
router.post('/searchcity', async (req, res) => {
  var searchCity = req.body.searchCity
  var searchURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&units=metric&appid=ae01b42d69cbfa8f4dd0f6b61427222b";
  try {
    var response = await axios.get(searchURL);
    var data = response.data;
    var city = data.name;
    var schools = await fetchSchools(city);
    console.log(schools)
    res.render("pages/search-city", {
      weather: {
        city: data.name,
        temperature: data.main.temp,
        country: data.sys.country,
        description: data.weather[0].description,
        coord: "Lon: " + data.coord.lon + ", Lat: " + data.coord.lat,
        icon: "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
      },
      city,
      schools,
    });

  } catch (err) {
    console.error('Error loading search page:', err);
    req.flash('error', 'Unable to find city');
    res.redirect('/');
  }
})

module.exports = router;