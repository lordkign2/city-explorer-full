const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  cityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true
  },
  countryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country'
  },
  type: {
    type: String,
    enum: ['attraction', 'restaurant', 'hotel'],
    required: true
  },
  description: String,
  address: String,
  coordinates: {
    lat: Number,
    lng: Number
  },
  categories: [String], // e.g., ['museum', 'fine dining', 'luxury']
  tags: [String], // Custom tags
  rating: {
    average: Number,
    count: Number
  },
  priceRange: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$']
  },
  contact: {
    phone: String,
    website: String,
    email: String
  },
  images: [String],
  hours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
  },
  amenities: [String], // e.g., ['wifi', 'parking', 'delivery']
  affiliateLink: String, // For monetization
  seo: {
    title: String,
    description: String,
    keywords: [String]
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

// Generate slug from name before saving
placeSchema.pre('save', function(next) {
  if (this.isModified('name') && this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  
  // Update the updatedAt field
  this.updatedAt = new Date();
  
  next();
});

module.exports = mongoose.model('Place', placeSchema);