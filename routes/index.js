// routes/index.js
const express = require('express');
const router = express.Router();
const axios= require("axios");
const cityController = require('../controllers/cityController');
const {cache} = require("../middleware/cache");
const City = require('../models/City');
const redisClient = require('../redisClient');
const fetchSchools = require('../utils/schools');
const fetchHotels = require('../utils/hotels');
const Country = require('../models/Country');

// GET: Landing page with trending cities
router.get('/', async (req, res) => {
  try {
    await redisClient.del('trending_cities');

    let trendingCitiesCache = await redisClient.get('trending_cities');
    let trendingCities;

    if (trendingCitiesCache) {
      trendingCities = JSON.parse(trendingCitiesCache);
    } else {
      trendingCities = await City.find()
        .sort({ viewCount: -1 })
        .limit(6)
        .populate('country')
        .lean();

      await redisClient.set('trending_cities', JSON.stringify(trendingCities), { EX: 3600 });
    }

    const countries = await Country.find().limit(3);

    res.render('pages/landing', {
      trendingCities,
      countries,
      user: req.user
    });
  } catch (err) {
    console.error('Error loading landing page:', err);
    req.flash('error', 'Unable to load trending cities.');
    res.render('pages/landing', { trendingCities: [], countries: [], user: req.user });
  }
});


// GETA: free city search (general city)
router.post('/searchcity', async (req, res) => {
  var searchCity = req.body.searchCity
  var apikey = process.env.WEATHER_API_KEY
  var searchURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&units=metric&appid=" + apikey;
  try {
    var response = await axios.get(searchURL);
    var data = response.data;
    var city = data.name;
    var schools = await fetchSchools(city);

    const allHotels = await fetchHotels(city);
    const search = req.query.search?.toLowerCase() || "";
    const maxPrice = req.query.maxPrice || Infinity;
    const page = parseInt(req.query.page) || 1;
    const perPage = 8;
    const filteredHotels = allHotels.filter(h =>
      h.hotelName.toLowerCase().includes(search) &&
      parseFloat(h.price.replace(/[^\d.]/g, '')) <= maxPrice
    ); 
    const paginatedHotels = filteredHotels.slice((page - 1) * perPage, page * perPage);
    
    // map api key
    const apiKey = process.env.OPENCAGE_API_KEY;

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
      hotels: paginatedHotels,
      currentPage: page,
      totalPages: Math.ceil(filteredHotels.length / perPage),
      query: req.query,
      apiKey
    });

  } catch (err) {
    console.error('Error loading search page:', err);
    req.flash('error', 'Unable to find city');
    res.redirect('/');
  }
})


module.exports = router;