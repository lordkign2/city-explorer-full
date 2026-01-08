// utils/aiItinerary.js
const axios = require('axios');

/**
 * Generate an itinerary using an AI service
 * @param {Object} preferences - User preferences for the itinerary
 * @param {string} preferences.city - City name
 * @param {number} preferences.days - Number of days
 * @param {string} preferences.budget - Budget level (low, medium, high)
 * @param {Array<string>} preferences.interests - User interests
 * @param {Object} preferences.weather - Weather information
 * @returns {Promise<Object>} Generated itinerary
 */
async function generateItinerary(preferences) {
  try {
    // If using OpenAI
    if (process.env.OPENAI_API_KEY) {
      return await generateWithOpenAI(preferences);
    }
    
    // If using Puter AI
    if (process.env.PUTER_AI_API_KEY) {
      return await generateWithPuterAI(preferences);
    }
    
    // Fallback to template-based approach
    return generateWithTemplate(preferences);
  } catch (error) {
    console.error('AI Itinerary Generation Error:', error);
    throw new Error('Failed to generate itinerary with AI');
  }
}

/**
 * Generate itinerary using OpenAI API
 */
async function generateWithOpenAI(preferences) {
  const prompt = createPrompt(preferences);
  
  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a travel planning expert. Create detailed day-by-day itineraries.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 1000
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
      }
  });
  
  // Parse the response
  const aiResponse = response.data.choices[0].message.content;
  return parseItineraryResponse(aiResponse);
}

/**
 * Generate itinerary using Puter AI API
 */
async function generateWithPuterAI(preferences) {
  // Implementation for Puter AI would go here
  // Placeholder for now
  return generateWithTemplate(preferences);
}

/**
 * Template-based fallback for itinerary generation
 */
function generateWithTemplate(preferences) {
  const { city, days, budget, interests } = preferences;
  
  const itinerary = {
    title: `${days}-Day ${city} Adventure`,
    description: `A personalized ${days}-day itinerary for ${city} based on your preferences.`,
    days: []
  };
  
  // Generate a basic template
  for (let day = 1; day <= days; day++) {
    const dayPlan = {
      day,
      items: []
    };
    
    // Morning activity
    dayPlan.items.push({
      time: '9:00 AM',
      activity: getRandomActivity(interests, 'morning'),
      type: 'attraction'
    });
    
    // Lunch
    dayPlan.items.push({
      time: '12:30 PM',
      activity: getRandomActivity(interests, 'food'),
      type: 'restaurant'
    });
    
    // Afternoon activity
    dayPlan.items.push({
      time: '2:00 PM',
      activity: getRandomActivity(interests, 'afternoon'),
      type: 'attraction'
    });
    
    // Dinner
    dayPlan.items.push({
      time: '7:00 PM',
      activity: getRandomActivity(interests, 'dinner'),
      type: 'restaurant'
    });
    
    itinerary.days.push(dayPlan);
  }
  
  return itinerary;
}

/**
 * Create a prompt for the AI based on user preferences
 */
function createPrompt(preferences) {
  const { city, days, budget, interests, weather } = preferences;
  
  return `
    Create a ${days}-day travel itinerary for ${city}.
    
    Traveler preferences:
    - Budget: ${budget}
    - Interests: ${interests.join(', ')}
    ${weather ? `- Current weather: ${weather.condition}, ${weather.temperature}°C` : ''}
    
    Requirements:
    1. Include specific times for activities
    2. Balance tourist attractions with local experiences
    3. Consider opening hours and travel time between locations
    4. Suggest appropriate restaurants based on budget
    5. Include a mix of popular and hidden gem locations
    6. Format as a structured JSON response with daily plans
    
    Response format:
    {
      "title": "Title of the itinerary",
      "description": "Brief description",
      "days": [
        {
          "day": 1,
          "items": [
            {
              "time": "9:00 AM",
              "activity": "Activity name",
              "type": "attraction|restaurant|hotel",
              "description": "Brief description"
            }
          ]
        }
      ]
    }
  `;
}

/**
 * Parse the AI response into a structured format
 */
function parseItineraryResponse(response) {
  try {
    // If response is already JSON, parse it
    if (response.trim().startsWith('{') || response.trim().startsWith('[')) {
      return JSON.parse(response);
    }
    
    // Otherwise, try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // If all else fails, return a basic structure
    return {
      title: 'AI Generated Itinerary',
      description: 'A personalized travel plan',
      days: []
    };
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return {
      title: 'AI Generated Itinerary',
      description: 'A personalized travel plan',
      days: []
    };
  }
}

/**
 * Get a random activity based on interests and time of day
 */
function getRandomActivity(interests, timeOfDay) {
  const activities = {
    culture: {
      morning: ['Visit local museum', 'Historical walking tour', 'Art gallery visit'],
      afternoon: ['Cultural center exploration', 'Heritage site visit', 'Local market browsing'],
      food: ['Traditional restaurant', 'Cultural cuisine experience', 'Cooking class'],
      dinner: ['Fine dining restaurant', 'Cultural dinner show', 'Local food tour']
    },
    nature: {
      morning: ['Hiking trail', 'Botanical garden visit', 'Nature walk'],
      afternoon: ['National park exploration', 'Beach time', 'Wildlife spotting'],
      food: ['Scenic outdoor cafe', 'Farm-to-table restaurant', 'Picnic spot'],
      dinner: ['Riverside restaurant', 'Outdoor dining experience', 'Seafood restaurant']
    },
    nightlife: {
      morning: ['Late breakfast', 'Brunch spot', 'Coffee shop'],
      afternoon: ['Shopping district', 'Entertainment venue', 'Spa treatment'],
      food: ['Popular lunch spot', 'Trendy cafe', 'Local delicacy restaurant'],
      dinner: ['Upscale restaurant', 'Rooftop dining', 'Celebrity chef restaurant']
    },
    food: {
      morning: ['Local bakery', 'Breakfast specialty cafe', 'Farmers market'],
      afternoon: ['Food tour', 'Cooking school', 'Wine tasting'],
      food: ['Popular local restaurant', 'Ethnic cuisine spot', 'Food truck area'],
      dinner: ['Signature dish restaurant', 'Chef\'s table experience', 'Local food festival']
    }
  };
  
  // Default activities if no matching interest
  const defaultActivities = {
    morning: ['City sightseeing', 'Landmark visit', 'Guided tour'],
    afternoon: ['Shopping', 'Local exploration', 'Cultural activity'],
    food: ['Local restaurant', 'Popular cafe', 'Street food'],
    dinner: ['Restaurant dining', 'Local cuisine', 'Specialty dining']
  };
  
  // Try to match with interests
  for (const interest of interests) {
    if (activities[interest] && activities[interest][timeOfDay]) {
      const options = activities[interest][timeOfDay];
      return options[Math.floor(Math.random() * options.length)];
    }
  }
  
  // Fallback to default
  const options = defaultActivities[timeOfDay] || defaultActivities.morning;
  return options[Math.floor(Math.random() * options.length)];
}

module.exports = {
  generateItinerary
};