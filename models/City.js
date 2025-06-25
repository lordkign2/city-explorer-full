// models/City.js
const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
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
  imageUrl: String, // from Unsplash
  funFacts: [String],
  viewCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('City', citySchema);