const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  icon: String, // Icon URL or class
  category: {
    type: String,
    enum: ['explorer', 'trivia', 'contributor', 'special'],
    required: true
  },
  criteria: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 0
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Badge', badgeSchema);