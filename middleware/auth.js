// middleware/auth.js

exports.loginRequired = (req, res, next) => {
    if (req.session && req.session.userId) {
      return next();
    }
    req.flash('error', 'You must be logged in to view that page.');
    res.redirect('/auth/login');
  };
  
  exports.isAdmin = (req, res, next) => {
    if (req.session && req.session.userRole === 'admin') {
      return next();
    }
    req.flash('error', 'You do not have permission to access this page.');
    res.redirect('/');
  };