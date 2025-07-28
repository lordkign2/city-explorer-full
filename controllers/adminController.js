
// controllers/adminController.js
const City = require('../models/City');
const Country = require('../models/Country');
const User = require('../models/User');
const { getCityImage } = require('../utils/unsplash');

// Admin dashboard homepage
exports.getAdminDashboard = async (req, res) => {
  try {
    const cityCount = await City.countDocuments();
    const userCount = await User.countDocuments();
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
    // Parse query params with defaults and limits
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const sort = req.query.sort || 'name';
    const order = req.query.order === 'desc' ? -1 : 1;
    const search = req.query.search || '';

    // Escape user input for regex (to prevent injection or breakage)
    const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const query = search
      ? { name: { $regex: escapeRegex(search), $options: 'i' } }
      : {};

    const sortOption = { [sort]: order };

    // Fetch total and paginated results
    const total = await City.countDocuments(query);
    const cities = await City.find(query)
      .populate('country')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    const allCountries = await Country.find();

    res.render('pages/admin-cities', {
      title: 'Manage Cities',
      allCountries,
      cities,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      sort,
      order: order === 1 ? 'asc' : 'desc',
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
    // If no image URL, fetch from Unsplash and update
    if (!imageUrl) {
      const imageUrl = await getCityImage(name);
    }
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
    req.flash('error', 'Error creating city, Will update globally in 5 mins');
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
    req.flash('success', 'City updated, Will update globally in 5 mins');
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
    req.flash('error', 'Error deleting city, Will delete globally in 5 mins');
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

    req.flash('success', 'Selected cities deleted.Will delete globally in 5 mins');
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
    req.flash('success', 'Country created, Will update globally in 5 mins');
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
    req.flash('success', 'Country updated, Will update globally in 5 mins');
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
    req.flash('error', 'Error deleting country, Will delete globally in 5 mins');
    res.redirect('/admin/countries');
  }
};

// ==========================
//       USERS CRUD
// ==========================

exports.getAllUsers = async (req, res) => {
  try {
    // Parse query params with defaults and limits
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const sort = req.query.sort || 'name';
    const order = req.query.order === 'desc' ? -1 : 1;
    const search = req.query.search || '';

    // Escape user input for regex (to prevent injection or breakage)
    const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const query = search
      ? { name: { $regex: escapeRegex(search), $options: 'i' } }
      : {};

    const sortOption = { [sort]: order };

    // Fetch total and paginated results
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    res.render('pages/admin-users', {
      title: 'Manage Users',
      users,
      currentUser: req.user,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      sort,
      order: order === 1 ? 'asc' : 'desc',
      search
    });

  } catch (err) {
    console.error(err);
    req.flash('error', 'Error fetching users');
    res.redirect('/admin');
  }
};

exports.showEditUserForm = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send('User not found');
  res.render('pages/edit-user', { user });
}

exports.updateUser = async (req, res) => {
  const { username, email, isAdmin } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');

    user.username = username;
    user.email = email;
    user.isAdmin = isAdmin === 'on'; // checkbox

    await user.save();
    req.flash('success', 'User updated successfully');
    res.redirect('/admin/users');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error updating user');
    res.redirect('/admin/users');
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(403).json({ error: "You can't delete yourself" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.suspendUser = async (req, res) => {
  try {
    const { userId, days, reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/admin/users');
    }

    const suspensionDuration = parseInt(days) || 0;
    user.suspendedUntil = new Date(Date.now() + suspensionDuration * 24 * 60 * 60 * 1000);
    user.suspensionReason = reason || 'No reason provided';

    await user.save();
    req.flash('success', `User suspended for ${days} day(s).`);
    res.redirect('/admin/users');
  } catch (err) {
    console.error('Error suspending user:', err);
    req.flash('error', 'Could not suspend user');
    res.redirect('/admin/users');
  }
};



exports.toggleAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isAdmin = !user.isAdmin;
    await user.save();
    res.redirect('/admin/users');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to update admin status');
    res.redirect('/admin/users');
  }
};