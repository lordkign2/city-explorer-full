var User = require('../models/User');
var passport = require('passport');
var gravatar = require('../utils/gravatar');
var bcrypt = require('bcryptjs');

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
    //Auto login the new user
    req.login(newUser, (err)=> {
      if (err) {
        req.flash("error", "Login after registration failed");
        return res.redirect("/auth/login");
      }
      // Set session
      req.session.userId = newUser._id;
      req.session.userRole = 'user'; // default role
      req.flash('success', 'Registration successful');
      res.redirect('/dashboard');
    })
    
   
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
exports.login = async (req, res, next) => {
  // try {
    passport.authenticate("local", (err, user,info) => {
      if (err) {
        console.err(err);
        req.flash("error", "something went wrong!");
        return res.redirect("/auth/login");
      }
      if (!user) {
        req.flash("error", info.message || "Invalid credential");
        return res.redirect("/auth/login");
      }
      req.logIn(user, (err) => {
        if (err) {
          console.err(err);
          req.flash("error", "Login failed");
          return res.redirect("/auth/login");
        }
        // remember me
        if (req.body.remember) {
          req.session.cookies.maxAge = 1000 * 60 * 60 * 24 ;
        } else {
          req.session.cookie.expires = false;
        }
        console.log( user._id);
        console.log( user.role);
        req.session.userId =  user._id;
        req.session.userRole = user.role || 'user'; // if admin support is added
        
        req.flash('success', `Welcome back, ${user.username}!`);
        return res.redirect('/dashboard');
      });
      
    })(req, res, next);
    // const { email, password } = req.body;
    // const isMatch = await User.comparePassword(password);  n =============
    // if (!isMatch) {
    //   req.flash('error', 'Incorrect password');
    //   return res.redirect('/auth/login');
    // }
    // const user = res.locals.user
    // if (!user) {
    //   req.flash('error', 'Invalid credentials');
    //   return res.redirect('/auth/login');
    // }
   
  // } catch (err) {
  //   console.error('Login error:', err);
  //   req.flash('error', 'Login failed, please try again!');
  //   res.redirect('/auth/login');
  // }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
};