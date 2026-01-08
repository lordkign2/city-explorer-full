# Community Reviews

## Overview

The Community Reviews feature enables users to share their experiences and opinions about places they've visited, creating a valuable resource for fellow travelers. This user-generated content enhances the platform with authentic experiences and recommendations, fostering a sense of community among City Explorer users.

## Review Components

### Rating System
- **5-Star Scale**: Overall experience rating
- **Category Ratings**: Specific aspects (food quality, service, ambiance, etc.)
- **Value Rating**: Cost-to-experience ratio assessment
- **Recommendation Indicator**: Would recommend to others (Yes/No)

### Written Reviews
- Minimum character requirement to encourage detailed feedback
- Structured prompts to guide content creation
- Photo upload capability
- Rich text formatting options

### Helpful Votes
- Community voting on review usefulness
- Sorting by helpfulness score
- Reporting system for inappropriate content
- Verified visitor badges

## Technical Implementation

### Data Structure
```json
{
  "review": {
    "_id": "ObjectId",
    "placeId": "ObjectId",
    "userId": "ObjectId",
    "userName": "string",
    "userAvatar": "string",
    "overallRating": "integer (1-5)",
    "ratings": {
      "food": "integer (1-5, optional)",
      "service": "integer (1-5, optional)",
      "ambiance": "integer (1-5, optional)",
      "value": "integer (1-5, optional)"
    },
    "wouldRecommend": "boolean",
    "title": "string",
    "comment": "string",
    "photos": ["string"],
    "visitDate": "date",
    "travelerType": "business|leisure|family|couple|solo",
    "helpfulVotes": "integer",
    "notHelpfulVotes": "integer",
    "verifiedVisitor": "boolean",
    "status": "pending|approved|rejected",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

### Place Integration
```json
{
  "place": {
    // ... other place fields
    "rating": {
      "average": "number",
      "count": "integer",
      "distribution": {
        "5": "integer",
        "4": "integer",
        "3": "integer",
        "2": "integer",
        "1": "integer"
      }
    },
    "reviews": ["reviewIds"]
  }
}
```

## API Endpoints

### Get Place Reviews
```
GET /api/v1/reviews/place/{placeId}?page={page}&limit={limit}&sort={sort}
```

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Items per page (default: 10, max: 50) |
| sort | string | Sort by: newest, oldest, highest, lowest, helpful |

#### Response
```json
{
  "success": true,
  "reviews": [
    {
      "_id": "review_id",
      "userId": "user_id",
      "userName": "John Doe",
      "userAvatar": "https://example.com/avatar.jpg",
      "overallRating": 5,
      "ratings": {
        "food": 5,
        "service": 4,
        "ambiance": 5,
        "value": 4
      },
      "wouldRecommend": true,
      "title": "Amazing experience!",
      "comment": "This place exceeded all expectations...",
      "photos": ["https://example.com/photo1.jpg"],
      "visitDate": "2023-06-15T00:00:00.000Z",
      "travelerType": "leisure",
      "helpfulVotes": 24,
      "notHelpfulVotes": 2,
      "verifiedVisitor": true,
      "createdAt": "2023-06-20T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalReviews": 48,
    "hasNext": true,
    "hasPrev": false
  },
  "summary": {
    "averageRating": 4.6,
    "totalReviews": 48,
    "ratingDistribution": {
      "5": 32,
      "4": 10,
      "3": 4,
      "2": 1,
      "1": 1
    },
    "wouldRecommendPercentage": 92
  }
}
```

### Create Review
```
POST /api/v1/reviews
```

#### Request Body
```json
{
  "placeId": "place_id",
  "overallRating": 5,
  "ratings": {
    "food": 5,
    "service": 4,
    "ambiance": 5,
    "value": 4
  },
  "wouldRecommend": true,
  "title": "Amazing experience!",
  "comment": "This place exceeded all expectations...",
  "visitDate": "2023-06-15T00:00:00.000Z",
  "travelerType": "leisure"
}
```

#### Response
```json
{
  "success": true,
  "review": {
    "_id": "review_id",
    "placeId": "place_id",
    "userId": "user_id",
    "userName": "John Doe",
    "userAvatar": "https://example.com/avatar.jpg",
    "overallRating": 5,
    "ratings": {
      "food": 5,
      "service": 4,
      "ambiance": 5,
      "value": 4
    },
    "wouldRecommend": true,
    "title": "Amazing experience!",
    "comment": "This place exceeded all expectations...",
    "visitDate": "2023-06-15T00:00:00.000Z",
    "travelerType": "leisure",
    "status": "pending",
    "createdAt": "2023-06-20T10:30:00.000Z"
  }
}
```

### Update Review
```
PUT /api/v1/reviews/{reviewId}
```

#### Request Body
```json
{
  "overallRating": 4,
  "ratings": {
    "food": 4,
    "service": 4,
    "ambiance": 4,
    "value": 4
  },
  "wouldRecommend": true,
  "title": "Great experience with one caveat",
  "comment": "Updated my thoughts after reflecting..."
}
```

#### Response
```json
{
  "success": true,
  "review": {
    "_id": "review_id",
    "placeId": "place_id",
    "userId": "user_id",
    "userName": "John Doe",
    "userAvatar": "https://example.com/avatar.jpg",
    "overallRating": 4,
    "ratings": {
      "food": 4,
      "service": 4,
      "ambiance": 4,
      "value": 4
    },
    "wouldRecommend": true,
    "title": "Great experience with one caveat",
    "comment": "Updated my thoughts after reflecting...",
    "visitDate": "2023-06-15T00:00:00.000Z",
    "travelerType": "leisure",
    "status": "approved",
    "createdAt": "2023-06-20T10:30:00.000Z",
    "updatedAt": "2023-06-25T14:15:00.000Z"
  }
}
```

### Delete Review
```
DELETE /api/v1/reviews/{reviewId}
```

#### Response
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

### Vote on Review Helpfulness
```
POST /api/v1/reviews/{reviewId}/vote
```

#### Request Body
```json
{
  "helpful": true
}
```

#### Response
```json
{
  "success": true,
  "message": "Vote recorded successfully",
  "review": {
    "_id": "review_id",
    "helpfulVotes": 25,
    "notHelpfulVotes": 2
  }
}
```

## User Interface

### Review Display
- Star rating visualization
- User avatar and name
- Review title and date
- Detailed comment with expandable/collapsible sections
- Photo gallery carousel
- Helpful vote buttons
- Share and report options

### Review Submission Form
- Star rating selectors
- Category-specific rating inputs
- Text area with character counter
- Photo upload interface
- Visit date picker
- Traveler type selection
- Preview functionality

### Review Management
- User's submitted reviews dashboard
- Edit/delete options for own reviews
- Moderation interface for admins
- Flagged content review queue

## Moderation System

### Automated Filters
- Profanity detection
- Spam pattern recognition
- Duplicate content identification
- Link and contact information filtering

### Manual Moderation
- Admin review queue
- Status management (approve/reject/pending)
- User reporting system
- Appeal process for rejected reviews

### Community Guidelines
- Clear posting rules and expectations
- Examples of appropriate/inappropriate content
- Consequences for guideline violations
- Transparency in moderation decisions

## Integration with Other Features

### AI-Powered Itineraries
- Reviews influence place recommendations
- Sentiment analysis for itinerary personalization
- Popular places highlighted in suggestions

### Gamification
- Points awarded for submitting reviews
- Badges for review milestones
- Quality bonuses for helpful reviews
- Elite reviewer status

### Search and Discovery
- Reviews factor into place search rankings
- Filter by rating ranges
- Sort by review recency and quality
- Keyword search within review text

## Performance Optimization

### Database Indexing
- Compound indexes for common query patterns
- Text indexing for review content search
- Efficient joins for user and place data

### Caching Strategy
- Cache popular place reviews
- Store aggregated rating data
- Cache user-specific review data

### Pagination
- Efficient cursor-based pagination
- Limit maximum page sizes
- Precompute page counts for large datasets

## Security Considerations

### Data Privacy
- Anonymize user data in public displays
- Secure photo storage and delivery
- Protect against review scraping

### Abuse Prevention
- Rate limiting for review submissions
- CAPTCHA for suspicious activity
- IP-based restrictions for repeat offenders

### Content Security
- XSS prevention in review content
- File type validation for photo uploads
- Size limitations for all user inputs

## Monitoring and Analytics

### Review Metrics
- Total reviews submitted
- Approval/rejection rates
- Average review length
- Photo attachment rates

### User Engagement
- Review submission frequency
- Helpful vote participation
- Review update rates
- Response to moderation actions

### Quality Indicators
- Average helpful votes per review
- Reported review rates
- Moderator intervention frequency
- User satisfaction with review system

## Troubleshooting

### Common Issues

1. **Reviews Not Appearing**
   - Check moderation status
   - Verify place association
   - Confirm user account status

2. **Photo Upload Failures**
   - Check file size limits
   - Verify supported formats
   - Review storage quota

3. **Rating Calculation Errors**
   - Validate rating values
   - Check aggregation logic
   - Review database consistency

## Future Enhancements

### Advanced Features
- Video review support
- Review response system (owner replies)
- Review comparison tools
- Seasonal review highlighting

### Social Integration
- Social media sharing optimization
- Friend review notifications
- Collaborative review creation
- Influencer review programs

### AI Enhancement
- Automated review summarization
- Sentiment trend analysis
- Fake review detection improvements
- Personalized review recommendations

## Best Practices

### For Users
- Be honest and constructive in reviews
- Provide specific details and examples
- Respect businesses and other customers
- Update reviews when experiences change

### For Business Owners
- Respond professionally to negative reviews
- Encourage satisfied customers to share experiences
- Address concerns raised in reviews
- Use feedback to improve services

### For Developers
- Implement comprehensive input validation
- Monitor for abuse patterns and anomalies
- Regularly update moderation rules
- Optimize database queries for performance