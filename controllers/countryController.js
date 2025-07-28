const Country = require('../models/Country');
const City = require('../models/City');
const redisClient = require('../redisClient');

const getAllCountries = async (req, res) => {
  try {
    const cached = await redisClient.get('countries');

    let countries;
    if (cached) {
      countries = JSON.parse(cached);
    } else {
      // First populate, then lean
      countries = await Country.find()

      // Cache the enriched data
      await redisClient.set('countries', JSON.stringify(countries), { EX: 3600 });
    }
    res.render('pages/countries', {
      countries,
      user: req.user
    });

  } catch (err) {
    console.error('Error loading countries page:', err);
    req.flash('error', 'Unable to load countries.');
    res.render('pages/countries', { countries: [], user: req.user });
  }
};

const getCountryById = async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);

    if (!country) {
      req.flash('error', 'Country not found');
      return res.redirect('/');
    }

    // Get all cities that belong to this country
    const cities = await City.find({ country: country._id });

    res.render('pages/country', {
      title: country.name,
      country,
      cities
    });
  } catch (err) {
    console.error('Error loading country page:', err);
    req.flash('error', 'Failed to load country info');
    res.redirect('/');
  }
};

module.exports = {
  getCountryById,
  getAllCountries
};