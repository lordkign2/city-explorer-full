// seedBadges.js
const mongoose = require('mongoose');
const Badge = require('./models/Badge');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
  
  // Sample badges
  const badges = [
    {
      name: 'First Trivia',
      description: 'Complete your first trivia question',
      icon: '🎓',
      category: 'trivia',
      criteria: 'first_trivia',
      points: 10
    },
    {
      name: 'Trivia Master',
      description: 'Answer 50 trivia questions correctly',
      icon: '🧠',
      category: 'trivia',
      criteria: 'trivia_master',
      points: 100
    },
    {
      name: 'City Explorer',
      description: 'Add 10 cities to your favorites',
      icon: '🌍',
      category: 'explorer',
      criteria: 'explorer',
      points: 50
    },
    {
      name: 'Globe Trotter',
      description: 'Add 25 cities to your favorites',
      icon: '✈️',
      category: 'explorer',
      criteria: 'globe_trotter',
      points: 150
    },
    {
      name: 'Review Contributor',
      description: 'Write your first review',
      icon: '✍️',
      category: 'contributor',
      criteria: 'first_review',
      points: 25
    },
    {
      name: 'Helpful Reviewer',
      description: 'Receive 10 upvotes on your reviews',
      icon: '👍',
      category: 'contributor',
      criteria: 'helpful_reviewer',
      points: 75
    },
    {
      name: 'Itinerary Planner',
      description: 'Create your first itinerary',
      icon: '📅',
      category: 'explorer',
      criteria: 'first_itinerary',
      points: 30
    },
    {
      name: 'Travel Expert',
      description: 'Create 10 itineraries',
      icon: '🧭',
      category: 'explorer',
      criteria: 'travel_expert',
      points: 125
    }
  ];
  
  try {
    // Clear existing badges
    await Badge.deleteMany({});
    console.log('Cleared existing badges');
    
    // Insert new badges
    await Badge.insertMany(badges);
    console.log('Inserted sample badges');
    
    // Verify insertion
    const insertedBadges = await Badge.find({});
    console.log(`Total badges in database: ${insertedBadges.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding badges:', error);
    process.exit(1);
  }
});