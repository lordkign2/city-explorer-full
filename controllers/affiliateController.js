// controllers/affiliateController.js
const { generateAffiliateLink, trackAffiliateClick, calculateEstimatedCommission } = require('../utils/affiliate');

/**
 * Generate affiliate link for a place/hotel
 */
exports.generateLink = async (req, res) => {
  try {
    const { provider, baseUrl, params } = req.body;
    
    if (!provider || !baseUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'Provider and baseUrl are required' 
      });
    }
    
    const affiliateLink = generateAffiliateLink(provider, baseUrl, params);
    
    res.json({
      success: true,
      affiliateLink
    });
  } catch (err) {
    console.error('Error generating affiliate link:', err);
    res.status(500).json({ success: false, message: 'Failed to generate affiliate link' });
  }
};

/**
 * Track affiliate click
 */
exports.trackClick = async (req, res) => {
  try {
    const { provider, linkType, itemId } = req.body;
    const userId = req.user ? req.user._id : null;
    
    if (!provider || !linkType || !itemId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Provider, linkType, and itemId are required' 
      });
    }
    
    // Track the click
    await trackAffiliateClick(userId, provider, linkType, itemId);
    
    res.json({
      success: true,
      message: 'Click tracked successfully'
    });
  } catch (err) {
    console.error('Error tracking affiliate click:', err);
    res.status(500).json({ success: false, message: 'Failed to track click' });
  }
};

/**
 * Calculate estimated commission
 */
exports.estimateCommission = async (req, res) => {
  try {
    const { bookingAmount, provider } = req.body;
    
    if (!bookingAmount || !provider) {
      return res.status(400).json({ 
        success: false, 
        message: 'Booking amount and provider are required' 
      });
    }
    
    const commissionDetails = calculateEstimatedCommission(parseFloat(bookingAmount), provider);
    
    res.json({
      success: true,
      commission: commissionDetails
    });
  } catch (err) {
    console.error('Error calculating commission:', err);
    res.status(500).json({ success: false, message: 'Failed to calculate commission' });
  }
};

/**
 * Get affiliate disclosure
 */
exports.getDisclosure = async (req, res) => {
  try {
    const { provider } = req.query;
    
    if (!provider) {
      return res.status(400).json({ 
        success: false, 
        message: 'Provider is required' 
      });
    }
    
    const disclosure = generateAffiliateDisclosure(provider);
    
    res.json({
      success: true,
      disclosure
    });
  } catch (err) {
    console.error('Error generating disclosure:', err);
    res.status(500).json({ success: false, message: 'Failed to generate disclosure' });
  }
};