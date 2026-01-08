# Setup Instructions

This guide will walk you through setting up the City Explorer project on your local development environment.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 14 or higher)
- MongoDB (local instance or cloud service like MongoDB Atlas)
- Redis (for caching and session management)
- Git (for version control)

## System Requirements

### Minimum Requirements
- RAM: 4GB
- Storage: 10GB available space
- Operating System: Windows 10+, macOS 10.14+, or Ubuntu 18.04+

### Recommended Requirements
- RAM: 8GB or higher
- Storage: 20GB available space
- Operating System: Latest stable versions

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/city-explorer.git
cd city-explorer
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies listed in `package.json`.

### 3. Environment Configuration

Create a `.env` file in the project root by copying `.env.example`:

```bash
cp .env.example .env
```

Configure the following environment variables:

#### Database Configuration
- `MONGO_URL` - MongoDB connection string
- `REDIS_URL` - Redis connection string

#### API Keys
- `WEATHER_API_KEY` - OpenWeatherMap API key
- `UNSPLASH_ACCESS_KEY` - Unsplash API key
- `RAPIDAPI_KEY` - Hotels.com RapidAPI key
- `GOOGLE_PLACES_API_KEY` - Google Places API key (optional)
- `OPENAI_API_KEY` - OpenAI API key (optional)
- `MAPBOX_ACCESS_TOKEN` - Mapbox access token (optional)

#### Authentication
- `SESSION_SECRET` - Secret for session encryption
- `JWT_SECRET` - Secret for JWT token signing

#### Email Configuration (for notifications)
- `EMAIL_USER` - SMTP user
- `EMAIL_PASS` - SMTP password
- `EMAIL_SERVICE` - Email service provider

#### Affiliate Configuration
- `BOOKING_AFFILIATE_ID` - Booking.com affiliate ID
- `EXPEDIA_AFFILIATE_ID` - Expedia affiliate ID
- `HOTELS_AFFILIATE_ID` - Hotels.com affiliate ID

### 4. Database Setup

Ensure MongoDB and Redis services are running.

For MongoDB, you can either:
1. Use a local installation
2. Use MongoDB Atlas (cloud service)
3. Use Docker (see Docker section below)

For Redis, you can either:
1. Use a local installation
2. Use Redis Labs (cloud service)
3. Use Docker (see Docker section below)

### 5. Seed Initial Data

Seed the database with initial badges:

```bash
npm run seed:badges
```

### 6. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Docker Setup (Optional)

For containerized deployment, you can use Docker:

### 1. Install Docker

Download and install Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop).

### 2. Build and Run Containers

```bash
docker-compose up --build
```

This will start containers for:
- City Explorer application
- MongoDB database
- Redis cache

## Development Workflow

### Code Structure

```
city-explorer/
├── controllers/          # Route handlers
├── models/               # Database models
├── routes/               # API routes
├── utils/                # Utility functions
├── views/                # EJS templates
├── public/               # Static assets
├── docs/                 # Documentation
├── tests/                # Test files
├── .env                  # Environment variables
├── .gitignore            # Git ignore rules
├── app.js                # Main application file
├── package.json          # Project dependencies
└── README.md             # Project README
```

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Building for Production

```bash
npm run build
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed
- Ensure MongoDB is running
- Check `MONGO_URL` in `.env` file
- Verify network connectivity to database

#### 2. Redis Connection Failed
- Ensure Redis is running
- Check `REDIS_URL` in `.env` file
- Verify Redis is accepting connections

#### 3. Missing API Keys
- Ensure all required API keys are set in `.env`
- Check that API keys are valid and active
- Verify API key permissions

#### 4. Port Already in Use
- Change the `PORT` variable in `.env`
- Kill processes using the port:
  ```bash
  # On Linux/macOS
  lsof -ti:3000 | xargs kill
  
  # On Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```

### Getting Help

If you encounter issues not covered in this guide:
1. Check the [GitHub Issues](https://github.com/your-username/city-explorer/issues) page
2. Contact the development team at support@cityexplorer.com
3. Refer to the documentation in the `docs/` directory

## Next Steps

After successful setup:
1. Explore the application at `http://localhost:3000`
2. Create a user account
3. Try generating an AI itinerary
4. Explore the admin dashboard (if admin access is available)
5. Review the API documentation in `docs/api/`

## Contributing

If you'd like to contribute to the project:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests if applicable
5. Submit a pull request

See `CONTRIBUTING.md` for detailed contribution guidelines.