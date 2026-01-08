# Cities API

## Overview

The Cities API provides endpoints for managing city information including listing, searching, and administrating cities.

## Endpoints

### Get All Cities

Retrieve a list of all cities with optional filtering and pagination.

```
GET /cities
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Number of items per page (default: 10, max: 100) |
| search | string | Search term to filter cities by name |
| sortBy | string | Field to sort by (name, population, createdAt) |
| sortOrder | string | Sort order (asc, desc) |

#### Response
```json
{
  "success": true,
  "cities": [
    {
      "_id": "city_id",
      "name": "string",
      "country": {
        "_id": "country_id",
        "name": "string"
      },
      "population": 123456,
      "coordinates": {
        "lat": 12.3456,
        "lng": 78.9012
      },
      "imageUrl": "string",
      "viewCount": 123
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalCities": 100,
    "limit": 10
  }
}
```

### Get City by ID

Retrieve detailed information about a specific city.

```
GET /cities/{id}
```

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | City ID |

#### Response
```json
{
  "success": true,
  "city": {
    "_id": "city_id",
    "name": "string",
    "slug": "string",
    "country": {
      "_id": "country_id",
      "name": "string"
    },
    "population": 123456,
    "coordinates": {
      "lat": 12.3456,
      "lng": 78.9012
    },
    "description": "string",
    "imageUrl": "string",
    "images": ["string"],
    "funFacts": ["string"],
    "categories": ["string"],
    "tags": ["string"],
    "seo": {
      "title": "string",
      "description": "string",
      "keywords": ["string"]
    },
    "affiliateLinks": {
      "hotels": "string",
      "tours": "string",
      "flights": "string"
    },
    "viewCount": 123,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Errors
- 404: City not found

### Create City

Create a new city (admin only).

```
POST /cities
```

#### Request Body
```json
{
  "name": "string",
  "country": "country_id",
  "population": 123456,
  "coordinates": {
    "lat": 12.3456,
    "lng": 78.9012
  },
  "description": "string",
  "categories": ["string"],
  "tags": ["string"]
}
```

#### Response
```json
{
  "success": true,
  "city": {
    "_id": "city_id",
    "name": "string",
    "slug": "string",
    "country": "country_id",
    "population": 123456,
    "coordinates": {
      "lat": 12.3456,
      "lng": 78.9012
    },
    "description": "string",
    "imageUrl": "string",
    "categories": ["string"],
    "tags": ["string"],
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Errors
- 400: Validation errors
- 401: Unauthorized
- 403: Forbidden (admin only)
- 409: City name already exists

### Update City

Update an existing city (admin only).

```
PUT /cities/{id}
```

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | City ID |

#### Request Body
```json
{
  "name": "string",
  "country": "country_id",
  "population": 123456,
  "coordinates": {
    "lat": 12.3456,
    "lng": 78.9012
  },
  "description": "string",
  "categories": ["string"],
  "tags": ["string"]
}
```

#### Response
```json
{
  "success": true,
  "city": {
    "_id": "city_id",
    "name": "string",
    "slug": "string",
    "country": "country_id",
    "population": 123456,
    "coordinates": {
      "lat": 12.3456,
      "lng": 78.9012
    },
    "description": "string",
    "imageUrl": "string",
    "categories": ["string"],
    "tags": ["string"],
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Errors
- 400: Validation errors
- 401: Unauthorized
- 403: Forbidden (admin only)
- 404: City not found
- 409: City name already exists

### Delete City

Delete a city (admin only).

```
DELETE /cities/{id}
```

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | City ID |

#### Response
```json
{
  "success": true,
  "message": "City deleted successfully"
}
```

#### Errors
- 401: Unauthorized
- 403: Forbidden (admin only)
- 404: City not found

## Filtering and Search

The cities endpoint supports various filtering options:

### By Category
```
GET /cities?category=beach
```

### By Tag
```
GET /cities?tag=historical
```

### By Country
```
GET /cities?country=country_id
```

### Search by Name
```
GET /cities?search=Paris
```

## Pagination

All list endpoints support pagination:

```
GET /cities?page=2&limit=20
```

The response includes pagination information:
```json
{
  "pagination": {
    "currentPage": 2,
    "totalPages": 10,
    "totalCities": 200,
    "limit": 20
  }
}
```

## Sorting

Results can be sorted by different fields:

```
GET /cities?sortBy=name&sortOrder=asc
```

Supported sort fields:
- `name`
- `population`
- `createdAt`
- `viewCount`

## Rate Limiting

This API is subject to rate limiting:
- Anonymous users: 100 requests/hour
- Authenticated users: 1,000 requests/hour
- Admin users: 10,000 requests/hour

## Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |