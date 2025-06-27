const Country = require('../models/Country');
const City = require('../models/City');

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
  getCountryById
};