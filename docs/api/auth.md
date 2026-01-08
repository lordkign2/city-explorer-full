# Authentication API

## Overview

The Authentication API provides endpoints for user registration, login, logout, and password management.

## Endpoints

### Login

Authenticate a user and obtain an access token.

```
POST /auth/login
```

#### Request Body
```json
{
  "email": "string",
  "password": "string"
}
```

#### Response
```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "username": "string",
    "email": "string",
    "isAdmin": boolean,
    "isPremium": boolean
  }
}
```

#### Errors
- 400: Missing email or password
- 401: Invalid credentials
- 500: Server error

### Register

Create a new user account.

```
POST /auth/register
```

#### Request Body
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string"
}
```

#### Response
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "username": "string",
    "email": "string"
  }
}
```

#### Errors
- 400: Validation errors (missing fields, password mismatch, etc.)
- 409: Email already exists
- 500: Server error

### Logout

Invalidate the user's session.

```
POST /auth/logout
```

#### Response
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Forgot Password

Send a password reset email to the user.

```
POST /auth/forgot-password
```

#### Request Body
```json
{
  "email": "string"
}
```

#### Response
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

#### Errors
- 400: Missing email
- 404: User not found
- 500: Email sending failed

### Reset Password

Reset the user's password using a token.

```
POST /auth/reset-password
```

#### Request Body
```json
{
  "token": "reset_token",
  "password": "string",
  "confirmPassword": "string"
}
```

#### Response
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

#### Errors
- 400: Invalid token or password mismatch
- 404: Token not found or expired
- 500: Server error

## Authentication Headers

Most API endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Token Expiration

Access tokens expire after 24 hours. Refresh tokens (if implemented) expire after 7 days.

## Session Management

User sessions are managed using Redis for optimal performance and scalability.

## Security Considerations

- Passwords are hashed using bcrypt with a cost factor of 12
- JWT tokens are signed using HS256 algorithm
- Rate limiting is applied to prevent brute force attacks
- Password strength requirements are enforced during registration