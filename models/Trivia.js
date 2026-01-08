
const mongoose = require('mongoose');

const triviaLogSchema = new mongoose.Schema({
  city: String,
  cityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City'
  },
  question: String,
  questionId: String, // Unique identifier for the question
  selectedAnswer: String,
  correctAnswer: String,
  isCorrect: Boolean,
  score: Number,
  streak: Number,
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard']
  },
  category: String, // e.g., 'geography', 'history', 'culture'
  pointsAwarded: Number, // Points for this specific question
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
