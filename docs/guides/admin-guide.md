# Administrator Guide

This guide provides comprehensive information for administrators managing the City Explorer platform.

## Overview

As an administrator, you have elevated privileges to manage the platform, users, content, and system settings. This guide covers all administrative functions and best practices.

## Administrative Access

### Gaining Access

1. Ensure you have an admin account
2. Log in to the platform
3. Navigate to the admin dashboard at `/admin`

### Admin Roles

City Explorer supports different administrative roles:
- **Super Admin**: Full access to all administrative functions
- **Content Admin**: Manage cities, places, and content
- **User Admin**: Manage user accounts and permissions
- **System Admin**: Manage system settings and configurations

## Dashboard Overview

The admin dashboard provides a centralized view of platform metrics and management functions:

### Key Metrics
- Total users
- Active users (last 24 hours)
- Total cities
- Total places
- Recent activity
- System health status

### Quick Actions
- Create new city
- Add new place
- View user reports
- Check system logs
- Manage content

## User Management

### Viewing Users

Navigate to `/admin/users` to view all user accounts:
- Search and filter users
- Sort by registration date, last activity, etc.
- View user details and activity history

### Managing User Accounts

#### Suspending Users
1. Locate the user in the user list
2. Click "Manage User"
3. Select "Suspend Account"
4. Provide a reason for suspension
5. Set suspension duration (temporary or permanent)

#### Deleting Users
1. Locate the user in the user list
2. Click "Manage User"
3. Select "Delete Account"
4. Confirm deletion (irreversible action)

#### Modifying User Permissions
1. Locate the user in the user list
2. Click "Manage User"
3. Edit user roles and permissions
4. Save changes

### User Reports

View and manage user-generated reports:
- Inappropriate content reports
- Spam reports
- Technical issues reports
- Feature requests

## Content Management

### City Management

#### Adding New Cities
1. Navigate to `/admin/cities/new`
2. Fill in city details:
   - Name
   - Country
   - Population
   - Coordinates
   - Description
   - Categories and tags
3. Upload or link images
4. Configure SEO settings
5. Save city

#### Editing Existing Cities
1. Navigate to `/admin/cities`
2. Find the city to edit
3. Click "Edit"
4. Make necessary changes
5. Save updates

#### Deleting Cities
1. Navigate to `/admin/cities`
2. Find the city to delete
3. Click "Delete"
4. Confirm deletion

### Place Management

#### Adding New Places
1. Navigate to `/admin/places/new`
2. Select city
3. Fill in place details:
   - Name
   - Type (attraction, restaurant, hotel)
   - Address
   - Coordinates
   - Description
   - Categories and tags
   - Hours of operation
   - Price range
   - Amenities
4. Upload images
5. Save place

#### Importing Places from Google Places
1. Navigate to `/admin/places/import`
2. Select city
3. Enter search query (e.g., "restaurants in Paris")
4. Select place types to import
5. Start import process
6. Review and confirm imported places

#### Editing Places
1. Navigate to `/admin/places`
2. Find the place to edit
3. Click "Edit"
4. Make necessary changes
5. Save updates

#### Deleting Places
1. Navigate to `/admin/places`
2. Find the place to delete
3. Click "Delete"
4. Confirm deletion

## System Management

### Configuration Settings

#### General Settings
- Site name and description
- Contact information
- Default language
- Timezone settings

#### Email Configuration
- SMTP settings
- Email templates
- Notification preferences

#### API Keys
- Manage third-party API keys
- Monitor API usage
- Rotate compromised keys

#### Security Settings
- Password requirements
- Session timeout
- Rate limiting thresholds
- CAPTCHA settings

### Monitoring and Maintenance

#### System Health
- Database connection status
- Redis cache status
- Third-party API connectivity
- Disk space and memory usage

#### Logs
- Application logs
- Error logs
- Security logs
- Audit trails

#### Backups
- Schedule automated backups
- Restore from backups
- Backup storage management

#### Performance
- Cache management
- Database optimization
- CDN configuration
- Image optimization

## Analytics and Reporting

### User Analytics
- Registration trends
- User engagement metrics
- Retention rates
- Geographic distribution

### Content Analytics
- Popular cities and places
- Content views and interactions
- Search trends
- User-generated content metrics

### Revenue Analytics
- Affiliate link performance
- Premium subscription metrics
- Advertising revenue
- Conversion rates

### Technical Analytics
- API usage statistics
- Response time metrics
- Error rates
- Uptime statistics

## Troubleshooting

### Common Issues

#### Database Connection Problems
1. Check database service status
2. Verify connection string
3. Check firewall settings
4. Review database logs

#### Redis Cache Issues
1. Check Redis service status
2. Verify connection settings
3. Monitor memory usage
4. Restart Redis service if needed

#### Email Delivery Problems
1. Check SMTP settings
2. Verify credentials
3. Review spam filters
4. Check email logs

#### Performance Degradation
1. Check system resources
2. Review slow query logs
3. Optimize database indexes
4. Clear cache if necessary

### Emergency Procedures

#### Service Outage
1. Identify affected services
2. Check system status
3. Notify users of outage
4. Implement mitigation strategies
5. Document incident

#### Security Breach
1. Isolate affected systems
2. Change compromised credentials
3. Review access logs
4. Notify affected users
5. Implement additional security measures

## Best Practices

### Security
- Regularly update software and dependencies
- Use strong, unique passwords
- Enable two-factor authentication
- Regularly review access logs
- Implement principle of least privilege

### Performance
- Monitor system resources regularly
- Optimize database queries
- Use caching effectively
- Implement CDN for static assets
- Regularly review and optimize code

### Data Management
- Implement regular backup schedules
- Test backup restoration procedures
- Monitor database growth
- Archive old data when appropriate
- Implement data retention policies

### User Experience
- Respond to user feedback promptly
- Monitor user satisfaction metrics
- Regularly review and update content
- Ensure mobile responsiveness
- Maintain accessibility standards

## Support Resources

### Documentation
- User guides
- API documentation
- Technical specifications
- Troubleshooting guides

### Community
- Admin forums
- Knowledge base
- Best practices sharing
- Peer support

### Vendor Support
- Database vendor support
- Cloud platform support
- Third-party service support
- Professional services

By following this administrator guide, you can effectively manage and maintain the City Explorer platform to provide the best possible experience for your users.