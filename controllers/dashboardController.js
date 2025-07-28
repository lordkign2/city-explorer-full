// controllers/dashboardController.js
const User = require('../models/User');
const City = require('../models/City');
const bcrypt = require('bcryptjs');
const getGravatar = require('../utils/gravatar');

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const favoriteCities = user.favorites || [];
    let cities = []
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/auth/login');
    }

    for (let i = 0; i < favoriteCities.length; i++) {
      const favoriteCity = favoriteCities[i];
      const currentCity = await City.findOne({name: favoriteCity}).populate("country");
      const cityId = currentCity._id;
      const cityCountry = currentCity.country.name
      cities.push({favoriteCity: favoriteCity, cityId: cityId, cityCountry: cityCountry});
    }
    
    res.render('pages/dashboard', {
      title: 'Dashboard',
      user, 
      cities, 
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
    const { username, email, currentPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.session.userId);

    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/dashboard/settings');
    }

    let avatarUpdated = false;

    // Update email and avatar if changed
    if (email && email !== user.email) {
      user.email = email;
      user.avatarUrl = getGravatar(email);
      avatarUpdated = true;
    }

    // Update username
    if (username) user.username = username;

    // Password update logic (if user filled any password field)
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        req.flash('error', 'To change your password, fill in all password fields.');
        return res.redirect('/dashboard/settings');
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        req.flash('error', 'Current password is incorrect.');
        return res.redirect('/dashboard/settings');
      }

      if (newPassword !== confirmPassword) {
        req.flash('error', 'New passwords do not match.');
        return res.redirect('/dashboard/settings');
      }

      if (newPassword.length < 6) {
        req.flash('error', 'Password must be at least 6 characters long.');
        return res.redirect('/dashboard/settings');
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    // Update session (if username/email/avatar changed)
    req.session.username = user.username;
    req.session.avatarUrl = user.avatarUrl;

    const changes = [`Profile updated`];
    if (avatarUpdated) changes.push('Avatar refreshed');
    if (newPassword) changes.push('Password changed');

    req.flash('success', changes.join('. '));
    res.redirect('/dashboard/settings');
  } catch (err) {
    console.error('Error updating settings:', err);
    req.flash('error', 'Failed to update settings');
    res.redirect('/dashboard/settings');
  }
};