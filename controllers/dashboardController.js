// controllers/dashboardController.js
const User = require('../models/User');
const City = require('../models/City');
const Trivia = require('../models/Trivia');
const getGravatar = require('../utils/gravatar');

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).populate({path: 'favorites', select: 'name country _id'}).lean();
    const favoriteCities = await City.find({ _id: { $in: user.favorites || [] } });
    const triviaScores = await Trivia.find({ userId: user._id }).populate('cityId');

    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/auth/login');
    }

    res.render('pages/dashboard', {
      title: 'Dashboard',
      user, 
      favoriteCities, 
      triviaScores
    });
  } catch (err) {
    console.error('Error loading dashboard:', err);
    req.flash('error', 'Failed to load dashboard');
    res.redirect('/');
  }
};

exports.getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/dashboard');
    }
    res.render('pages/settings', { title: 'Settings', user });
  } catch (err) {
    console.error('Error loading settings:', err);
    req.flash('error', 'Something went wrong');
    res.redirect('/dashboard');
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findById(req.session.userId);

    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/dashboard/settings');
    }

    let avatarUpdated = false;

    if (email !== user.email) {
      user.email = email;
      user.avatarUrl = getGravatar(email);
      avatarUpdated = true;
    }

    user.username = username;
    await user.save();

    req.session.avatarUrl = user.avatarUrl;
    req.session.username = user.username;

    req.flash('success', `Profile updated${avatarUpdated ? ' (avatar refreshed)' : ''}`);
    res.redirect('/dashboard/settings');
  } catch (err) {
    console.error('Error updating settings:', err);
    req.flash('error', 'Failed to update profile');
    res.redirect('/dashboard/settings');
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    const favoriteCities = await City.find({ _id: { $in: user.favorites || [] } });
    res.render('pages/favorites', {
      title: 'Favorite Cities',
      favoriteCities
    });
  } catch (err) {
    console.error('Error loading favorites:', err);
    req.flash('error', 'Could not load favorite cities');
    res.redirect('/dashboard');
  }
};

exports.getTriviaHistory = async (req, res) => {
  try {
    const scores = await Trivia.find({ userId: req.session.userId }).populate('cityId');
    res.render('pages/trivia-history', {
      title: 'Trivia History',
      scores
    });
  } catch (err) {
    console.error('Error loading trivia history:', err);
    req.flash('error', 'Could not load trivia history');
    res.redirect('/dashboard');
  }
};