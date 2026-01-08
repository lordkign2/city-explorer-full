const mongoose = require('mongoose');

const itineraryItemSchema = new mongoose.Schema({
  time: String, // e.g., "9:00 AM"
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place'
  },
  placeName: String, // In case place is deleted
  type: {
    type: String,
    enum: ['attraction', 'restaurant', 'hotel', 'custom']
  },
  note: String, // Custom notes
  duration: String // e.g., "2 hours"
});

const dayPlanSchema = new mongoose.Schema({
  day: Number,
  date: Date,
  items: [itineraryItemSchema]
});

const itinerarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous itineraries
  },
  sessionId: String, // For anonymous users
  cityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true
  },
  cityName: String, // In case city is deleted
  title: String,
  description: String,
  days: [dayPlanSchema],
  preferences: {
    budget: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    interests: [String], // e.g., ['culture', 'food', 'nature']
    startDate: Date,
    endDate: Date
  },
  weather: {
    condition: String,
    temperature: Number
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
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
itinerarySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Itinerary', itinerarySchema);