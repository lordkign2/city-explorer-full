# Developer Guide

This guide provides technical information for developers working on the City Explorer platform.

## Project Overview

City Explorer is built using modern web technologies with a focus on scalability, performance, and maintainability.

### Technology Stack

#### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis
- **Authentication**: Passport.js
- **Real-time**: Socket.IO
- **Testing**: Jest

#### Frontend
- **Template Engine**: EJS
- **Styling**: Tailwind CSS
- **Mapping**: Leaflet.js
- **Build Tools**: Webpack, Babel

#### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Kubernetes (optional)
- **CI/CD**: GitHub Actions
- **Monitoring**: Winston logging

## Project Structure

```
city-explorer/
├── controllers/          # Route handlers
├── models/               # Database models
├── routes/               # API routes
├── middleware/           # Custom middleware
├── utils/                # Utility functions
├── views/                # EJS templates
├── public/               # Static assets
├── docs/                 # Documentation
├── tests/                # Test files
├── .env                  # Environment variables
├── app.js                # Main application file
├── package.json          # Project dependencies
└── README.md             # Project README
```

## Development Environment Setup

### Prerequisites

1. Node.js (version 14 or higher)
2. MongoDB (local instance or cloud service)
3. Redis
4. Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/city-explorer.git
   cd city-explorer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start development servers:
   ```bash
   # Start MongoDB and Redis (if running locally)
   # Then start the application
   npm run dev
   ```

## Code Organization

### Controllers

Controllers handle HTTP requests and responses. They should:
- Be thin and focused
- Delegate business logic to services
- Handle error cases appropriately
- Return consistent response formats

Example controller structure:
```javascript
// controllers/cityController.js
exports.getCityById = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).json({ 
        success: false, 
        message: 'City not found' 
      });
    }
    res.json({ success: true, city });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
```

### Models

Models define data structures and business logic. They should:
- Use Mongoose schemas
- Include validations
- Implement virtual properties when needed
- Define indexes for frequently queried fields

Example model structure:
```javascript
// models/City.js
const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  population: Number,
  coordinates: {
    lat: Number,
    lng: Number
  }
}, {
  timestamps: true
});

// Add indexes
citySchema.index({ name: 1 });
citySchema.index({ 'coordinates.lat': 1, 'coordinates.lng': 1 });

module.exports = mongoose.model('City', citySchema);
```

### Routes

Routes define API endpoints and their handlers. They should:
- Be organized by resource
- Use RESTful conventions
- Apply appropriate middleware
- Include documentation comments

Example route structure:
```javascript
// routes/cities.js
const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');

// GET /cities/:id
router.get('/:id', cityController.getCityById);

module.exports = router;
```

### Middleware

Middleware functions process requests before reaching controllers. They should:
- Be reusable
- Have a single responsibility
- Handle errors appropriately
- Be well-documented

Example middleware structure:
```javascript
// middleware/auth.js
exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ 
    success: false, 
    message: 'Authentication required' 
  });
};
```

### Utilities

Utility functions provide common functionality used across the application. They should:
- Be pure functions when possible
- Have clear input and output
- Include error handling
- Be thoroughly tested

Example utility structure:
```javascript
// utils/weather.js
const axios = require('axios');

async function getWeather(city) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Weather API error: ${error.message}`);
  }
}

module.exports = getWeather;
```

## API Development

### RESTful Principles

Follow RESTful API design principles:
- Use HTTP methods appropriately (GET, POST, PUT, DELETE)
- Use plural nouns for collections (/cities, not /city)
- Use hyphens for compound words (/api/v1/city-search)
- Use query parameters for filtering and sorting
- Return appropriate HTTP status codes

### Response Format

Consistent response format:
```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

Error response format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["array", "of", "specific", "errors"]
}
```

### Versioning

API versioning is implemented through URL paths:
- `/api/v1/cities`
- `/api/v2/cities` (future versions)

### Documentation

Document all API endpoints using JSDoc comments:
```javascript
/**
 * Get city by ID
 * @route GET /cities/{id}
 * @param {string} id.path.required - City ID
 * @returns {object} 200 - City object
 * @returns {Error} 404 - City not found
 */
