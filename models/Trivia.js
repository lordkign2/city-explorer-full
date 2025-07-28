
const mongoose = require('mongoose');

const triviaLogSchema = new mongoose.Schema({
  city: String,
  question: String,
  selectedAnswer: String,
  correctAnswer: String,
  isCorrect: Boolean,
  score: Number,
  streak: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
});

module.exports = mongoose.model('TriviaLog', triviaLogSchema);
