# City Explorer - AI-Powered Travel Platform

A smart, AI-powered city exploration platform that generates personalized itineraries, shows interactive maps, recommends places, and includes gamified trivia.

## 🎯 Product Vision

Transform the way people explore cities with an intelligent travel companion that combines the best of Google Maps, TripAdvisor, and ChatGPT into a personalized and beautiful experience.

## 🚀 Key Features

### ✅ MVP (Launch Fast)
- City pages (SEO-optimized)
- Interactive city map
- Places (attractions, food, hotels)
- AI itinerary generator
- City trivia (gamified)
- Save favorite places

### 🔥 Advanced Features
- Multi-day AI itineraries
- Budget-aware planning
- Weather-aware suggestions
- Real-time events
- Hotel & tour affiliate links
- Offline city guides (PWA)
- Community tips & reviews

## 🏗️ Architecture

### High-Level Architecture
```
┌──────────────────────────────────────────┐
│            Client (Next.js)               │
│  City Pages • Maps • AI Chat • Trivia     │
└───────────────┬──────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────┐
│        Backend API (Node / NestJS)        │
├──────────────────────────────────────────┤
│ City Service   │ Places Service           │
│ AI Service     │ Trivia Service           │
│ User Service   │ Favorites & Reviews      │
└───────────────┬──────────────────────────┘
                │
       ┌────────┴────────┐
       ▼                 ▼
┌──────────────┐   ┌──────────────┐
│ MongoDB       │   │ Redis        │
│ Cities        │   │ Cache        │
│ Places        │   │ Rate limits  │
│ Itineraries   │   │ Sessions     │
│ Trivia        │   └──────────────┘
└──────────────┘
                │
                ▼
┌──────────────────────────────────────────┐
│         AI & External APIs Layer          │
├──────────────────────────────────────────┤
│ OpenAI / Puter LLM                        │
│ Google Places / Foursquare               │
│ Mapbox / Leaflet                         │
│ Weather API                              │
│ Booking / Expedia Affiliate APIs         │
└──────────────────────────────────────────┘
```

## 🧩 Frontend Architecture (Next.js)

### Pages
| Page | Description |
|------|-------------|
| `/` | Landing page with featured cities |
| `/city/[slug]` | SEO city guide |
| `/city/[slug]/map` | Interactive map |
| `/city/[slug]/itinerary` | AI trip planner |
| `/city/[slug]/trivia` | Gamified trivia |
| `/favorites` | Saved places |
| `/profile` | User preferences |

### Components
- CityHero
- MapView (Leaflet / Mapbox)
- PlaceCard
- ItineraryTimeline
- AIPlannerModal
- TriviaCard
- WeatherBadge
- BudgetSlider
- AffiliateCTA

### State & Data
- React Query / SWR
- LocalStorage for guest users
- IndexedDB for offline mode

## 🔹 Backend Architecture (Node / NestJS)

### Core Modules
1. **City Module**
   - City metadata
   - Coordinates
   - Images
   - SEO content

2. **Places Module**
   - Attractions
   - Restaurants
   - Hotels
   - Categories & ratings

3. **AI Itinerary Module**
   - Prompt orchestration
   - Budget & time constraints
   - Result normalization

4. **Trivia Module**
   - City-specific trivia
   - Difficulty levels
   - Gamification (points, badges)

5. **User Module**
   - Profiles
   - Preferences (budget, interests)
   - Favorites

6. **Affiliate Module**
   - Link tracking
   - CTR analytics
   - Revenue reports

## 🗄️ Database Design (MongoDB)

### Cities
```json
{
  "_id": "lagos",
  "name": "Lagos",
  "country": "Nigeria",
  "coordinates": { "lat": 6.5244, "lng": 3.3792 },
  "description": "...",
  "images": [],
  "seo": { "title": "", "description": "" }
}
```

### Places
```json
{
  "_id": "place123",
  "cityId": "lagos",
  "name": "Nike Art Gallery",
  "category": "attraction",
  "priceRange": "$$",
  "coordinates": {},
  "rating": 4.6,
  "affiliateLink": ""
}
```

### Itineraries
```json
{
  "userId": null,
  "cityId": "lagos",
  "days": 3,
  "budget": "medium",
  "interests": ["culture", "food"],
  "plan": []
}
```

### Trivia
```json
{
  "cityId": "lagos",
  "question": "...",
  "options": [],
  "answer": 2
}
```

## 🤖 AI Itinerary Engine (Core Intelligence)

### Prompt Strategy
```
You are a travel planner.
City: {city}
Days: {days}
Budget: {budget}
Interests: {interests}
Weather: {weather}
Return JSON itinerary grouped by day.
```

### Output Structure
```json
{
  "day1": [
    { "time": "9am", "place": "Lekki Conservation Centre" },
    { "time": "1pm", "place": "Local Restaurant" }
  ]
}
```

### Enhancements
- Weather-aware suggestions
- Opening-hour checks
- Distance optimization
- Budget balancing

## 🗺️ Maps & Location Layer

### Tools
- Leaflet + OpenStreetMap (free)
- Mapbox (paid, advanced)
- GeoJSON layers

### Features
- Place clustering
- Route visualization
- Distance estimation
- "Nearby places" search

## 🎮 Gamified City Trivia

- Earn points for correct answers
- Unlock city badges
- Daily trivia challenges
- Leaderboards (per city)

## 💰 Monetization Strategy

### Passive Income
- Hotel affiliate links
- Tour & activity affiliates
- Google AdSense on city pages

### Premium Features
- Unlimited AI itineraries
- Offline city guides
- Budget-optimized planning
- Export to PDF / calendar

### B2B
- White-label city guides
- API access for tourism boards
- Sponsored city pages

## 🔐 Security & Performance

- API rate limiting (Redis)
- Cached city pages (ISR)
- SEO-first architecture
- CDN for images
- Abuse protection on AI endpoints

## 🛠️ Tech Stack

- **Frontend**: Next.js, Tailwind CSS, Leaflet/Mapbox
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Redis
- **Authentication**: Passport.js
- **Real-time**: Socket.IO
- **AI Services**: OpenAI, Google Places API
- **Deployment**: Docker, Kubernetes, CI/CD

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server: `npm run dev`

## 📚 API Documentation

Detailed API documentation is available in the `docs/api` directory.

## 🧪 Testing

Run tests with: `npm test`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenStreetMap for map data
- OpenWeatherMap for weather data
- The Trivia API for trivia questions
- All contributors who have helped shape this project