exports.getCityById = async (req, res) => {
  // Implementation
};
```

## Database Design

### Schema Design

Follow these principles for schema design:
- Normalize where appropriate
- Denormalize for performance
- Use appropriate data types
- Include validation rules
- Add indexes for frequently queried fields

### Relationships

Model relationships using references or embedded documents:
- Use references for one-to-many or many-to-many relationships
- Use embedded documents for one-to-few relationships with strong cohesion

### Performance

Optimize database performance:
- Create indexes on frequently queried fields
- Use projections to limit returned fields
- Implement pagination for large datasets
- Use aggregation pipelines for complex queries

## Testing

### Test Structure

Organize tests to mirror the source code structure:
```
tests/
├── unit/
│   ├── controllers/
│   ├── models/
│   └── utils/
├── integration/
│   ├── api/
│   └── database/
└── e2e/
    └── ui/
```

### Unit Tests

Test individual functions and methods:
```javascript
// tests/unit/controllers/cityController.test.js
const cityController = require('../../../controllers/cityController');

describe('City Controller', () => {
  describe('getCityById', () => {
    it('should return a city when found', async () => {
      // Test implementation
    });
    
    it('should return 404 when city not found', async () => {
      // Test implementation
    });
  });
});
```

### Integration Tests

Test interactions between components:
```javascript
// tests/integration/api/cities.test.js
describe('Cities API', () => {
  it('should return list of cities', async () => {
    const response = await request(app).get('/api/v1/cities');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

### Running Tests

Run tests using npm scripts:
```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run tests with coverage
npm run test:coverage
```

## Security

### Authentication

Implement secure authentication:
- Use bcrypt for password hashing
- Implement JWT for stateless authentication
- Use HTTPS in production
- Implement rate limiting
- Validate all user inputs

### Authorization

Implement role-based access control:
- Define user roles (admin, user, etc.)
- Check permissions before allowing actions
- Use middleware for authorization checks
- Log security-relevant events

### Data Protection

Protect sensitive data:
- Never log passwords or tokens
- Encrypt sensitive data at rest
- Use environment variables for secrets
- Implement proper CORS policies
- Sanitize user inputs

## Performance Optimization

### Caching

Implement caching strategies:
- Use Redis for session storage
- Cache frequently accessed data
- Implement cache invalidation
- Use appropriate TTL values

### Database Optimization

Optimize database queries:
- Create indexes on frequently queried fields
- Use projections to limit returned data
- Implement pagination
- Use aggregation pipelines for complex operations

### Frontend Optimization

Optimize client-side performance:
- Minify CSS and JavaScript
- Optimize images
- Implement lazy loading
- Use CDN for static assets

## Deployment

### Environment Configuration

Use environment variables for configuration:
- Database connection strings
- API keys
- Feature flags
- Logging levels

### Containerization

Use Docker for consistent deployments:
```dockerfile
FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### CI/CD

Implement continuous integration and deployment:
- Run tests on every commit
- Automatically deploy to staging
- Require approvals for production
- Implement rollback procedures

## Monitoring and Logging

### Application Monitoring

Monitor application health:
- Track response times
- Monitor error rates
- Measure throughput
- Set up alerts for anomalies

### Logging

Implement structured logging:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

module.exports = logger;
```

## Contributing

### Code Style

Follow established code style guidelines:
- Use ESLint with configured rules
- Maintain consistent naming conventions
- Write clear, descriptive comments
- Keep functions small and focused

### Git Workflow

Follow the feature branching workflow:
1. Create a feature branch from `develop`
2. Make changes and commit frequently
3. Write clear commit messages
4. Push to remote repository
5. Create pull request for review

### Pull Requests

Submit quality pull requests:
- Include clear description of changes
- Reference related issues
- Ensure all tests pass
- Follow code review feedback

By following this developer guide, you can effectively contribute to and maintain the City Explorer platform.