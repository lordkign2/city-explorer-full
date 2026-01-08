// controllers/gamificationController.js
const User = require('../models/User');
const Badge = require('../models/Badge');
const Trivia = require('../models/Trivia');
const redisClient = require('../redisClient');

exports.getUserBadges = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('badges points');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get badge details
    const badges = await Badge.find({ name: { $in: user.badges } });

    res.json({ 
      success: true, 
      badges,
      points: user.points
    });
  } catch (err) {
    console.error('Error fetching user badges:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch badges' });
  }
};

exports.getAllBadges = async (req, res) => {
  try {
    // Don't show hidden badges unless admin
    const filter = req.user && req.user.isAdmin ? {} : { isHidden: false };
    
    const badges = await Badge.find(filter).sort({ category: 1, points: 1 });

    res.json({ success: true, badges });
  } catch (err) {
    console.error('Error fetching badges:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch badges' });
  }
};

exports.awardBadge = async (req, res) => {
  try {
    // Only admins can manually award badges
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { userId, badgeName } = req.body;

    // Check if badge exists
    const badge = await Badge.findOne({ name: badgeName });
    if (!badge) {
      return res.status(404).json({ success: false, message: 'Badge not found' });
    }

    // Check if user already has this badge
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.badges.includes(badgeName)) {
      return res.status(400).json({ success: false, message: 'User already has this badge' });
    }

    // Award badge
    user.badges.push(badgeName);
    user.points += badge.points;
    await user.save();

    res.json({ 
      success: true, 
      message: `Badge '${badgeName}' awarded to ${user.username}`,
      badge,
      totalPoints: user.points
    });
  } catch (err) {
    console.error('Error awarding badge:', err);
    res.status(500).json({ success: false, message: 'Failed to award badge' });
  }
};

// Leaderboard functionality
exports.getLeaderboard = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // Try cache first
    const cacheKey = `leaderboard_top_${limit}`;
    const cached = await redisClient.get(cacheKey);
    
    if (cached) {
      return res.json({ success: true, leaderboard: JSON.parse(cached) });
    }

    // Get top users by points
    const topUsers = await User.find({ points: { $gt: 0 } })
      .sort({ points: -1 })
      .limit(parseInt(limit))
      .select('username avatarUrl points badges');

    // Cache for 15 minutes
    await redisClient.setEx(cacheKey, 900, JSON.stringify(topUsers));

    res.json({ success: true, leaderboard: topUsers });
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch leaderboard' });
  }
};

// Get user's position on leaderboard
exports.getUserRank = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Count how many users have more points
    const rank = await User.countDocuments({ 
      points: { $gt: req.user.points } 
    }) + 1;

    res.json({ 
      success: true, 
      rank,
      points: req.user.points
    });
  } catch (err) {
    console.error('Error fetching user rank:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch rank' });
  }
};

// Check for new badge eligibility
exports.checkBadgeEligibility = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return [];

    const currentBadges = user.badges || [];
    const newlyAwarded = [];

    // Define badge criteria
    const badgeCriteria = await Badge.find({});
    
    for (const badge of badgeCriteria) {
      // Skip if user already has this badge
      if (currentBadges.includes(badge.name)) continue;

      let eligible = false;

      // Evaluate criteria (this is a simplified example)
      switch (badge.criteria) {
        case 'first_trivia':
          const triviaCount = await Trivia.countDocuments({ userId });
          eligible = triviaCount >= 1;
          break;
          
        case 'trivia_master':
          const correctAnswers = await Trivia.countDocuments({ 
            userId, 
            isCorrect: true 
          });
          eligible = correctAnswers >= 50;
          break;
          
        case 'explorer':
          eligible = user.favorites && user.favorites.length >= 10;
          break;
          
        case 'contributor':
          // Would check for reviews, etc.
          break;
          
        default:
          // Custom criteria evaluation
          break;
      }

      if (eligible) {
        user.badges.push(badge.name);
        user.points += badge.points;
        newlyAwarded.push(badge);
      }
    }

    if (newlyAwarded.length > 0) {
      await user.save();
    }

    return newlyAwarded;
  } catch (err) {
    console.error('Error checking badge eligibility:', err);
    return [];
  }
};