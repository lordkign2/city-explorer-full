// middleware/auth.js

exports.loginRequired = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error', 'You must be logged in to view that page.');
    res.redirect('/auth/login');
};
  
exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.isAdmin) {
      return next();
    }
    req.flash('error', 'You do not have permission to access this page.');
    res.redirect('/');
};