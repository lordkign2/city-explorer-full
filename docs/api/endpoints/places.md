# Places API Endpoints

## Overview

The Places API provides endpoints for managing places including attractions, restaurants, and hotels.

## Endpoints

### Get All Places

Retrieve a list of all places with optional filtering.

```
GET /places
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| cityId | string | Filter by city ID |
| type | string | Filter by type (attraction, restaurant, hotel) |
| category | string | Filter by category |
| search | string | Search by name |
| page | integer | Page number (default: 1) |
| limit | integer | Items per page (default: 10) |

#### Response
```json
{
  "success": true,
  "places": [
    {
      "_id": "place_id",
      "name": "string",
      "type": "attraction|restaurant|hotel",
      "cityId": "city_id",
      "coordinates": {
        "lat": 12.3456,
        "lng": 78.9012
      },
      "rating": {
        "average": 4.5,
        "count": 123
      },
      "priceRange": "$$",
      "images": ["string"]
    }
  ]
}
```

### Get Place by ID

Retrieve detailed information about a specific place.

```
GET /places/{id}
```

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Place ID |

#### Response
```json
{
  "success": true,
  "place": {
    "_id": "place_id",
    "name": "string",
    "slug": "string",
    "cityId": "city_id",
    "countryId": "country_id",
    "type": "attraction|restaurant|hotel",
    "description": "string",
    "address": "string",
    "coordinates": {
      "lat": 12.3456,
      "lng": 78.9012
    },
    "categories": ["string"],
    "tags": ["string"],
    "rating": {
      "average": 4.5,
      "count": 123
    },
    "priceRange": "$$",
    "contact": {
      "phone": "string",
      "website": "string",
      "email": "string"
    },
    "images": ["string"],
    "hours": {
      "monday": "string",
      "tuesday": "string",
      "wednesday": "string",
      "thursday": "string",
      "friday": "string",
      "saturday": "string",
      "sunday": "string"
    },
    "amenities": ["string"],
    "affiliateLink": "string",
    "seo": {
      "title": "string",
      "description": "string",
      "keywords": ["string"]
    },
    "viewCount": 123,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
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
  ]
}
```

### Create Place

Create a new place (admin only).

```
POST /places
```

#### Request Body
```json
{
  "name": "string",
  "cityId": "city_id",
  "countryId": "country_id",
  "type": "attraction|restaurant|hotel",
  "description": "string",
  "address": "string",
  "coordinates": {
    "lat": 12.3456,
    "lng": 78.9012
  },
  "categories": ["string"],
  "tags": ["string"],
  "priceRange": "$$",
  "contact": {
    "phone": "string",
    "website": "string",
    "email": "string"
  },
  "hours": {
    "monday": "string",
    "tuesday": "string",
    "wednesday": "string",
    "thursday": "string",
    "friday": "string",
    "saturday": "string",
    "sunday": "string"
  },
  "amenities": ["string"]
}
```

#### Response
```json
{
  "success": true,
  "place": {
    "_id": "place_id",
    "name": "string",
    "slug": "string",
    "cityId": "city_id",
    "countryId": "country_id",
    "type": "attraction|restaurant|hotel",
    "description": "string",
    "address": "string",
    "coordinates": {
      "lat": 12.3456,
      "lng": 78.9012
    },
    "categories": ["string"],
    "tags": ["string"],
    "priceRange": "$$",
    "contact": {
      "phone": "string",
      "website": "string",
      "email": "string"
    },
    "hours": {
      "monday": "string",
      "tuesday": "string",
      "wednesday": "string",
      "thursday": "string",
      "friday": "string",
      "saturday": "string",
      "sunday": "string"
    },
    "amenities": ["string"],
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Update Place

Update an existing place (admin only).

```
PUT /places/{id}
```

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Place ID |

#### Request Body
```json
{
  "name": "string",
  "cityId": "city_id",
  "countryId": "country_id",
  "type": "attraction|restaurant|hotel",
  "description": "string",
  "address": "string",
  "coordinates": {
    "lat": 12.3456,
    "lng": 78.9012
  },
  "categories": ["string"],
  "tags": ["string"],
  "priceRange": "$$",
  "contact": {
    "phone": "string",
    "website": "string",
    "email": "string"
  },
  "hours": {
    "monday": "string",
    "tuesday": "string",
    "wednesday": "string",
    "thursday": "string",
    "friday": "string",
    "saturday": "string",
    "sunday": "string"
  },
  "amenities": ["string"]
}
```

#### Response
```json
{
  "success": true,
  "place": {
    "_id": "place_id",
    "name": "string",
    "slug": "string",
    "cityId": "city_id",
    "countryId": "country_id",
    "type": "attraction|restaurant|hotel",
    "description": "string",
    "address": "string",
    "coordinates": {
      "lat": 12.3456,
      "lng": 78.9012
    },
    "categories": ["string"],
    "tags": ["string"],
    "priceRange": "$$",
    "contact": {
      "phone": "string",
      "website": "string",
      "email": "string"
    },
    "hours": {
      "monday": "string",
      "tuesday": "string",
      "wednesday": "string",
      "thursday": "string",
      "friday": "string",
      "saturday": "string",
      "sunday": "string"
    },
    "amenities": ["string"],
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Delete Place

Delete a place (admin only).

```
DELETE /places/{id}
```

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Place ID |

#### Response
```json
{
  "success": true,
  "message": "Place deleted successfully"
}
```

### Get Places by City

Retrieve places for a specific city with pagination.

```
GET /places/city/{cityId}
```

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| cityId | string | City ID |

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Items per page (default: 10) |
| type | string | Filter by type |
| category | string | Filter by category |

#### Response
```json
{
  "success": true,
  "places": [
    {
      "_id": "place_id",
      "name": "string",
      "type": "attraction|restaurant|hotel",
      "cityId": "city_id",
      "coordinates": {
        "lat": 12.3456,
        "lng": 78.9012
      },
      "rating": {
        "average": 4.5,
        "count": 123
      },
      "priceRange": "$$",
      "images": ["string"]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalPlaces": 100
  }
}
```

### Import Places

Import places from Google Places API (admin only).

```
POST /places/import
```

#### Request Body
```json
{
  "cityId": "city_id",
  "query": "string",
  "type": "string"
}
```

#### Response
```json
{
  "success": true,
  "message": "Imported X places",
  "places": [
    {
      "_id": "place_id",
      "name": "string",
      "type": "attraction|restaurant|hotel",
      "cityId": "city_id"
    }
  ]
}
```