
// controllers/adminController.js
const City = require('../models/City');
const Country = require('../models/Country');

// Admin dashboard homepage
exports.getAdminDashboard = async (req, res) => {
  try {
    const cityCount = await City.countDocuments();
    const countryCount = await Country.countDocuments();
    res.render('pages/admin', {
      title: 'Admin Dashboard',
      cityCount,
      countryCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// ==========================
//        CITIES CRUD
// ==========================
exports.getAllCities = async (req, res) => {
  const cities = await City.find().populate('country');
  res.render('pages/admin-cities', { title: 'Manage Cities', cities });
};

exports.showNewCityForm = async (req, res) => {
  const countries = await Country.find();
  res.render('pages/new-city', { title: 'Add New City', countries });
};

exports.createCity = async (req, res) => {
  try {
    const { name, country, imageUrl, funFacts } = req.body;
    const city = new City({
      name,
      country,
      imageUrl,
      funFacts: funFacts.split(',').map(f => f.trim())
    });
    await city.save();
    req.flash('success', 'City created successfully');
    res.redirect('/admin/cities');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error creating city');
    res.redirect('/admin/cities');
  }
};

exports.showEditCityForm = async (req, res) => {
  const city = await City.findById(req.params.id);
  const countries = await Country.find();
  res.render('pages/edit-city', { title: 'Edit City', city, countries });
};

exports.updateCity = async (req, res) => {
  try {
    const { name, country, imageUrl, funFacts } = req.body;
    await City.findByIdAndUpdate(req.params.id, {
      name,
      country,
      imageUrl,
      funFacts: funFacts.split(',').map(f => f.trim())
    });
    req.flash('success', 'City updated');
    res.redirect('/admin/cities');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error updating city');
    res.redirect('/admin/cities');
  }
};

exports.deleteCity = async (req, res) => {
  try {
    await City.findByIdAndDelete(req.params.id);
    req.flash('success', 'City deleted');
    res.redirect('/admin/cities');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error deleting city');
    res.redirect('/admin/cities');
  }
};

// ==========================
//       COUNTRIES CRUD
// ==========================
exports.getAllCountries = async (req, res) => {
  const countries = await Country.find();
  res.render('pages/admin-countries', { title: 'Manage Countries', countries });
};

exports.showNewCountryForm = (req, res) => {
  res.render('pages/new-country', { title: 'Add New Country' });
};

exports.createCountry = async (req, res) => {
  try {
    const { name, code } = req.body;
    const country = new Country({ name, code });
    await country.save();
    req.flash('success', 'Country created');
    res.redirect('/admin/countries');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error creating country');
    res.redirect('/admin/countries');
  }
};

exports.showEditCountryForm = async (req, res) => {
  const country = await Country.findById(req.params.id);
  res.render('pages/edit-country', { title: 'Edit Country', country });
};

exports.updateCountry = async (req, res) => {
  try {
    const { name, code } = req.body;
    await Country.findByIdAndUpdate(req.params.id, { name, code });
    req.flash('success', 'Country updated');
    res.redirect('/admin/countries');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error updating country');
    res.redirect('/admin/countries');
  }
};

exports.deleteCountry = async (req, res) => {
  try {
    await Country.findByIdAndDelete(req.params.id);
    req.flash('success', 'Country deleted');
    res.redirect('/admin/countries');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error deleting country');
    res.redirect('/admin/countries');
  }
};