# API Documentation

Welcome to the City Explorer API documentation. This guide provides detailed information about the available endpoints, request/response formats, authentication methods, and error codes.

## Base URL

All API requests should be made to the base URL:
```
https://api.cityexplorer.com/v1
```

For local development, use:
```
http://localhost:3000/api/v1
```

## Authentication

Most API endpoints require authentication. City Explorer uses JWT (JSON Web Tokens) for authentication.

### Obtain an Access Token

To authenticate, first obtain an access token by logging in:

```
POST /auth/login
```

Include the following in the request body:
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

The response will include an access token:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "user@example.com"
  }
}
```

### Using the Access Token

Include the token in the Authorization header of subsequent requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Rate Limiting

To ensure fair usage and system stability, API requests are rate-limited:

- **Anonymous users**: 100 requests per hour
- **Authenticated users**: 1,000 requests per hour
- **Premium users**: 10,000 requests per hour

Exceeding these limits will result in a 429 Too Many Requests response.

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests:

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

Error responses follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

## API Endpoints

### Authentication
- [Login](auth.md#login)
- [Register](auth.md#register)
- [Logout](auth.md#logout)
- [Forgot Password](auth.md#forgot-password)
- [Reset Password](auth.md#reset-password)

### Cities
- [Get All Cities](cities.md#get-all-cities)
- [Get City by ID](cities.md#get-city-by-id)
- [Create City](cities.md#create-city) *(Admin only)*
- [Update City](cities.md#update-city) *(Admin only)*
- [Delete City](cities.md#delete-city) *(Admin only)*

### Places
- [Get All Places](places.md#get-all-places)
- [Get Place by ID](places.md#get-place-by-id)
- [Create Place](places.md#create-place) *(Admin only)*
- [Update Place](places.md#update-place) *(Admin only)*
- [Delete Place](places.md#delete-place) *(Admin only)*
- [Get Places by City](places.md#get-places-by-city)

### Itineraries
- [Get All Itineraries](itineraries.md#get-all-itineraries)
- [Get Itinerary by ID](itineraries.md#get-itinerary-by-id)
- [Create Itinerary](itineraries.md#create-itinerary)
- [Update Itinerary](itineraries.md#update-itinerary)
- [Delete Itinerary](itineraries.md#delete-itinerary)
- [Generate AI Itinerary](itineraries.md#generate-ai-itinerary)
- [Get User Itineraries](itineraries.md#get-user-itineraries)

### Reviews
- [Get All Reviews](reviews.md#get-all-reviews)
- [Get Review by ID](reviews.md#get-review-by-id)
- [Create Review](reviews.md#create-review)
- [Update Review](reviews.md#update-review)
- [Delete Review](reviews.md#delete-review)
- [Vote Helpful](reviews.md#vote-helpful)
- [Get Place Reviews](reviews.md#get-place-reviews)

### Users
- [Get User Profile](users.md#get-user-profile)
- [Update User Profile](users.md#update-user-profile)
- [Get User Preferences](users.md#get-user-preferences)
- [Update User Preferences](users.md#update-user-preferences)
- [Get User Favorites](users.md#get-user-favorites)
- [Add to Favorites](users.md#add-to-favorites)
- [Remove from Favorites](users.md#remove-from-favorites)

### Gamification
- [Get User Badges](gamification.md#get-user-badges)
- [Get All Badges](gamification.md#get-all-badges)
- [Get Leaderboard](gamification.md#get-leaderboard)
- [Get User Rank](gamification.md#get-user-rank)

### Maps
- [Get City Map Data](maps.md#get-city-map-data)
- [Get Directions](maps.md#get-directions)
- [Get Nearby Places](maps.md#get-nearby-places)
- [Get Place Map Details](maps.md#get-place-map-details)

### Affiliates
- [Generate Affiliate Link](affiliates.md#generate-affiliate-link)
- [Track Affiliate Click](affiliates.md#track-affiliate-click)
- [Calculate Estimated Commission](affiliates.md#calculate-estimated-commission)

### Recommendations
- [Get Recommended Cities](recommendations.md#get-recommended-cities)
- [Get Recommended Places](recommendations.md#get-recommended-places)
- [Get Trending Cities](recommendations.md#get-trending-cities)
- [Get Similar Cities](recommendations.md#get-similar-cities)

### Exports
- [Export Itinerary as PDF](exports.md#export-itinerary-as-pdf)
- [Export Itinerary as JSON](exports.md#export-itinerary-as-json)
- [Export Itinerary to Calendar](exports.md#export-itinerary-to-calendar)

### Premium
- [Get Premium Status](premium.md#get-premium-status)
- [Upgrade to Premium](premium.md#upgrade-to-premium)

## Webhooks

City Explorer supports webhooks for real-time notifications:

### Supported Events
- `itinerary.created` - Triggered when a new itinerary is created
- `review.created` - Triggered when a new review is posted
- `user.subscribed` - Triggered when a user upgrades to premium
- `affiliate.conversion` - Triggered when an affiliate link converts

### Webhook Configuration
To receive webhook notifications, configure your webhook URL in the dashboard settings.

Webhook payloads follow this format:
```json
{
  "event": "itinerary.created",
  "timestamp": "2023-01-01T12:00:00Z",
  "data": {
    // Event-specific data
  }
}
```

## SDKs

Official SDKs are available for popular programming languages:

- [JavaScript SDK](sdks/javascript.md)
- [Python SDK](sdks/python.md)
- [Java SDK](sdks/java.md)
- [Ruby SDK](sdks/ruby.md)

## Changelog

For information about API changes, see the [Changelog](changelog.md).