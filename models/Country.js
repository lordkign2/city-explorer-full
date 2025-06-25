// models/Country.js
const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: String, // Optional: ISO country code
  capital: String,
  population: Number,
  region: String,
  imageUrl: String, // Optional country image
  funFacts: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Country', countrySchema);