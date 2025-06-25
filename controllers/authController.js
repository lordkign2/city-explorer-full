const User = require('../models/User');
const gravatar = require('../utils/gravatar');
const bcrypt = require('bcrypt');

// Show register form
exports.showRegister = (req, res) => {
  res.render('pages/register');
};

// Handle user registration
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error', 'Email is already registered');
      return res.redirect('/auth/register');
    }

    const avatarUrl = gravatar(email);

    const newUser = new User({
      username,
      email,
      password, // will be hashed in model pre-save hook
      avatarUrl
    });

    await newUser.save();

    // Set session
    req.session.userId = newUser._id;
    req.session.userRole = 'user'; // default role
    req.flash('success', 'Registration successful');
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Registration error:', err);
    req.flash('error', 'Registration failed');
    res.redirect('/auth/register');
  }
};

// Show login form
exports.showLogin = (req, res) => {
  res.render('pages/login');
};

// Handle login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/auth/login');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      req.flash('error', 'Incorrect password');
      return res.redirect('/auth/login');
    }

    req.session.userId = user._id;
    req.session.userRole = user.role || 'user'; // if admin support is added
    req.flash('success', `Welcome back, ${user.username}!`);
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    req.flash('error', 'Login failed');
    res.redirect('/auth/login');
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
};