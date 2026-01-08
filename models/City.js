// models/City.js
const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true
  },
  population: Number,
  coordinates: {
    lat: Number,
    lng: Number
  },
  description: String,
  imageUrl: String, // from Unsplash
  images: [String], // Additional images
  funFacts: [String],
  categories: [String], // e.g., ['beach', 'historic', 'nightlife']
  tags: [String], // Custom tags
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  affiliateLinks: {
    hotels: String,
    tours: String,
    flights: String
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
citySchema.pre('save', function(next) {
  if (this.isModified('name') && this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  
  // Update the updatedAt field
  this.updatedAt = new Date();
  
  next();
});

module.exports = mongoose.model('City', citySchema);