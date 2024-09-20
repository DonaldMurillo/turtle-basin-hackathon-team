# Authentication Feature Documentation

## Overview

This document provides comprehensive information about the authentication system implemented in the BasicStarter project. The authentication system uses JSON Web Tokens (JWT) for secure, stateless authentication, with the addition of refresh tokens for enhanced security and user experience.

## Features

- User registration
- User login
- Access token generation
- Refresh token mechanism
- Session management

## Technical Stack

- Express.js
- Prisma ORM
- JSON Web Tokens (jsonwebtoken library)
- bcrypt for password hashing

## API Endpoints

### 1. User Registration

- **Endpoint**: `POST /auth/register`
- **Purpose**: Register a new user in the system
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**: 
  - Success (201 Created):
    ```json
    {
      "message": "User registered successfully",
      "userId": "user-uuid"
    }
    ```
  - Error (400 Bad Request):
    ```json
    {
      "error": "User already exists"
    }
    ```

### 2. User Login

- **Endpoint**: `POST /auth/login`
- **Purpose**: Authenticate a user and provide access and refresh tokens
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**:
  - Success (200 OK):
    ```json
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
  - Error (401 Unauthorized):
    ```json
    {
      "error": "Invalid credentials"
    }
    ```

### 3. Refresh Token

- **Endpoint**: `POST /auth/refresh`
- **Purpose**: Generate a new access token using a valid refresh token
- **Request Body**:
  ```json
  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Response**:
  - Success (200 OK):
    ```json
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
  - Error (401 Unauthorized):
    ```json
    {
      "error": "Invalid refresh token"
    }
    ```

## Implementation Details

### User Model

The User model in the Prisma schema has been updated to include sessions:

```prisma
model User {
  id                String      @id @default(uuid())
  email             String      @unique
  password          String
  name              String?
  role              Role        @default(USER)
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
  sessions          Session[]
  // ... other fields
}
```

### Session Model

A new Session model has been added to manage refresh tokens:

```prisma
model Session {
  id           String   @id @default(uuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  refreshToken String   @unique
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### Token Generation

- Access tokens are generated with a short expiry (15 minutes) and contain the user's ID.
- Refresh tokens are generated with a longer expiry (7 days) and are stored in the database.

### Security Considerations

1. **Password Hashing**: User passwords are hashed using bcrypt before storage.
2. **Token Expiry**: Access tokens have a short lifespan to minimize the impact of token theft.
3. **Refresh Token Rotation**: Implement refresh token rotation for enhanced security (not implemented in the current version).
4. **HTTPS**: Ensure all authentication endpoints are served over HTTPS in production.

## Usage Guide

### Authenticating Requests

To authenticate API requests, include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Handling Token Expiration

When an access token expires:

1. Catch the 401 Unauthorized error from the API.
2. Use the refresh token to obtain a new access token.
3. Retry the original request with the new access token.

### Logout Process

To logout a user:

1. Delete the refresh token from the client-side storage.
2. (Optional) Implement a server-side endpoint to invalidate the refresh token in the database.

## Best Practices

1. **Token Storage**: Store the access token in memory (e.g., JavaScript variable) and the refresh token in an HTTP-only cookie or secure storage.
2. **Error Handling**: Implement proper error handling and provide meaningful error messages to the client.
3. **Rate Limiting**: Implement rate limiting on authentication endpoints to prevent brute-force attacks.
4. **Monitoring**: Set up logging and monitoring for authentication-related events for security analysis.

## Future Enhancements

1. Implement refresh token rotation for enhanced security.
2. Add support for multi-factor authentication (MFA).
3. Implement OAuth2 for third-party authentication providers.
4. Add an endpoint for users to manage their active sessions.

## Troubleshooting

- **Issue**: Unable to authenticate
  **Solution**: Ensure the correct email and password are being sent. Check if the user exists in the database.

- **Issue**: Refresh token not working
  **Solution**: Verify that the refresh token is valid and not expired. Check if the session exists in the database.

## Conclusion

This authentication system provides a secure and scalable solution for user management in the BasicStarter project. By following the guidelines and best practices outlined in this document, developers can effectively implement and maintain the authentication feature.
