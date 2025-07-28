var User = require('../models/User');
var passport = require('passport');
var gravatar = require('../utils/gravatar');
var bcrypt = require('bcryptjs');
const validator = require('email-validator');
const nodemailer = require('nodemailer');


// Show register form
exports.showRegister = (req, res) => {
  res.render('pages/register');
};
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
// Handle user registration
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!strongPasswordRegex.test(password)) {
      return res.status(400).render('auth/register', {
        error: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
      });
    }
    // Validate email format
    if (!validator.validate(email)) {
      req.flash('error', 'Please enter a valid email address.');
      return res.redirect('/auth/register');
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error', 'Email is already registered');
      return res.redirect('/auth/register');
    }

    // Generate avatar and create user
    const avatarUrl = gravatar(email);
    const newUser = new User({
      username,
      email,
      password, // hashed in User model pre-save hook
      avatarUrl
    });

    await newUser.save();

    // Send welcome email
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your email service provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: '"City Explorer" <no-reply@cityexplorer.com>',
      to: newUser.email,
      subject: '🎉 Welcome to LDS City Explorer!',
      html: `
        
      <div style="font-family: 'Segoe UI', sans-serif; background: #0f172a; color: #f8fafc; padding: 40px 0;">
      <div style="max-width: 600px; margin: auto; background: #1e293b; border-radius: 10px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.3);">
        <div style="text-align: center; padding: 40px 20px;">
          <img src="https://yourdomain.com/logo.png" alt="LDS Logo" style="width: 80px; margin-bottom: 20px;" />
          <h1 style="margin: 0; font-size: 26px; color: #ffffff;">Welcome to LDS City Explorer 🌍</h1>
          <p style="font-size: 16px; line-height: 1.5; color: #cbd5e1; margin: 20px 0;">
            We’re thrilled to have you on board! With LDS, you can discover trending cities, book top-rated hotels, and explore new adventures effortlessly.
          </p>
          <a href="https://yourdomain.com/start" 
             style="display: inline-block; margin-top: 25px; padding: 12px 24px; background: linear-gradient(135deg, #6366f1, #3b82f6); color: #fff; text-decoration: none; font-weight: bold; border-radius: 6px;">
            Explore Now
          </a>
        </div>
        <div style="padding: 20px; text-align: center; font-size: 12px; color: #94a3b8;">
          <p>If you didn’t sign up for LDS, you can safely ignore this email.</p>
          <p>© ${new Date().getFullYear()} LDS City Explorer. All rights reserved.</p>
        </div>
      </div>
    </div>
      `
    });

    // Auto-login after registration
    req.login(newUser, (err) => {
      if (err) {
        req.flash("error", "Login after registration failed");
        return res.redirect("/auth/login");
      }

      req.session.userId = newUser._id;
      req.session.userRole = 'user';
      req.flash('success', 'Registration successful');
      res.redirect('/dashboard');
    });

  } catch (err) {
    console.error('Registration error:', err);
    req.flash('error', 'Registration failed. Please try again.');
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