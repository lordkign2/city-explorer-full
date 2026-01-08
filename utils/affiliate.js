// utils/affiliate.js

/**
 * Generate affiliate link for a booking provider
 * @param {string} provider - Booking provider (booking.com, expedia, etc.)
 * @param {string} baseUrl - Base URL for the provider
 * @param {Object} params - Additional parameters for the affiliate link
 * @returns {string} Affiliate tracking URL
 */
function generateAffiliateLink(provider, baseUrl, params = {}) {
  // Get affiliate ID from environment variables
  const affiliateIds = {
    'booking.com': process.env.BOOKING_AFFILIATE_ID,
    'expedia': process.env.EXPEDIA_AFFILIATE_ID,
    'hotels.com': process.env.HOTELS_AFFILIATE_ID,
    'airbnb': process.env.AIRBNB_AFFILIATE_ID
  };
  
  const affiliateId = affiliateIds[provider];
  
  if (!affiliateId) {
    console.warn(`No affiliate ID configured for ${provider}`);
    return baseUrl;
  }
  
  // Construct affiliate URL based on provider
  switch (provider) {
    case 'booking.com':
      // Booking.com affiliate link format
      return `https://booking.com/index.html?aid=${affiliateId}&${new URLSearchParams(params).toString()}`;
      
    case 'expedia':
      // Expedia affiliate link format
      const expediaParams = new URLSearchParams({
        ...params,
        'rfrr': 'TPIAffiliate',
        'affcid': affiliateId
      });
      return `https://www.expedia.com/?${expediaParams.toString()}`;
      
    case 'hotels.com':
      // Hotels.com affiliate link format
      const hotelsParams = new URLSearchParams({
        ...params,
        'jsevents': 'true',
        'refid': affiliateId
      });
      return `https://www.hotels.com/?${hotelsParams.toString()}`;
      
    case 'airbnb':
      // Airbnb affiliate link format
      const airbnbParams = new URLSearchParams({
        ...params,
        'refinement_paths[]': '/homes',
        'affiliate_tracking': affiliateId
      });
      return `https://www.airbnb.com/?${airbnbParams.toString()}`;
      
    default:
      // Generic affiliate link with utm parameters
      const defaultParams = new URLSearchParams({
        ...params,
        'utm_source': 'cityexplorer',
        'utm_medium': 'affiliate',
        'utm_campaign': provider,
        'partner_id': affiliateId
      });
      return `${baseUrl}?${defaultParams.toString()}`;
  }
}

/**
 * Track affiliate click for analytics
 * @param {string} userId - User ID (optional)
 * @param {string} provider - Affiliate provider
 * @param {string} linkType - Type of link (hotel, flight, tour, etc.)
 * @param {string} itemId - ID of the item being clicked
 * @returns {Promise<void>}
 */
async function trackAffiliateClick(userId, provider, linkType, itemId) {
  try {
    // In a real implementation, you would save this to a database
    // For now, we'll just log it
    
    const clickData = {
      userId: userId || 'anonymous',
      provider,
      linkType,
      itemId,
      timestamp: new Date().toISOString()
    };
    
    console.log('Affiliate Click Tracked:', clickData);
    
    // Here you would typically:
    // 1. Save to database for analytics
    // 2. Send to analytics service
    // 3. Update user preferences based on clicks
    
    return clickData;
  } catch (error) {
    console.error('Error tracking affiliate click:', error);
  }
}

/**
 * Calculate estimated commission for a booking
 * @param {number} bookingAmount - Total booking amount
 * @param {string} provider - Affiliate provider
 * @returns {Object} Commission details
 */
function calculateEstimatedCommission(bookingAmount, provider) {
  // Commission rates (these would typically come from your affiliate agreements)
  const commissionRates = {
    'booking.com': 0.25, // 25%
    'expedia': 0.04,     // 4%
    'hotels.com': 0.08,  // 8%
    'airbnb': 0.04       // 4%
  };
  
  const rate = commissionRates[provider] || 0;
  const estimatedCommission = bookingAmount * rate;
  
  return {
    provider,
    bookingAmount,
    commissionRate: rate,
    estimatedCommission,
    currency: 'USD'
  };
}

/**
 * Generate affiliate disclosure text
 * @param {string} provider - Affiliate provider
 * @returns {string} Disclosure text
 */
function generateAffiliateDisclosure(provider) {
  return `As an affiliate partner of ${provider}, we may earn a commission from qualifying purchases.`;
}

module.exports = {
  generateAffiliateLink,
  trackAffiliateClick,
  calculateEstimatedCommission,
  generateAffiliateDisclosure
};