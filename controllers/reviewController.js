// controllers/reviewController.js
const Review = require('../models/Review');
const Place = require('../models/Place');
const City = require('../models/City');
const User = require('../models/User');

exports.getAllReviews = async (req, res) => {
  try {
    const { placeId, cityId, userId, rating } = req.query;
    let filter = {};

    if (placeId) filter.placeId = placeId;
    if (cityId) filter.cityId = cityId;
    if (userId) filter.userId = userId;
    if (rating) filter.rating = rating;

    const reviews = await Review.find(filter)
      .populate('userId', 'username avatarUrl')
      .populate('placeId', 'name')
      .populate('cityId', 'name')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, reviews });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id)
      .populate('userId', 'username avatarUrl')
      .populate('placeId', 'name')
      .populate('cityId', 'name');

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.json({ success: true, review });
  } catch (err) {
    console.error('Error fetching review:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch review' });
  }
};

exports.createReview = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const reviewData = { ...req.body, userId: req.user._id };
    
    // Validate required fields
    if (!reviewData.rating || (!reviewData.placeId && !reviewData.cityId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rating and either placeId or cityId are required' 
      });
    }

    // Check if user already reviewed this place/city
    const existingFilter = { 
      userId: req.user._id,
      ...(reviewData.placeId ? { placeId: reviewData.placeId } : { cityId: reviewData.cityId })
    };
    
    const existingReview = await Review.findOne(existingFilter);
    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already reviewed this place/city' 
      });
    }

    const review = new Review(reviewData);
    await review.save();

    // Populate for response
    await review.populate('userId', 'username avatarUrl');
    await review.populate('placeId', 'name');
    await review.populate('cityId', 'name');

    res.status(201).json({ success: true, review });
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ success: false, message: 'Failed to create review' });
  }
};

exports.updateReview = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { id } = req.params;
    const updateData = { ...req.body };

    const review = await Review.findOne({ _id: id, userId: req.user._id });
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found or not authorized' });
    }

    Object.keys(updateData).forEach(key => {
      if (key !== 'userId' && key !== '_id') { // Prevent changing userId
        review[key] = updateData[key];
      }
    });

    review.updatedAt = new Date();
    await review.save();

    // Populate for response
    await review.populate('userId', 'username avatarUrl');
    await review.populate('placeId', 'name');
    await review.populate('cityId', 'name');

    res.json({ success: true, review });
  } catch (err) {
    console.error('Error updating review:', err);
    res.status(500).json({ success: false, message: 'Failed to update review' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { id } = req.params;

    const review = await Review.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found or not authorized' });
    }

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
};

exports.voteHelpful = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { id } = req.params;
    const { vote } = req.body; // 1 for helpful, -1 for not helpful

    if (vote !== 1 && vote !== -1) {
      return res.status(400).json({ success: false, message: 'Vote must be 1 or -1' });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Check if user already voted
    const existingVoteIndex = review.helpful.findIndex(v => v.userId.toString() === req.user._id.toString());
    
    if (existingVoteIndex > -1) {
      // Update existing vote
      review.helpful[existingVoteIndex].vote = vote;
    } else {
      // Add new vote
      review.helpful.push({ userId: req.user._id, vote });
    }

    await review.save();

    // Calculate helpfulness score
    const helpfulScore = review.helpful.reduce((sum, v) => sum + v.vote, 0);

    res.json({ 
      success: true, 
      message: 'Vote recorded successfully',
      helpfulScore 
    });
  } catch (err) {
    console.error('Error voting on review:', err);
    res.status(500).json({ success: false, message: 'Failed to record vote' });
  }
};

// Get reviews for a specific place
exports.getPlaceReviews = async (req, res) => {
  try {
    const { placeId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ placeId })
      .populate('userId', 'username avatarUrl')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ placeId });

    // Calculate average rating
    const ratingStats = await Review.aggregate([
      { $match: { placeId: require('mongoose').Types.ObjectId(placeId) } },
      { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      reviews,
      averageRating: ratingStats.length > 0 ? ratingStats[0].average : 0,
      totalReviews: ratingStats.length > 0 ? ratingStats[0].count : 0,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalReviews: total
      }
    });
  } catch (err) {
    console.error('Error fetching place reviews:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
};