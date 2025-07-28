// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  cityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  senderAvatar: {
    type: String
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  infraction: { type: Boolean, default: false },
});

module.exports = mongoose.model('Message', messageSchema);