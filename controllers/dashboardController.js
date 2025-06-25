// controllers/dashboardController.js
const User = require('../models/User');
const City = require('../models/City');

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId)
      .populate({
        path: 'favorites',
        select: 'name country _id'
      })
      .lean();

    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/auth/login');
    }

    res.render('pages/dashboard', {
      title: 'Dashboard',
      user
    });
  } catch (err) {
    console.error('Error loading dashboard:', err);
    req.flash('error', 'Failed to load dashboard');
    res.redirect('/');
  }
};