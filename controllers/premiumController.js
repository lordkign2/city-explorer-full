// controllers/premiumController.js
const User = require('../models/User');
const Itinerary = require('../models/Itinerary');

/**
 * Check if user has premium access
 */
function isPremiumUser(user) {
  // In a real implementation, you would check for an active subscription
  // For now, we'll check if the user has a special flag or high point count
  return user && (user.isPremium || (user.points && user.points > 1000));
}

/**
 * Middleware to check for premium access
 */
exports.requirePremium = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required for premium features' 
    });
  }
  
  if (!isPremiumUser(req.user)) {
    return res.status(403).json({ 
      success: false, 
      message: 'Premium subscription required for this feature' 
    });
  }
  
  next();
};

/**
 * Get user's premium status
 */
exports.getPremiumStatus = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    
    const isPremium = isPremiumUser(req.user);
    
    res.json({
      success: true,
      isPremium,
      points: req.user.points || 0,
      message: isPremium ? 'You have premium access' : 'Upgrade to premium for more features'
    });
  } catch (err) {
    console.error('Error checking premium status:', err);
    res.status(500).json({ success: false, message: 'Failed to check premium status' });
  }
};

/**
 * Upgrade user to premium (demo only)
 */
exports.upgradeToPremium = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    
    // In a real implementation, this would involve payment processing
    // For demo purposes, we'll just set the flag
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    user.isPremium = true;
    await user.save();
    
    res.json({
      success: true,
      message: 'Successfully upgraded to premium!',
      isPremium: true
    });
  } catch (err) {
    console.error('Error upgrading to premium:', err);
    res.status(500).json({ success: false, message: 'Failed to upgrade to premium' });
  }
};

/**
 * Create unlimited itineraries (premium feature)
 */
exports.createUnlimitedItinerary = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    
    // Check if user has premium access
    if (!isPremiumUser(req.user)) {
      // For non-premium users, limit to 5 itineraries
      const itineraryCount = await Itinerary.countDocuments({ 
        userId: req.user._id 
      });
      
      if (itineraryCount >= 5) {
        return res.status(403).json({ 
          success: false, 
          message: 'Upgrade to premium for unlimited itineraries' 
        });
      }
    }
    
    // Continue with itinerary creation (this would call the itinerary controller)
    // For now, we'll just return a success message
    res.json({
      success: true,
      message: 'Premium user can create unlimited itineraries'
    });
  } catch (err) {
    console.error('Error creating unlimited itinerary:', err);
    res.status(500).json({ success: false, message: 'Failed to create itinerary' });
  }
};

/**
 * Export itinerary in multiple formats (premium feature)
 */
exports.exportItinerary = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    
    // Check if user has premium access
    if (!isPremiumUser(req.user)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Upgrade to premium to export itineraries' 
      });
    }
    
    // Continue with export (this would call the export controller)
    // For now, we'll just return a success message
    res.json({
      success: true,
      message: 'Premium user can export itineraries'
    });
  } catch (err) {
    console.error('Error exporting itinerary:', err);
    res.status(500).json({ success: false, message: 'Failed to export itinerary' });
  }
};