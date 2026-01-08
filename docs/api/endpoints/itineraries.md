# Itineraries API Endpoints

## Overview

The Itineraries API provides endpoints for creating, managing, and sharing AI-powered travel itineraries.

## Endpoints

### Get All Itineraries

Retrieve a list of itineraries with optional filtering.

```
GET /itineraries
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| cityId | string | Filter by city ID |
| userId | string | Filter by user ID |
| isPublic | boolean | Filter by public/private status |
| page | integer | Page number (default: 1) |
| limit | integer | Items per page (default: 10) |

#### Response
```json
{
  "success": true,
  "itineraries": [
    {
      "_id": "itinerary_id",
      "userId": "user_id",
      "cityId": {
        "_id": "city_id",
        "name": "string"
      },
      "title": "string",
      "days": 3,
      "isPublic": true,
      "viewCount": 123,
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Itinerary by ID

Retrieve detailed information about a specific itinerary.

```
GET /itineraries/{id}
```

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Itinerary ID |

#### Response
```json
{
  "success": true,
  "itinerary": {
    "_id": "itinerary_id",
    "userId": {
      "username": "string"
    },
    "cityId": {
      "_id": "city_id",
      "name": "string"
    },
    "title": "string",
    "description": "string",
    "days": [
      {
        "day": 1,
        "date": "2023-01-01T00:00:00.000Z",
        "items": [
          {
            "time": "9:00 AM",
            "placeId": "place_id",
            "placeName": "string",
            "type": "attraction|restaurant|hotel|custom",
            "note": "string",
            "duration": "2 hours"
          }
        ]
      }
    ],
    "preferences": {
      "budget": "medium",
      "interests": ["culture", "food"],
      "startDate": "2023-01-01T00:00:00.000Z",
      "endDate": "2023-01-03T00:00:00.000Z"
    },
    "weather": {
      "condition": "sunny",
      "temperature": 25
    },
    "isPublic": true,
    "viewCount": 123,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Create Itinerary

Create a new itinerary.

```
POST /itineraries
```

#### Request Body
```json
{
  "cityId": "city_id",
  "title": "string",
  "description": "string",
  "days": [
    {
      "day": 1,
      "date": "2023-01-01T00:00:00.000Z",
      "items": [
        {
          "time": "9:00 AM",
          "placeId": "place_id",
          "placeName": "string",
          "type": "attraction|restaurant|hotel|custom",
          "note": "string",
          "duration": "2 hours"
        }
      ]
    }
  ],
  "preferences": {
    "budget": "medium",
    "interests": ["culture", "food"],
    "startDate": "2023-01-01T00:00:00.000Z",
    "endDate": "2023-01-03T00:00:00.000Z"
  },
  "isPublic": true
}
```

#### Response
```json
{
  "success": true,
  "itinerary": {
    "_id": "itinerary_id",
    "userId": "user_id",
    "cityId": "city_id",
    "title": "string",
    "description": "string",
    "days": [
      {
        "day": 1,
        "date": "2023-01-01T00:00:00.000Z",
        "items": [
          {
            "time": "9:00 AM",
            "placeId": "place_id",
            "placeName": "string",
            "type": "attraction|restaurant|hotel|custom",
            "note": "string",
            "duration": "2 hours"
          }
        ]
      }
    ],
    "preferences": {
      "budget": "medium",
      "interests": ["culture", "food"],
      "startDate": "2023-01-01T00:00:00.000Z",
      "endDate": "2023-01-03T00:00:00.000Z"
    },
    "isPublic": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Update Itinerary

Update an existing itinerary.

```
PUT /itineraries/{id}
```

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Itinerary ID |

#### Request Body
```json
{
  "title": "string",
  "description": "string",
  "days": [
    {
      "day": 1,
      "date": "2023-01-01T00:00:00.000Z",
      "items": [
        {
          "time": "9:00 AM",
          "placeId": "place_id",
          "placeName": "string",
          "type": "attraction|restaurant|hotel|custom",
          "note": "string",
          "duration": "2 hours"
        }
      ]
    }
  ],
  "preferences": {
    "budget": "medium",
    "interests": ["culture", "food"],
    "startDate": "2023-01-01T00:00:00.000Z",
    "endDate": "2023-01-03T00:00:00.000Z"
  },
  "isPublic": true
}
```

#### Response
```json
{
  "success": true,
  "itinerary": {
    "_id": "itinerary_id",
    "userId": "user_id",
    "cityId": "city_id",
    "title": "string",
    "description": "string",
    "days": [
      {
        "day": 1,
        "date": "2023-01-01T00:00:00.000Z",
        "items": [
          {
            "time": "9:00 AM",
            "placeId": "place_id",
            "placeName": "string",
            "type": "attraction|restaurant|hotel|custom",
            "note": "string",
            "duration": "2 hours"
          }
        ]
      }
    ],
    "preferences": {
      "budget": "medium",
      "interests": ["culture", "food"],
      "startDate": "2023-01-01T00:00:00.000Z",
      "endDate": "2023-01-03T00:00:00.000Z"
    },
    "isPublic": true,
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Delete Itinerary

Delete an itinerary.

```
DELETE /itineraries/{id}
```

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Itinerary ID |

#### Response
```json
{
  "success": true,
  "message": "Itinerary deleted successfully"
}
```

### Generate AI Itinerary

Generate an AI-powered itinerary based on user preferences.

```
POST /itineraries/generate
```

#### Request Body
```json
{
  "cityId": "city_id",
  "days": 3,
  "budget": "medium",
  "interests": ["culture", "food"],
  "startDate": "2023-01-01T00:00:00.000Z"
}
```

#### Response
```json
{
  "success": true,
  "itinerary": {
    "_id": "itinerary_id",
    "userId": "user_id",
    "cityId": "city_id",
    "cityName": "string",
    "title": "3-Day City Adventure",
    "description": "A personalized 3-day itinerary for City based on your preferences.",
    "days": [
      {
        "day": 1,
        "date": "2023-01-01T00:00:00.000Z",
        "items": [
          {
            "time": "9:00 AM",
            "placeName": "Morning Activity",
            "type": "attraction",
            "description": "string"
          }
        ]
      }
    ],
    "preferences": {
      "budget": "medium",
      "interests": ["culture", "food"],
      "startDate": "2023-01-01T00:00:00.000Z"
    },
    "weather": {
      "condition": "sunny",
      "temperature": 25
    }
  },
  "message": "Itinerary generated successfully with AI!"
}
```

### Get User Itineraries

Retrieve itineraries created by the authenticated user.

```
GET /itineraries/user
```

#### Response
```json
{
  "success": true,
  "itineraries": [
    {
      "_id": "itinerary_id",
      "cityId": {
        "_id": "city_id",
        "name": "string"
      },
      "title": "string",
      "days": 3,
      "isPublic": true,
      "viewCount": 123,
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

### Save Itinerary

Save an itinerary to the user's profile.

```
POST /itineraries/save
```

#### Request Body
```json
{
  "itineraryId": "itinerary_id"
}
```

#### Response
```json
{
  "success": true,
  "message": "Itinerary saved successfully"
}
```