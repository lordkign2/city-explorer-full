// middleware/checkSuspension.js
const User = require('../models/User');
module.exports = async (req, res, next) => {
    try {
       
        // Allow logout and auth routes to bypass suspension check
        if (req.path === '/auth/logout') return next();

        const user = await User.findById(req.session.userId);
        if (user?.suspendedUntil && new Date(user.suspendedUntil) > Date.now()) {
            return res.render('pages/suspended', {
                until: user.suspendedUntil,
                reason: user.suspensionReason || 'Account temporarily suspended.',
                user: req.user,
            });
        }
    next();
    } catch (err) {
        console.error('Suspend middleware error:', err);
        req.flash('error', 'Error checking suspension status');
        return res.redirect('/login');
    }
 
  };
  