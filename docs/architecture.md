# System Architecture

## High-Level Architecture

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

## Frontend Architecture (Next.js)

### Pages Structure
| Page | Path | Description |
|------|------|-------------|
| Home/Landing | `/` | Featured cities and search |
| City Guide | `/city/[slug]` | Comprehensive city information |
| Interactive Map | `/city/[slug]/map` | Map-based exploration |
| AI Itinerary | `/city/[slug]/itinerary` | Personalized trip planning |
| City Trivia | `/city/[slug]/trivia` | Gamified learning experience |
| Favorites | `/favorites` | User-saved places |
| User Profile | `/profile` | Account settings and preferences |

### Component Library
- **CityHero** - Prominent city showcase
- **MapView** - Interactive map component (Leaflet/Mapbox)
- **PlaceCard** - Consistent place presentation
- **ItineraryTimeline** - Visual day-by-day planning
- **AIPlannerModal** - AI itinerary generation interface
- **TriviaCard** - Engaging trivia presentation
- **WeatherBadge** - Current weather display
- **BudgetSlider** - Interactive budget selection
- **AffiliateCTA** - Monetization call-to-action

### State Management
- **React Query / SWR** - Server state management
- **Context API** - Global application state
- **LocalStorage** - Guest user persistence
- **IndexedDB** - Offline data storage

## Backend Architecture (Node/NestJS)

### Core Modules

#### 1. City Module
- Manages city metadata and information
- Handles SEO content generation
- Coordinates with external data sources
- Manages city images and media

#### 2. Places Module
- Catalogs attractions, restaurants, and hotels
- Integrates with Google Places/Foursquare APIs
- Manages place ratings and reviews
- Handles place categorization and tagging

#### 3. AI Itinerary Module
- Orchestrates AI-powered itinerary generation
- Manages prompt engineering and LLM interactions
- Normalizes and validates AI responses
- Applies budget and time constraints

#### 4. Trivia Module
- Delivers city-specific trivia questions
- Manages difficulty levels and categories
- Implements gamification mechanics
- Tracks user progress and achievements

#### 5. User Module
- Manages user profiles and authentication
- Stores user preferences and settings
- Handles favorites and saved content
- Manages subscription status

#### 6. Affiliate Module
- Generates and tracks affiliate links
- Collects click and conversion data
- Calculates estimated commissions
- Integrates with booking providers

### Microservices Approach

While currently implemented as a monolithic application, the architecture supports future decomposition into microservices:

1. **User Service** - Authentication and user management
2. **Content Service** - City and place information
3. **AI Service** - Itinerary generation and personalization
4. **Community Service** - Reviews, ratings, and social features
5. **Monetization Service** - Affiliate tracking and premium features

## Database Design (MongoDB)

### Collections Overview

#### Cities Collection
```json
{
  "_id": ObjectId,
  "name": String,
  "slug": String,
  "country": ObjectId (ref: Countries),
  "population": Number,
  "coordinates": {
    "lat": Number,
    "lng": Number
  },
  "description": String,
  "imageUrl": String,
  "images": [String],
  "funFacts": [String],
  "categories": [String],
  "tags": [String],
  "seo": {
    "title": String,
    "description": String,
    "keywords": [String]
  },
  "affiliateLinks": {
    "hotels": String,
    "tours": String,
    "flights": String
  },
  "viewCount": Number,
  "createdAt": Date,
  "updatedAt": Date
}
```

#### Places Collection
```json
{
  "_id": ObjectId,
  "name": String,
  "slug": String,
  "cityId": ObjectId (ref: Cities),
  "countryId": ObjectId (ref: Countries),
  "type": String (enum: attraction, restaurant, hotel),
  "description": String,
  "address": String,
  "coordinates": {
    "lat": Number,
    "lng": Number
  },
  "categories": [String],
  "tags": [String],
  "rating": {
    "average": Number,
    "count": Number
  },
  "priceRange": String (enum: $, $$, $$$, $$$$),
  "contact": {
    "phone": String,
    "website": String,
    "email": String
  },
  "images": [String],
  "hours": {
    "monday": String,
    "tuesday": String,
    "wednesday": String,
    "thursday": String,
    "friday": String,
    "saturday": String,
    "sunday": String
  },
  "amenities": [String],
  "affiliateLink": String,
  "seo": {
    "title": String,
    "description": String,
    "keywords": [String]
  },
  "viewCount": Number,
  "createdAt": Date,
  "updatedAt": Date
}
```

#### Itineraries Collection
```json
{
  "_id": ObjectId,
  "userId": ObjectId (ref: Users, optional),
  "sessionId": String (for anonymous users),
  "cityId": ObjectId (ref: Cities),
  "cityName": String,
  "title": String,
  "description": String,
  "days": [
    {
      "day": Number,
      "date": Date,
      "items": [
        {
          "time": String,
          "placeId": ObjectId (ref: Places, optional),
          "placeName": String,
          "type": String (enum: attraction, restaurant, hotel, custom),
          "note": String,
          "duration": String
        }
      ]
    }
  ],
  "preferences": {
    "budget": String (enum: low, medium, high),
    "interests": [String],
    "startDate": Date,
    "endDate": Date
  },
  "weather": {
    "condition": String,
    "temperature": Number
  },
  "seo": {
    "title": String,
    "description": String,
    "keywords": [String]
  },
  "isPublic": Boolean,
  "viewCount": Number,
  "createdAt": Date,
  "updatedAt": Date
}
```

#### Users Collection
```json
{
  "_id": ObjectId,
  "username": String,
  "email": String,
  "password": String,
  "avatarUrl": String,
  "firstName": String,
  "lastName": String,
  "bio": String,
  "location": String,
  "preferences": {
    "budget": String (enum: low, medium, high),
    "interests": [String],
    "notification": {
      "email": Boolean,
      "push": Boolean
    }
  },
  "isAdmin": Boolean,
  "isPremium": Boolean,
  "favorites": [String],
  "savedItineraries": [ObjectId (ref: Itineraries)],
  "triviaScores": [
    {
      "cityId": ObjectId (ref: Cities),
      "cityName": String,
      "correct": Number,
      "total": Number
    }
  ],
  "badges": [String],
  "points": Number,
  "suspendedUntil": Date,
  "suspensionReason": String,
  "lastActive": Date,
  "createdAt": Date,
  "updatedAt": Date
}
```

## Caching Strategy (Redis)

### Cache Layers
1. **Application Cache** - Frequently accessed data (city info, popular places)
2. **Session Store** - User sessions and temporary data
3. **Rate Limiting** - API request throttling
4. **Leaderboards** - Trivia and user rankings

### Cache Invalidation
- Time-based expiration (TTL)
- Event-driven invalidation on data updates
- Manual cache clearing for administrative actions

## Security Architecture

### Authentication
- JWT-based session management
- Password hashing with bcrypt
- OAuth integration options
- Session timeout and renewal

### Authorization
- Role-based access control (RBAC)
- Resource-based permissions
- Administrative privilege escalation

### Data Protection
- HTTPS encryption for all communications
- Environment variable-based secret management
- Input validation and sanitization
- Rate limiting to prevent abuse

## Scalability Considerations

### Horizontal Scaling
- Stateless application servers
- Database sharding strategies
- Load balancer integration
- CDN for static asset delivery

### Performance Optimization
- Database indexing for common queries
- Query result caching
- Image optimization and lazy loading
- Code splitting and bundle optimization

### Monitoring and Observability
- Application performance monitoring (APM)
- Database query profiling
- Error tracking and alerting
- User behavior analytics