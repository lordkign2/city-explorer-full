# Reviews API Endpoints

## Overview

The Reviews API provides endpoints for managing user reviews and ratings for cities and places.

## Endpoints

### Get All Reviews

Retrieve a list of reviews with optional filtering.

```
GET /reviews
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| placeId | string | Filter by place ID |
| cityId | string | Filter by city ID |
| userId | string | Filter by user ID |
| rating | integer | Filter by rating (1-5) |
| page | integer | Page number (default: 1) |
| limit | integer | Items per page (default: 10) |

#### Response
```json
{
  "success": true,
  "reviews": [
    {
      "_id": "review_id",
      "userId": {
        "username": "string",
        "avatarUrl": "string"
      },
      "placeId": {
        "_id": "place_id",
        "name": "string"
      },
      "cityId": {
        "_id": "city_id",
        "name": "string"
      },
      "rating": 5,
      "title": "string",
      "comment": "string",
      "helpful": [
        {
          "userId": "user_id",
          "vote": 1
        }
      ],
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Review by ID

Retrieve detailed information about a specific review.

```
GET /reviews/{id}
```

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Review ID |

#### Response
```json
{
  "success": true,
  "review": {
    "_id": "review_id",
    "userId": {
      "username": "string",
      "avatarUrl": "string"
    },
    "placeId": {
      "_id": "place_id",
      "name": "string"
    },
    "cityId": {
      "_id": "city_id",
      "name": "string"
    },
    "rating": 5,
    "title": "string",
    "comment": "string",
    "pros": ["string"],
    "cons": ["string"],
    "visitedDate": "2023-01-01T00:00:00.000Z",
    "helpful": [
      {
        "userId": "user_id",
        "vote": 1
      }
    ],
    "images": ["string"],
    "isVerified": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Create Review

Create a new review.

```
POST /reviews
```

#### Request Body
```json
{
  "placeId": "place_id",
  "cityId": "city_id",
  "rating": 5,
  "title": "string",
  "comment": "string",
  "pros": ["string"],
  "cons": ["string"],
  "visitedDate": "2023-01-01T00:00:00.000Z",
  "images": ["string"]
}
```

#### Response
```json
{
  "success": true,
  "review": {
    "_id": "review_id",
    "userId": "user_id",
    "placeId": "place_id",
    "cityId": "city_id",
    "rating": 5,
    "title": "string",
    "comment": "string",
    "pros": ["string"],
    "cons": ["string"],
    "visitedDate": "2023-01-01T00:00:00.000Z",
    "images": ["string"],
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Update Review

Update an existing review.

```
PUT /reviews/{id}
```

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Review ID |

#### Request Body
```json
{
  "rating": 5,
  "title": "string",
  "comment": "string",
  "pros": ["string"],
  "cons": ["string"],
  "visitedDate": "2023-01-01T00:00:00.000Z",
  "images": ["string"]
}
```

#### Response
```json
{
  "success": true,
  "review": {
    "_id": "review_id",
    "userId": "user_id",
    "placeId": "place_id",
    "cityId": "city_id",
    "rating": 5,
    "title": "string",
    "comment": "string",
    "pros": ["string"],
    "cons": ["string"],
    "visitedDate": "2023-01-01T00:00:00.000Z",
    "images": ["string"],
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Delete Review

Delete a review.

```
DELETE /reviews/{id}
```

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Review ID |

#### Response
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

### Vote Helpful

Vote on whether a review is helpful.

```
POST /reviews/{id}/vote
```

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Review ID |

#### Request Body
```json
{
  "vote": 1
}
```

Vote values:
- `1` - Helpful
- `-1` - Not helpful

#### Response
```json
{
  "success": true,
  "message": "Vote recorded successfully",
  "helpfulScore": 5
}
```

### Get Place Reviews

Retrieve reviews for a specific place with pagination.

```
GET /reviews/place/{placeId}
```

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| placeId | string | Place ID |

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Items per page (default: 10) |

#### Response
```json
{
  "success": true,
  "reviews": [
    {
      "_id": "review_id",
      "userId": {
        "username": "string",
        "avatarUrl": "string"
      },
      "rating": 5,
      "comment": "string",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "averageRating": 4.5,
  "totalReviews": 123,
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalReviews": 123
  }
}
```