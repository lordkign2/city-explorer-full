const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place'
  },
  cityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  title: String,
  comment: String,
  pros: [String],
  cons: [String],
  visitedDate: Date,
  helpful: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    vote: {
      type: Number,
      enum: [1, -1] // 1 for helpful, -1 for not helpful
    }
  }],
  images: [String],
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
reviewSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for better query performance
reviewSchema.index({ placeId: 1, rating: -1 });
reviewSchema.index({ cityId: 1, rating: -1 });

module.exports = mongoose.model('Review', reviewSchema);