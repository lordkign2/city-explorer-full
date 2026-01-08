const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String
  },
  firstName: String,
  lastName: String,
  bio: String,
  location: String,
  preferences: {
    budget: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    interests: [String], // e.g., ['culture', 'food', 'nature', 'nightlife']
    notification: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  },
  isAdmin: { 
    type: Boolean,
    default: false
  
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  favorites: [{type: String}],
  savedItineraries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Itinerary'
  }],
  triviaScores: [
    {
      cityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
      },
      cityName: String,
      correct: Number,
      total: Number
    }
  ],
  badges: [String], // Achieved badges
  points: {
    type: Number,
    default: 0
  },
  suspendedUntil: {
    type: Date,
    default: null
  },
  suspensionReason: {
    type: String,
    default: ''
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Add password comparison method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);