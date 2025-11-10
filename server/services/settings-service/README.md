# Settings Service - API Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Service Architecture](#service-architecture)
3. [Authentication](#authentication)
4. [Notification Settings APIs](#notification-settings-apis)
5. [Notification Frequency APIs](#notification-frequency-apis)
6. [Quiet Hours APIs](#quiet-hours-apis)
7. [Privacy Settings APIs](#privacy-settings-apis)
8. [Integrations APIs](#integrations-apis)
9. [Subscription APIs](#subscription-apis)
10. [Database Models](#database-models)
11. [Error Handling](#error-handling)

---

## Overview

The **Settings Service** is a microservice responsible for managing user preferences and settings across the SkillBridge Pro platform. It handles notification preferences, privacy controls, integration settings, quiet hours, and subscription management.

### Key Features

- 🔔 Notification Settings Management
- ⏰ Quiet Hours Configuration
- 🔒 Privacy Settings Control
- 🔗 Third-Party Integrations
- 💳 Subscription Management
- 📊 Notification Frequency Control

### Base URL

```
http://localhost:3003
```

### API Prefix

- Settings APIs: `/api/v1/settings`

**Note:** All endpoints require authentication via JWT Bearer token.

---

## Service Architecture

### Directory Structure

```
settings-service/
├── src/
│   ├── config/              # Configuration files
│   │   └── database.js      # Database connection
│   ├── controllers/         # Request handlers
│   │   └── settings.controller.js
│   ├── models/              # Database models
│   │   ├── user-notification-settings.model.js
│   │   ├── user-notification-frequency.model.js
│   │   ├── user-quiet-hours.model.js
│   │   ├── user-privacy-settings.model.js
│   │   ├── user-integrations.model.js
│   │   ├── user-subscriptions.model.js
│   │   └── index.js
│   ├── routes/              # API routes
│   │   └── settings.routes.js
│   └── server.js            # Express app setup
└── README.md
```

### Request Flow

```
Client Request
    ↓
API Gateway (Port 3000)
    ↓
Settings Service (Port 3003)
    ↓
Authentication Middleware (JWT Verification)
    ↓
Route Handler (routes/settings.routes.js)
    ↓
Controller (controllers/settings.controller.js)
    ↓
Model Layer (models/*.model.js)
    ↓
Database (PostgreSQL via Drizzle ORM)
    ↓
Response to Client
```

---

## Authentication

All endpoints in the Settings Service require authentication. The service uses JWT (JSON Web Tokens) for authentication.

### Authentication Flow

1. **Token Extraction**: The authentication middleware extracts the JWT token from the `Authorization` header:
   ```
   Authorization: Bearer <token>
   ```

2. **User ID Resolution**: The controller resolves the user ID from:
   - `req.user.userId` (from JWT token)
   - `req.user.id` (fallback)
   - `req.headers["x-user-id"]` (backward compatibility)
   - `req.query.userId` (backward compatibility)

3. **Validation**: If no user ID is found, the request is rejected with a 400 Bad Request error.

### Authentication Middleware

The service uses `shared/middleware/auth.middleware` which:
- Verifies JWT token signature
- Decodes token payload
- Attaches user information to `req.user`
- Returns 401 Unauthorized if token is invalid/expired

---

## Notification Settings APIs

Notification Settings control which types of notifications a user receives. These are boolean toggles for different notification channels and types.

### Get Notification Settings

**Endpoint:** `GET /api/v1/settings/notifications`

**Authentication:** Required (Bearer Token)

**Flow:**
1. Authenticate user and extract user ID
2. Query `user_notification_settings` table for user
3. Return settings or `null` if not found

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 123,
    "email": true,
    "sms": false,
    "push": true,
    "reminders": true,
    "projectUpdates": true,
    "xpNotifications": true,
    "aiSuggestions": true,
    "profileReminders": false,
    "securityAlerts": true,
    "soundEnabled": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Response (No Settings Found):**
```json
{
  "success": true,
  "data": null
}
```

### Update Notification Settings

**Endpoint:** `PUT /api/v1/settings/notifications`

**Authentication:** Required

**Request Body:**
```json
{
  "email": true,
  "sms": false,
  "push": true,
  "reminders": true,
  "projectUpdates": true,
  "xpNotifications": false,
  "aiSuggestions": true,
  "profileReminders": false,
  "securityAlerts": true,
  "soundEnabled": false
}
```

**Flow:**
1. Authenticate user and extract user ID
2. Validate request body (all fields are optional)
3. Check if settings exist for user
4. **If exists**: Update existing record with new values
5. **If not exists**: Create new record with provided values
6. Update `updatedAt` timestamp
7. Return updated/created settings

**Upsert Logic:**
- The service uses an "upsert" pattern (update or insert)
- If a record exists for the user, it updates the existing record
- If no record exists, it creates a new one
- Only provided fields are updated; omitted fields keep their current/default values

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 123,
    "email": true,
    "sms": false,
    "push": true,
    "reminders": true,
    "projectUpdates": true,
    "xpNotifications": false,
    "aiSuggestions": true,
    "profileReminders": false,
    "securityAlerts": true,
    "soundEnabled": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

**Available Settings:**
- `email`: Enable/disable email notifications (default: `true`)
- `sms`: Enable/disable SMS notifications (default: `false`)
- `push`: Enable/disable push notifications (default: `true`)
- `reminders`: Enable/disable reminder notifications (default: `true`)
- `projectUpdates`: Enable/disable project update notifications (default: `true`)
- `xpNotifications`: Enable/disable XP/gamification notifications (default: `true`)
- `aiSuggestions`: Enable/disable AI suggestion notifications (default: `true`)
- `profileReminders`: Enable/disable profile completion reminders (default: `false`)
- `securityAlerts`: Enable/disable security alert notifications (default: `true`)
- `soundEnabled`: Enable/disable notification sounds (default: `true`)

---

## Notification Frequency APIs

Notification Frequency controls how often notifications are delivered to users. This is separate from the notification settings toggles and allows users to control the delivery cadence.

### Get Notification Frequency

**Endpoint:** `GET /api/v1/settings/notifications/frequency`

**Authentication:** Required

**Flow:**
1. Authenticate user and extract user ID
2. Query `user_notification_frequency` table for user
3. Return frequency settings or `null` if not found

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 123,
    "email": "daily",
    "push": "immediate",
    "reminders": "weekly",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Response (No Settings Found):**
```json
{
  "success": true,
  "data": null
}
```

### Update Notification Frequency

**Endpoint:** `PUT /api/v1/settings/notifications/frequency`

**Authentication:** Required

**Request Body:**
```json
{
  "email": "weekly",
  "push": "immediate",
  "reminders": "daily"
}
```

**Flow:**
1. Authenticate user and extract user ID
2. Validate request body (all fields are optional)
3. Check if frequency settings exist for user
4. **If exists**: Update existing record
5. **If not exists**: Create new record with provided values
6. Update `updatedAt` timestamp
7. Return updated/created frequency settings

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 123,
    "email": "weekly",
    "push": "immediate",
    "reminders": "daily",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

**Available Frequency Options:**
- `email`: 
  - `"immediate"`: Send emails immediately
  - `"hourly"`: Batch emails hourly
  - `"daily"`: Send daily digest (default)
  - `"weekly"`: Send weekly digest
- `push`:
  - `"immediate"`: Send push notifications immediately (default)
  - `"hourly"`: Batch push notifications hourly
  - `"daily"`: Send daily push notification digest
- `reminders`:
  - `"immediate"`: Send reminders immediately
  - `"daily"`: Send daily reminders
  - `"weekly"`: Send weekly reminders (default)

---

## Quiet Hours APIs

Quiet Hours allow users to define time periods during which they don't want to receive notifications. This helps users maintain work-life balance and avoid interruptions during specific hours.

### Get Quiet Hours

**Endpoint:** `GET /api/v1/settings/quiet-hours`

**Authentication:** Required

**Flow:**
1. Authenticate user and extract user ID
2. Query `user_quiet_hours` table for user
3. Return quiet hours settings or `null` if not found

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 123,
    "enabled": true,
    "start": "22:00:00",
    "end": "08:00:00",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Response (No Settings Found):**
```json
{
  "success": true,
  "data": null
}
```

### Update Quiet Hours

**Endpoint:** `PUT /api/v1/settings/quiet-hours`

**Authentication:** Required

**Request Body:**
```json
{
  "enabled": true,
  "start": "22:00:00",
  "end": "08:00:00"
}
```

**Flow:**
1. Authenticate user and extract user ID
2. Validate request body:
   - `enabled`: Boolean (required if provided)
   - `start`: Time string in format `HH:MM:SS` (optional)
   - `end`: Time string in format `HH:MM:SS` (optional)
3. Check if quiet hours exist for user
4. **If exists**: Update existing record
5. **If not exists**: Create new record with provided values
6. Update `updatedAt` timestamp
7. Return updated/created quiet hours

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 123,
    "enabled": true,
    "start": "22:00:00",
    "end": "08:00:00",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

**Quiet Hours Behavior:**
- When `enabled` is `true`, notifications are suppressed during the specified time range
- `start` and `end` times are in 24-hour format (`HH:MM:SS`)
- If `start` time is after `end` time, it's treated as spanning midnight (e.g., 22:00 to 08:00 means 10 PM to 8 AM)
- When `enabled` is `false`, quiet hours are disabled regardless of start/end times
- Default: `enabled = false`

**Example Use Cases:**
- **Night Mode**: `start: "22:00:00"`, `end: "08:00:00"` (10 PM to 8 AM)
- **Lunch Break**: `start: "12:00:00"`, `end: "13:00:00"` (12 PM to 1 PM)
- **Weekend**: Can be combined with other logic to disable notifications on weekends

---

## Privacy Settings APIs

Privacy Settings allow users to control their data visibility and sharing preferences across the platform.

### Get Privacy Settings

**Endpoint:** `GET /api/v1/settings/privacy`

**Authentication:** Required

**Flow:**
1. Authenticate user and extract user ID
2. Query `user_privacy_settings` table for user
3. Return privacy settings or `null` if not found

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 123,
    "profilePublic": true,
    "dataSharing": false,
    "searchVisibility": true,
    "personalizedAds": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Response (No Settings Found):**
```json
{
  "success": true,
  "data": null
}
```

### Update Privacy Settings

**Endpoint:** `PUT /api/v1/settings/privacy`

**Authentication:** Required

**Request Body:**
```json
{
  "profilePublic": false,
  "dataSharing": true,
  "searchVisibility": true,
  "personalizedAds": false
}
```

**Flow:**
1. Authenticate user and extract user ID
2. Validate request body (all fields are optional)
3. Check if privacy settings exist for user
4. **If exists**: Update existing record
5. **If not exists**: Create new record with provided values
6. Update `updatedAt` timestamp
7. Return updated/created privacy settings

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 123,
    "profilePublic": false,
    "dataSharing": true,
    "searchVisibility": true,
    "personalizedAds": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

**Available Privacy Settings:**
- `profilePublic`: Make profile visible to other users (default: `true`)
  - `true`: Profile is visible to all authenticated users
  - `false`: Profile is private, only visible to the user
- `dataSharing`: Allow data sharing with third parties (default: `false`)
  - `true`: Allow sharing anonymized data with partners
  - `false`: Do not share data with third parties
- `searchVisibility`: Allow profile to appear in search results (default: `true`)
  - `true`: Profile appears in search results
  - `false`: Profile is hidden from search
- `personalizedAds`: Enable personalized advertising (default: `false`)
  - `true`: Show personalized ads based on profile data
  - `false`: Show generic ads only

---

## Integrations APIs

Integrations Settings manage connections to third-party services and platforms. The service automatically tracks connection timestamps when integrations are enabled or disabled.

### Get Integrations

**Endpoint:** `GET /api/v1/settings/integrations`

**Authentication:** Required

**Flow:**
1. Authenticate user and extract user ID
2. Query `user_integrations` table for user
3. Return integration settings or `null` if not found

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 123,
    "github": true,
    "linkedin": false,
    "googleCalendar": true,
    "slack": false,
    "discord": false,
    "trello": false,
    "asana": false,
    "githubConnectedAt": "2024-01-15T10:30:00Z",
    "linkedinConnectedAt": null,
    "googleCalendarConnectedAt": "2024-01-10T09:00:00Z",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Response (No Settings Found):**
```json
{
  "success": true,
  "data": null
}
```

### Update Integrations

**Endpoint:** `PUT /api/v1/settings/integrations`

**Authentication:** Required

**Request Body:**
```json
{
  "github": true,
  "linkedin": true,
  "googleCalendar": false,
  "slack": true
}
```

**Flow:**
1. Authenticate user and extract user ID
2. Validate request body (all fields are optional)
3. **Auto-timestamp Logic**:
   - Fetch existing integration settings
   - Compare new values with existing values
   - For each integration field (`github`, `linkedin`, `googleCalendar`, `slack`, `discord`, `trello`, `asana`):
     - If value changes from `false` to `true`: Set `{integration}ConnectedAt` to current timestamp
     - If value changes from `true` to `false`: Set `{integration}ConnectedAt` to `null`
     - If value doesn't change: Keep existing timestamp
4. Check if integration settings exist for user
5. **If exists**: Update existing record with computed values
6. **If not exists**: Create new record with provided values
7. Update `updatedAt` timestamp
8. Return updated/created integration settings

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 123,
    "github": true,
    "linkedin": true,
    "googleCalendar": false,
    "slack": true,
    "discord": false,
    "trello": false,
    "asana": false,
    "githubConnectedAt": "2024-01-15T10:30:00Z",
    "linkedinConnectedAt": "2024-01-15T11:00:00Z",
    "googleCalendarConnectedAt": null,
    "slackConnectedAt": "2024-01-15T11:00:00Z",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

**Available Integrations:**
- `github`: GitHub integration (default: `false`)
- `linkedin`: LinkedIn integration (default: `false`)
- `googleCalendar`: Google Calendar integration (default: `true`)
- `slack`: Slack integration (default: `false`)
- `discord`: Discord integration (default: `false`)
- `trello`: Trello integration (default: `false`)
- `asana`: Asana integration (default: `false`)

**Auto-Timestamp Behavior:**
- When an integration is enabled (`false` → `true`), the `{integration}ConnectedAt` field is automatically set to the current timestamp
- When an integration is disabled (`true` → `false`), the `{integration}ConnectedAt` field is set to `null`
- This allows tracking when each integration was last connected without manual timestamp management

**Example Scenario:**
1. User initially has no integrations
2. User enables GitHub: `github: true` → `githubConnectedAt` is set to current time
3. User later disables GitHub: `github: false` → `githubConnectedAt` is set to `null`
4. User re-enables GitHub: `github: true` → `githubConnectedAt` is set to new current time

---

## Subscription APIs

Subscription Settings manage user subscription plans and status. This is separate from payment processing and focuses on the subscription state visible in user settings.

### Get Subscription

**Endpoint:** `GET /api/v1/settings/subscription`

**Authentication:** Required

**Flow:**
1. Authenticate user and extract user ID
2. Query `user_subscriptions` table for user
3. Return subscription settings or `null` if not found

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 123,
    "plan": "Pro",
    "status": "active",
    "currentPeriodStart": "2024-01-01T00:00:00Z",
    "currentPeriodEnd": "2024-02-01T00:00:00Z",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Response (No Settings Found):**
```json
{
  "success": true,
  "data": null
}
```

### Update Subscription

**Endpoint:** `PUT /api/v1/settings/subscription`

**Authentication:** Required

**Request Body:**
```json
{
  "plan": "Enterprise",
  "status": "active",
  "currentPeriodStart": "2024-01-15T00:00:00Z",
  "currentPeriodEnd": "2024-02-15T00:00:00Z"
}
```

**Flow:**
1. Authenticate user and extract user ID
2. Validate request body (all fields are optional)
3. Check if subscription exists for user
4. **If exists**: Update existing record
5. **If not exists**: Create new record with provided values
6. Update `updatedAt` timestamp
7. Return updated/created subscription

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 123,
    "plan": "Enterprise",
    "status": "active",
    "currentPeriodStart": "2024-01-15T00:00:00Z",
    "currentPeriodEnd": "2024-02-15T00:00:00Z",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

**Subscription Fields:**
- `plan`: Subscription plan name (default: `"Free"`)
  - Common values: `"Free"`, `"Basic"`, `"Pro"`, `"Enterprise"`
  - Can be any string value
- `status`: Subscription status (default: `"active"`)
  - Common values: `"active"`, `"cancelled"`, `"expired"`, `"trial"`
  - Can be any string value
- `currentPeriodStart`: Start date of current billing period (ISO 8601 timestamp)
- `currentPeriodEnd`: End date of current billing period (ISO 8601 timestamp)

**Note:** This endpoint manages subscription metadata visible in settings. Actual payment processing and subscription management should be handled by a dedicated payment/subscription service that updates these settings via this API.

---

## Database Models

### User Notification Settings Table

```sql
CREATE TABLE user_notification_settings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  email BOOLEAN NOT NULL DEFAULT true,
  sms BOOLEAN NOT NULL DEFAULT false,
  push BOOLEAN NOT NULL DEFAULT true,
  reminders BOOLEAN NOT NULL DEFAULT true,
  project_updates BOOLEAN NOT NULL DEFAULT true,
  xp_notifications BOOLEAN NOT NULL DEFAULT true,
  ai_suggestions BOOLEAN NOT NULL DEFAULT true,
  profile_reminders BOOLEAN NOT NULL DEFAULT false,
  security_alerts BOOLEAN NOT NULL DEFAULT true,
  sound_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### User Notification Frequency Table

```sql
CREATE TABLE user_notification_frequency (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  email_frequency TEXT NOT NULL DEFAULT 'daily',
  push_frequency TEXT NOT NULL DEFAULT 'immediate',
  reminders_frequency TEXT NOT NULL DEFAULT 'weekly',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### User Quiet Hours Table

```sql
CREATE TABLE user_quiet_hours (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT false,
  start TIME,
  end TIME,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### User Privacy Settings Table

```sql
CREATE TABLE user_privacy_settings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  profile_public BOOLEAN NOT NULL DEFAULT true,
  data_sharing BOOLEAN NOT NULL DEFAULT false,
  search_visibility BOOLEAN NOT NULL DEFAULT true,
  personalized_ads BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### User Integrations Table

```sql
CREATE TABLE user_integrations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  github BOOLEAN NOT NULL DEFAULT false,
  linkedin BOOLEAN NOT NULL DEFAULT false,
  google_calendar BOOLEAN NOT NULL DEFAULT true,
  slack BOOLEAN NOT NULL DEFAULT false,
  discord BOOLEAN NOT NULL DEFAULT false,
  trello BOOLEAN NOT NULL DEFAULT false,
  asana BOOLEAN NOT NULL DEFAULT false,
  github_connected_at TIMESTAMP,
  linkedin_connected_at TIMESTAMP,
  google_calendar_connected_at TIMESTAMP,
  slack_connected_at TIMESTAMP,
  discord_connected_at TIMESTAMP,
  trello_connected_at TIMESTAMP,
  asana_connected_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### User Subscriptions Table

```sql
CREATE TABLE user_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  plan TEXT NOT NULL DEFAULT 'Free',
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
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
- **400**: Bad Request (validation errors, missing user ID)
- **401**: Unauthorized (authentication required)
- **404**: Not Found
- **500**: Internal Server Error

### Error Scenarios

1. **Missing User ID**:
   - Status: 400
   - Message: "userId is required"
   - Occurs when: JWT token doesn't contain user ID and no fallback is available

2. **Invalid Authentication**:
   - Status: 401
   - Message: "Unauthorized"
   - Occurs when: JWT token is missing, invalid, or expired

3. **Database Error**:
   - Status: 500
   - Message: "Internal Server Error"
   - Occurs when: Database query fails or connection error

### Error Middleware

All errors are caught by the error middleware (`shared/middleware/error.middleware`), which:
1. Logs the error
2. Formats error response
3. Sends appropriate HTTP status code
4. Returns JSON error response

---

## Upsert Pattern

All update endpoints in the Settings Service use an **upsert pattern** (update or insert). This means:

1. **If a record exists** for the user: The existing record is updated with new values
2. **If no record exists**: A new record is created with the provided values

### Benefits

- **Idempotent**: Same request can be made multiple times safely
- **User-Friendly**: Users don't need to check if settings exist before updating
- **Simplified Frontend**: Frontend can always use PUT without checking existence first

### Implementation

Each model implements `upsertByUserId(userId, data)`:
1. Query database for existing record
2. If found: Update with new data
3. If not found: Insert new record with data
4. Return the updated/created record

---

## Environment Variables

Required environment variables for the settings service:

```env
# Server
PORT=3003
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/skillbridge

# Session
SESSION_SECRET=your-session-secret
```

---

## Testing

### Manual Testing

Use tools like Postman or curl to test endpoints:

```bash
# Get Notification Settings
curl -X GET http://localhost:3003/api/v1/settings/notifications \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Update Notification Settings
curl -X PUT http://localhost:3003/api/v1/settings/notifications \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"email": true, "push": false}'

# Get Privacy Settings
curl -X GET http://localhost:3003/api/v1/settings/privacy \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Update Privacy Settings
curl -X PUT http://localhost:3003/api/v1/settings/privacy \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"profilePublic": false, "dataSharing": true}'

# Get Integrations
curl -X GET http://localhost:3003/api/v1/settings/integrations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Update Integrations
curl -X PUT http://localhost:3003/api/v1/settings/integrations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"github": true, "linkedin": true}'
```

---

## Best Practices

### 1. Partial Updates

All update endpoints support partial updates. You can send only the fields you want to change:

```json
{
  "email": false
}
```

This will only update the `email` field, leaving all other fields unchanged.

### 2. Default Values

If a user hasn't configured settings, the service returns `null`. The frontend should handle this by using default values or prompting the user to configure settings.

### 3. Timestamp Management

- `createdAt` is set automatically on record creation
- `updatedAt` is updated automatically on every update
- Integration connection timestamps are managed automatically when integrations are enabled/disabled

### 4. User ID Resolution

The service supports multiple ways to resolve user ID for backward compatibility:
1. JWT token (`req.user.userId` or `req.user.id`) - **Primary method**
2. Header (`x-user-id`) - **Legacy support**
3. Query parameter (`userId`) - **Legacy support**

**Recommendation**: Always use JWT token authentication. Legacy methods are for backward compatibility only.

---

## Integration with Other Services

### User Service

The Settings Service relies on the User Service for:
- User authentication (JWT token validation)
- User existence verification (implicit, via authentication)

### Notification Service

The Settings Service provides settings that the Notification Service should respect:
- Notification toggles (email, SMS, push)
- Notification frequency
- Quiet hours

**Note**: The Settings Service only stores preferences. The actual notification delivery logic should be implemented in the Notification Service.

---

## Support

For issues or questions, please contact the development team or create an issue in the repository.

---

**Last Updated:** January 2024
**Version:** 1.0.0

