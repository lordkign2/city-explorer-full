
// controllers/adminController.js
const City = require('../models/City');
const Country = require('../models/Country');
const User = require('../models/User');

// Admin dashboard homepage
exports.getAdminDashboard = async (req, res) => {
  try {
    const cityCount = await City.countDocuments();
    const userCount = await City.countDocuments();
    const countryCount = await Country.countDocuments();
    res.render('pages/admin', {
      title: 'Admin Dashboard',
      cityCount,
      userCount,
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
  try {
  const { page = 1, limit = 10, sort = 'name', order = 'asc', search = '' } = req.query;
    const query = search
      ? { name: { $regex: new RegExp(search, 'i') } }
      : {};

    const sortOption = { [sort]: order === 'asc' ? 1 : -1 };

    const total = await City.countDocuments(query);
    const cities = await City.find(query)
      .populate('country')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
      const allCountries = await Country.find();
  res.render('pages/admin-cities', { 
    title: 'Manage Cities',
    allCountries,
    cities,
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / limit),
    sort,
    order,
    search
  });
} catch (err) {
  console.error(err);
  req.flash('error', 'Error fetching cities');
  res.redirect('/admin');
}
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

exports.bulkDeleteCities = async (req, res) => {
  const ids = req.body.ids;
  try {
  // If no checkbox was selected
  if (!ids || (Array.isArray(ids) && ids.length === 0)) {
    req.flash('error', 'No cities selected for deletion.');
    return res.redirect('/admin/cities');
  }
  
    // If only one checkbox was selected, make sure it's an array
    const idArray = Array.isArray(ids) ? ids : [ids];

    await City.deleteMany({ _id: { $in: idArray } });

    req.flash('success', 'Selected cities deleted.');
    res.redirect('/admin/cities');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error deleting selected cities.');
    res.redirect('/admin/cities');
  }
};



// ==========================
//       COUNTRIES CRUD
// ==========================
exports.getAllCountries = async (req, res) => {
  const perPage = 10;
  const page = parseInt(req.query.page) || 1;
  const countries = await Country.find()
  .skip((page - 1) * perPage)
  .limit(perPage)
  .sort({ name: 1 });
  const totalCountries = await Country.countDocuments();
  
    
  res.render('pages/admin-countries', { 
    title: 'Manage Countries', 
    countries,  
    currentPage: page,
    totalPages: Math.ceil(totalCountries / perPage) 
  });
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