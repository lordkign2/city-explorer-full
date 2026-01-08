# Users API Endpoints

## Overview

The Users API provides endpoints for managing user accounts, profiles, preferences, and favorites.

## Endpoints

### Get User Profile

Retrieve the authenticated user's profile information.

```
GET /users/profile
```

#### Response
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "username": "string",
    "email": "string",
    "avatarUrl": "string",
    "firstName": "string",
    "lastName": "string",
    "bio": "string",
    "location": "string",
    "preferences": {
      "budget": "medium",
      "interests": ["culture", "food"],
      "notification": {
        "email": true,
        "push": true
      }
    },
    "isAdmin": false,
    "isPremium": false,
    "favorites": ["city_id"],
    "savedItineraries": ["itinerary_id"],
    "badges": ["badge_name"],
    "points": 1250,
    "lastActive": "2023-01-01T00:00:00.000Z",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Update User Profile

Update the authenticated user's profile information.

```
PUT /users/profile
```

#### Request Body
```json
{
  "firstName": "string",
  "lastName": "string",
  "bio": "string",
  "location": "string",
  "avatarUrl": "string"
}
```

#### Response
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "username": "string",
    "email": "string",
    "avatarUrl": "string",
    "firstName": "string",
    "lastName": "string",
    "bio": "string",
    "location": "string",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Get User Preferences

Retrieve the authenticated user's preferences.

```
GET /users/preferences
```

#### Response
```json
{
  "success": true,
  "preferences": {
    "budget": "medium",
    "interests": ["culture", "food"],
    "notification": {
      "email": true,
      "push": true
    }
  }
}
```

### Update User Preferences

Update the authenticated user's preferences.

```
PUT /users/preferences
```

#### Request Body
```json
{
  "budget": "medium",
  "interests": ["culture", "food"],
  "notification": {
    "email": true,
    "push": true
  }
}
```

#### Response
```json
{
  "success": true,
  "message": "Preferences updated successfully",
  "preferences": {
    "budget": "medium",
    "interests": ["culture", "food"],
    "notification": {
      "email": true,
      "push": true
    }
  }
}
```

### Get User Favorites

Retrieve the authenticated user's favorite cities.

```
GET /users/favorites
```

#### Response
```json
{
  "success": true,
  "favorites": [
    {
      "_id": "city_id",
      "name": "string",
      "country": {
        "_id": "country_id",
        "name": "string"
      },
      "imageUrl": "string"
    }
  ]
}
```

### Add to Favorites

Add a city to the user's favorites.

```
POST /users/favorites
```

#### Request Body
```json
{
  "city": "city_id"
}
```

#### Response
```json
{
  "success": true,
  "message": "City added to favorites",
  "favorites": ["city_id"]
}
```

### Remove from Favorites

Remove a city from the user's favorites.

```
DELETE /users/favorites
```

#### Request Body
```json
{
  "city": "city_id"
}
```

#### Response
```json
{
  "success": true,
  "message": "City removed from favorites",
  "favorites": []
}
```

### Get User Itineraries

Retrieve the authenticated user's saved itineraries.

```
GET /users/itineraries
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

### Get User Badges

Retrieve the authenticated user's earned badges.

```
GET /users/badges
```

#### Response
```json
{
  "success": true,
  "badges": [
    {
      "_id": "badge_id",
      "name": "string",
      "description": "string",
      "icon": "string",
      "category": "trivia",
      "points": 100,
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "points": 1250
}
```

### Get User Points History

Retrieve the authenticated user's points history.

```
GET /users/points/history
```

#### Response
```json
{
  "success": true,
  "pointsHistory": [
    {
      "_id": "point_id",
      "amount": 20,
      "reason": "trivia_correct",
      "relatedId": "trivia_id",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

### Update User Notification Settings

Update the authenticated user's notification preferences.

```
PUT /users/notifications
```

#### Request Body
```json
{
  "email": true,
  "push": false
}
```

#### Response
```json
{
  "success": true,
  "message": "Notification settings updated successfully",
  "notification": {
    "email": true,
    "push": false
  }
}
```

### Delete User Account

Permanently delete the authenticated user's account.

```
DELETE /users/account
```

#### Request Body
```json
{
  "password": "string"
}
```

#### Response
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```