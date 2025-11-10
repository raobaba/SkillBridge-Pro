# User Service - API Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Service Architecture](#service-architecture)
3. [Authentication & Authorization](#authentication--authorization)
4. [User Management APIs](#user-management-apis)
5. [Portfolio Sync APIs](#portfolio-sync-apis)
6. [Notifications APIs](#notifications-apis)
7. [OAuth Integration Flows](#oauth-integration-flows)
8. [Database Models](#database-models)
9. [Error Handling](#error-handling)

---

## Overview

The **User Service** is a microservice responsible for managing user accounts, authentication, authorization, portfolio synchronization, and notifications. It serves as the central authentication hub for the SkillBridge Pro platform.

### Key Features

- 🔐 User Registration & Authentication
- 🔑 OAuth Integration (Google, GitHub, LinkedIn)
- 👤 User Profile Management
- 🔄 Portfolio Sync (GitHub, StackOverflow)
- 🔔 Notification System
- 🎮 Gamification & Leaderboards
- 👥 Developer Discovery & Management

### Base URL

```
http://localhost:3001
```

### API Prefix

- User APIs: `/api/v1/user`
- Auth APIs: `/api/v1/auth`
- Portfolio Sync: `/api/v1/user/portfolio-sync`
- Notifications: `/api/v1/user/notifications`

---

## Service Architecture

### Directory Structure

```
user-service/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js      # Database connection
│   │   ├── passport.js      # OAuth strategies
│   │   └── api-urls.config.js
│   ├── controllers/         # Request handlers
│   │   ├── user.controller.js
│   │   ├── portfolio-sync.controller.js
│   │   └── notifications.controller.js
│   ├── models/              # Database models
│   │   ├── user.model.js
│   │   ├── portfolio-sync.model.js
│   │   └── notifications.model.js
│   ├── routes/              # API routes
│   │   ├── user.route.js
│   │   ├── auth.route.js
│   │   ├── portfolio-sync.route.js
│   │   └── notifications.route.js
│   ├── services/            # Business logic
│   │   └── portfolio-sync.service.js
│   └── server.js            # Express app setup
└── README.md
```

### Request Flow

```
Client Request
    ↓
API Gateway (Port 3000)
    ↓
User Service (Port 3001)
    ↓
Route Handler (routes/*.route.js)
    ↓
Authentication Middleware (if required)
    ↓
Controller (controllers/*.controller.js)
    ↓
Model/Service Layer (models/*.model.js or services/*.service.js)
    ↓
Database (PostgreSQL via Drizzle ORM)
    ↓
Response to Client
```

---

## Authentication & Authorization

### Authentication Flow

The service uses **JWT (JSON Web Tokens)** for authentication. Users receive a token upon successful login, which must be included in subsequent requests.

#### 1. User Registration Flow

**Endpoint:** `POST /api/v1/user/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "developer",
  "domains": "Web Development, Mobile Development",
  "experience": "3 Years",
  "availability": "full-time",
  "location": "New York, USA"
}
```

**Flow Steps:**

1. **Validation**: Check if all required fields are provided
   - Required for all: `name`, `email`, `role`, `password`
   - Required for developers: `domains`, `experience`, `availability`
   - Required for admins: `adminKey` (must match `ADMIN_REGISTRATION_KEY` env var)

2. **Duplicate Check**: Verify email doesn't already exist
   - Query: `SELECT * FROM users WHERE email = ?`
   - If exists → Return 409 Conflict

3. **Password Hashing**: Hash password using bcrypt
   - Algorithm: bcrypt with 10 salt rounds
   - Store hashed password in database

4. **Email Verification Token**: Generate crypto token
   - Token: 32-byte random hex string
   - Expires: 15 minutes from creation
   - Stored in `resetPasswordToken` field (reused for verification)

5. **User Creation**: Insert user into database
   - Default role: Based on `role` field
   - Default XP: 0
   - Default level: 1
   - Email verified: false

6. **Verification Email**: Send email with verification link
   - Email contains link: `/api/v1/user/verify-email?token={token}`
   - User must click link to verify email

7. **Response**: Return success with user data (excluding password)

**Response:**
```json
{
  "success": true,
  "status": 201,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "developer",
    "isEmailVerified": false
  }
}
```

#### 2. User Login Flow

**Endpoint:** `POST /api/v1/user/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Flow Steps:**

1. **Validation**: Check if email and password are provided

2. **User Lookup**: Find user by email
   - Query: `SELECT * FROM users WHERE email = ?`
   - If not found → Return 401 Unauthorized

3. **Password Verification**: Compare provided password with hashed password
   - Use bcrypt.compare()
   - If mismatch → Return 401 Unauthorized

4. **Check Deletion Status**: Verify user is not deleted
   - Check `isDeleted` field
   - If deleted → Return 401 Unauthorized

5. **Generate JWT Token**: Create access token
   - Payload: `{ userId, email, role, roles }`
   - Secret: `JWT_SECRET` from environment
   - Expires: 7 days (configurable via `JWT_EXPIRES_IN`)

6. **Update Last Login**: Record login timestamp
   - Update `updatedAt` field

7. **Response**: Return token and user data

**Response:**
```json
{
  "success": true,
  "status": 200,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "developer"
  }
}
```

#### 3. Token Usage

After login, include the token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The authentication middleware (`authenticate`) will:
1. Extract token from header
2. Verify token signature
3. Decode token payload
4. Attach user to `req.user`
5. If invalid/expired → Return 401 Unauthorized

---

## User Management APIs

### Profile Management

#### Get User Profile

**Endpoint:** `GET /api/v1/user/profile`

**Authentication:** Required (Bearer Token)

**Flow:**
1. Extract user ID from JWT token (`req.user.userId`)
2. Query database for user
3. Return user data (excluding password)

**Response:**
```json
{
  "success": true,
  "status": 200,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "developer",
    "bio": "Full-stack developer...",
    "location": "New York, USA",
    "xp": 1500,
    "level": 3
  }
}
```

#### Update User Profile

**Endpoint:** `PUT /api/v1/user/profile`

**Authentication:** Required

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "bio": "Updated bio",
  "location": "San Francisco, USA",
  "avatarUrl": "https://..."
}
```

**Flow:**
1. Authenticate user
2. Validate request body
3. Handle file upload (if avatar provided)
   - Upload to Cloudinary/Supabase
   - Get public URL
4. Update user in database
5. Return updated user data

#### Delete User Profile

**Endpoint:** `DELETE /api/v1/user/profile`

**Authentication:** Required

**Flow:**
1. Authenticate user
2. Soft delete: Set `isDeleted = true`
3. Return success message

### Developer Discovery

#### Get Developers List

**Endpoint:** `GET /api/v1/user/developers`

**Authentication:** Required

**Query Parameters:**
- `search`: Search by name, skills, location
- `experience`: Filter by experience level
- `location`: Filter by location
- `limit`: Number of results (default: 50)
- `page`: Page number (default: 1)

**Flow:**
1. Authenticate user
2. Build query with filters
3. Query database with pagination
4. Return developers list

**Response:**
```json
{
  "success": true,
  "status": 200,
  "developers": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "bio": "Full-stack developer...",
      "skills": {
        "React": "Expert",
        "Node.js": "Advanced"
      },
      "experience": "3 Years",
      "location": "New York, USA"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100
  }
}
```

### Developer Favorites

#### Add Developer to Favorites

**Endpoint:** `POST /api/v1/user/developers/favorites`

**Authentication:** Required

**Request Body:**
```json
{
  "developerId": 5
}
```

**Flow:**
1. Authenticate user (must be project-owner)
2. Validate developer exists
3. Check if already favorited
4. Insert into `developer_favorites` table
5. Return success

#### Get My Favorites

**Endpoint:** `GET /api/v1/user/developers/favorites/my`

**Authentication:** Required

**Flow:**
1. Authenticate user
2. Query `developer_favorites` table for user
3. Join with developers table
4. Return favorites list

### Developer Applications

#### Apply to Developer

**Endpoint:** `POST /api/v1/user/developers/apply`

**Authentication:** Required (Project Owner)

**Request Body:**
```json
{
  "developerId": 5,
  "message": "We'd like to work with you!"
}
```

**Flow:**
1. Authenticate user (must be project-owner)
2. Validate developer exists
3. Check if already applied
4. Insert into `developer_applications` table
5. Create notification for developer
6. Return success

#### Get My Applications

**Endpoint:** `GET /api/v1/user/developers/applications/my`

**Authentication:** Required

**Flow:**
1. Authenticate user
2. Query `developer_applications` table
3. Return applications with developer details

### Email Verification

#### Verify Email

**Endpoint:** `GET /api/v1/user/verify-email?token={token}`

**Authentication:** Not Required

**Flow:**
1. Extract token from query parameter
2. Find user with matching token
3. Check token expiration
4. Update `isEmailVerified = true`
5. Clear `resetPasswordToken`
6. Redirect to frontend success page

### Password Management

#### Change Password

**Endpoint:** `PUT /api/v1/user/change-password`

**Authentication:** Required

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Flow:**
1. Authenticate user
2. Verify current password
3. Hash new password
4. Update password in database
5. Return success

#### Forgot Password

**Endpoint:** `POST /api/v1/user/forgot-password`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Flow:**
1. Find user by email
2. Generate reset token (32-byte hex)
3. Set expiration (15 minutes)
4. Save token to database
5. Send reset email with link
6. Return success (don't reveal if email exists)

#### Reset Password

**Endpoint:** `PUT /api/v1/user/reset-password/:token`

**Request Body:**
```json
{
  "password": "newPassword123"
}
```

**Flow:**
1. Find user by reset token
2. Check token expiration
3. Hash new password
4. Update password
5. Clear reset token
6. Return success

### Gamification

#### Get Developer Stats

**Endpoint:** `GET /api/v1/user/developer/stats`

**Authentication:** Required (Developer)

**Flow:**
1. Authenticate user (must be developer)
2. Query user XP, level, badges
3. Calculate statistics
4. Return stats

**Response:**
```json
{
  "success": true,
  "stats": {
    "xp": 1500,
    "level": 3,
    "badges": ["First Project", "Code Master"],
    "projectsCompleted": 5,
    "reviewsReceived": 12
  }
}
```

#### Get Leaderboard

**Endpoint:** `GET /api/v1/user/leaderboard`

**Authentication:** Required

**Query Parameters:**
- `limit`: Number of results (default: 10)
- `type`: "xp" | "projects" | "reviews"

**Flow:**
1. Authenticate user
2. Query users ordered by selected metric
3. Return leaderboard

---

## Portfolio Sync APIs

Portfolio Sync allows developers to connect their GitHub and StackOverflow accounts to automatically sync their portfolio data.

### Sync Status

#### Get Sync Status

**Endpoint:** `GET /api/v1/user/portfolio-sync/status`

**Authentication:** Required

**Flow:**
1. Authenticate user
2. Query `integration_tokens` table for user
3. Query `portfolio_sync_data` table for last sync
4. Calculate overall sync status
5. Return status

**Response:**
```json
{
  "success": true,
  "data": {
    "overallScore": 85,
    "lastSync": "2024-01-15T10:30:00Z",
    "integrations": {
      "github": {
        "connected": true,
        "lastSync": "2024-01-15T10:30:00Z",
        "dataCount": 25
      },
      "stackoverflow": {
        "connected": true,
        "lastSync": "2024-01-15T09:00:00Z",
        "dataCount": 50
      }
    }
  }
}
```

### Integrations Management

#### Get Connected Integrations

**Endpoint:** `GET /api/v1/user/portfolio-sync/integrations`

**Authentication:** Required

**Flow:**
1. Authenticate user
2. Query `integration_tokens` table
3. Return list of connected platforms

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "platform": "github",
      "connected": true,
      "platformUsername": "johndoe",
      "lastSync": "2024-01-15T10:30:00Z"
    },
    {
      "platform": "stackoverflow",
      "connected": true,
      "platformUserId": "123456",
      "lastSync": "2024-01-15T09:00:00Z"
    }
  ]
}
```

#### Connect GitHub

**Endpoint:** `POST /api/v1/user/portfolio-sync/integrations/github/connect`

**Authentication:** Required

**Flow (OAuth):**
1. User clicks "Connect GitHub" button
2. Frontend redirects to: `GET /api/v1/user/portfolio-sync/oauth/github?token={jwt}`
3. Backend extracts token from query
4. Authenticates user
5. Stores user ID in session
6. Redirects to GitHub OAuth
7. GitHub redirects to: `/api/v1/auth/github/callback`
8. Callback handler checks session for `portfolioSyncUserId`
9. If present, uses `github-portfolio-sync` strategy
10. Strategy fetches GitHub profile and access token
11. Stores token in `integration_tokens` table
12. Redirects to frontend with success status

**Flow (Manual Token):**
1. User provides GitHub Personal Access Token
2. Backend validates token with GitHub API
3. Fetches GitHub username
4. Stores token in database
5. Returns success

#### Connect StackOverflow

**Endpoint:** `POST /api/v1/user/portfolio-sync/integrations/stackoverflow/connect`

**Authentication:** Required

**Request Body:**
```json
{
  "userId": "123456",
  "username": "johndoe",
  "accessToken": "optional_token"
}
```

**Flow:**
1. Authenticate user
2. Validate StackOverflow User ID
3. Access token is optional (public API works without it)
4. Store integration data in `integration_tokens` table
5. Return success

#### Disconnect Integration

**Endpoint:** `POST /api/v1/user/portfolio-sync/integrations/:platform/disconnect`

**Authentication:** Required

**Flow:**
1. Authenticate user
2. Find integration token for platform
3. Set `isActive = false` (soft delete)
4. Return success

### Sync Operations

#### Trigger Sync

**Endpoint:** `POST /api/v1/user/portfolio-sync/sync`

**Authentication:** Required

**Request Body:**
```json
{
  "platform": "github" // or "stackoverflow" or "all"
}
```

**Flow:**
1. Authenticate user
2. Check if platform is connected
3. Get access token from `integration_tokens` table
4. Call `PortfolioSyncService.fetchGitHubData()` or `fetchStackOverflowData()`
5. Process and store data in `portfolio_sync_data` table
6. Calculate skills and store in `skill_scores` table
7. Create sync history entry
8. Return success with sync results

**GitHub Sync Process:**
1. Fetch user repositories from GitHub API
2. For each repository:
   - Fetch languages used
   - Extract topics (tools/frameworks)
   - Get stars, forks, commits
3. Calculate skill scores based on:
   - Repository count (40% weight)
   - Stars received (30% weight)
   - Code bytes (30% weight)
4. Store repository data
5. Store skill scores

**StackOverflow Sync Process:**
1. Fetch user profile from StackOverflow API
2. Fetch user answers
3. Extract tags from answers
4. Calculate skill scores based on:
   - Answer count
   - Reputation
   - Accepted answers
5. Store answer data
6. Store skill scores

#### Get Sync History

**Endpoint:** `GET /api/v1/user/portfolio-sync/history`

**Authentication:** Required

**Query Parameters:**
- `limit`: Number of results (default: 10)

**Flow:**
1. Authenticate user
2. Query `sync_history` table
3. Order by `createdAt` DESC
4. Return history

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "platform": "github",
      "status": "success",
      "dataCount": 25,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Data Retrieval

#### Get Sync Data

**Endpoint:** `GET /api/v1/user/portfolio-sync/data`

**Authentication:** Required

**Query Parameters:**
- `platform`: "github" | "stackoverflow"
- `dataType`: "repository" | "answer" | "commit"

**Flow:**
1. Authenticate user
2. Query `portfolio_sync_data` table
3. Filter by platform and dataType
4. Return data

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "platform": "github",
      "dataType": "repository",
      "data": {
        "name": "my-project",
        "language": "JavaScript",
        "stars": 50,
        "forks": 10
      }
    }
  ]
}
```

#### Get Skill Scores

**Endpoint:** `GET /api/v1/user/portfolio-sync/skills`

**Authentication:** Required

**Query Parameters:**
- `platform`: "github" | "stackoverflow" | "overall"

**Flow:**
1. Authenticate user
2. Query `skill_scores` table
3. Filter by platform
4. Return skills with scores

**Response:**
```json
{
  "success": true,
  "data": {
    "skills": {
      "JavaScript": {
        "score": 95,
        "level": "Expert",
        "evidenceCount": 15,
        "type": "language"
      },
      "React": {
        "score": 88,
        "level": "Advanced",
        "evidenceCount": 10,
        "type": "tool"
      }
    }
  }
}
```

---

## Notifications APIs

### Get Notifications

**Endpoint:** `GET /api/v1/user/notifications`

**Authentication:** Required

**Query Parameters:**
- `limit`: Number of results (default: 20)
- `offset`: Pagination offset
- `unreadOnly`: true/false

**Flow:**
1. Authenticate user
2. Query `notifications` table
3. Filter by user ID
4. Optionally filter unread only
5. Return notifications

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "application",
      "title": "New Application",
      "message": "You have a new application",
      "read": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Get Unread Count

**Endpoint:** `GET /api/v1/user/notifications/unread-count`

**Authentication:** Required

**Flow:**
1. Authenticate user
2. Count unread notifications
3. Return count

**Response:**
```json
{
  "success": true,
  "count": 5
}
```

### Create Notification

**Endpoint:** `POST /api/v1/user/notifications`

**Authentication:** Required

**Request Body:**
```json
{
  "userId": 5,
  "type": "application",
  "title": "New Application",
  "message": "You have a new application"
}
```

**Flow:**
1. Authenticate user
2. Validate request body
3. Insert notification into database
4. Return success

### Mark as Read

**Endpoint:** `PUT /api/v1/user/notifications/:notificationId/read`

**Authentication:** Required

**Flow:**
1. Authenticate user
2. Find notification
3. Verify ownership
4. Update `read = true`
5. Return success

### Mark All as Read

**Endpoint:** `PUT /api/v1/user/notifications/read-all`

**Authentication:** Required

**Flow:**
1. Authenticate user
2. Update all user's notifications to `read = true`
3. Return success

### Delete Notification

**Endpoint:** `DELETE /api/v1/user/notifications/:notificationId`

**Authentication:** Required

**Flow:**
1. Authenticate user
2. Find notification
3. Verify ownership
4. Delete notification
5. Return success

---

## OAuth Integration Flows

### Google OAuth

**Initiation:** `GET /api/v1/auth/google`

**Flow:**
1. Store redirect URL in session (if provided)
2. Redirect to Google OAuth consent screen
3. User authorizes
4. Google redirects to: `/api/v1/auth/google/callback?code={code}`
5. Passport exchanges code for access token
6. Fetches user profile from Google
7. Creates/updates user in database
8. Creates session
9. Redirects to frontend dashboard

### GitHub OAuth

**Initiation:** `GET /api/v1/auth/github`

**Flow:**
1. Store redirect URL in session
2. Redirect to GitHub OAuth
3. User authorizes
4. GitHub redirects to: `/api/v1/auth/github/callback?code={code}`
5. **Unified Callback Handler:**
   - Checks if `req.session.portfolioSyncUserId` exists
   - If yes → Portfolio Sync flow (stores token, no session)
   - If no → Regular auth flow (creates session, logs in)
6. Redirects to appropriate frontend page

### LinkedIn OAuth

**Initiation:** `GET /api/v1/auth/linkedin`

**Flow:**
1. Store redirect URL in session
2. Redirect to LinkedIn OAuth
3. User authorizes
4. LinkedIn redirects to: `/api/v1/auth/linkedin/callback?code={code}`
5. Passport exchanges code for access token
6. Fetches user profile from LinkedIn
7. Creates/updates user in database
8. Creates session
9. Redirects to frontend dashboard

---

## Database Models

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  role VARCHAR(50),
  bio TEXT,
  avatarUrl TEXT,
  domainPreferences TEXT,
  skills JSONB,
  experience VARCHAR(100),
  location VARCHAR(255),
  availability VARCHAR(50),
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  isEmailVerified BOOLEAN DEFAULT false,
  isDeleted BOOLEAN DEFAULT false,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Integration Tokens Table

```sql
CREATE TABLE integration_tokens (
  id SERIAL PRIMARY KEY,
  userId INTEGER REFERENCES users(id),
  platform VARCHAR(50),
  platformUserId VARCHAR(255),
  platformUsername VARCHAR(255),
  accessToken TEXT,
  refreshToken TEXT,
  tokenType VARCHAR(50) DEFAULT 'Bearer',
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Portfolio Sync Data Table

```sql
CREATE TABLE portfolio_sync_data (
  id SERIAL PRIMARY KEY,
  userId INTEGER REFERENCES users(id),
  platform VARCHAR(50),
  dataType VARCHAR(50),
  data JSONB,
  createdAt TIMESTAMP
);
```

### Skill Scores Table

```sql
CREATE TABLE skill_scores (
  id SERIAL PRIMARY KEY,
  userId INTEGER REFERENCES users(id),
  platform VARCHAR(50),
  skillName VARCHAR(255),
  score INTEGER,
  level VARCHAR(50),
  evidenceCount INTEGER,
  type VARCHAR(50),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Notifications Table

```sql
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  userId INTEGER REFERENCES users(id),
  type VARCHAR(50),
  title VARCHAR(255),
  message TEXT,
  read BOOLEAN DEFAULT false,
  createdAt TIMESTAMP
);
```

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "status": 400,
  "message": "Error message",
  "error": "Detailed error information"
}
```

### Common HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (duplicate resource)
- **500**: Internal Server Error

### Error Middleware

All errors are caught by the error middleware (`shared/middleware/error.middleware`), which:
1. Logs the error
2. Formats error response
3. Sends appropriate HTTP status code
4. Returns JSON error response

---

## Environment Variables

Required environment variables for the user service:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/skillbridge

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# OAuth - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OAuth - GitHub
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# OAuth - LinkedIn
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Frontend
FRONTEND_URL=http://localhost:5173
CLIENT_URL=http://localhost:5173

# Cloudinary (for file uploads)
CLOUDINARY_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Session
SESSION_SECRET=your-session-secret

# Admin
ADMIN_REGISTRATION_KEY=your-admin-key
```

---

## Testing

### Manual Testing

Use tools like Postman or curl to test endpoints:

```bash
# Register User
curl -X POST http://localhost:3001/api/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"developer"}'

# Login
curl -X POST http://localhost:3001/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get Profile (with token)
curl -X GET http://localhost:3001/api/v1/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Support

For issues or questions, please contact the development team or create an issue in the repository.

---

**Last Updated:** January 2024
**Version:** 1.0.0

