# Environment Variables Documentation

This document lists all environment variables used in the User Service, including the new Portfolio Sync API URLs.

## Portfolio Sync API URLs

These URLs are used for portfolio synchronization with external platforms:

```env
# GitHub API Configuration
GITHUB_API_BASE_URL=https://api.github.com
GITHUB_WEB_BASE_URL=https://github.com

# StackOverflow API Configuration
STACKOVERFLOW_API_BASE_URL=https://api.stackexchange.com/2.3
STACKOVERFLOW_SITE=stackoverflow
```

### Usage in Code

All URLs are loaded from `src/config/api-urls.config.js` with fallback defaults:

```javascript
const API_URLS = require("../config/api-urls.config");

// Example usage:
const reposResponse = await axios.get(`${API_URLS.GITHUB_API_BASE_URL}/user/repos`);
```

## Complete Environment Variables List

### Database Configuration
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=skillbridge_db
DB_SSL=false
DB_POOL_MAX=20
DB_POOL_IDLE_TIMEOUT=30000
DB_POOL_CONNECTION_TIMEOUT=20000
DB_LOGGING=true
```

### Server Configuration
```env
PORT=3001
NODE_ENV=development
SESSION_SECRET=your_session_secret_key_here
```

### External API URLs (Portfolio Sync)
```env
# GitHub API Configuration
GITHUB_API_BASE_URL=https://api.github.com
GITHUB_WEB_BASE_URL=https://github.com

# StackOverflow API Configuration
STACKOVERFLOW_API_BASE_URL=https://api.stackexchange.com/2.3
STACKOVERFLOW_SITE=stackoverflow
```

### API Gateway Configuration (OAuth Callbacks)
```env
# API Gateway Base URL (used for OAuth callbacks)
# If set, OAuth callbacks will use: ${API_GATEWAY_BASE_URL}/api/v1/auth/{provider}/callback
API_GATEWAY_BASE_URL=http://localhost:3000
```

### OAuth Configuration
```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
# Optional: Override default callback URL (defaults to ${API_GATEWAY_BASE_URL}/api/v1/auth/google/callback)
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
# Optional: Override default callback URL (defaults to ${API_GATEWAY_BASE_URL}/api/v1/auth/github/callback)
GITHUB_CALLBACK_URL=http://localhost:3000/api/v1/auth/github/callback

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
# Optional: Override default callback URL (defaults to ${API_GATEWAY_BASE_URL}/api/v1/auth/linkedin/callback)
LINKEDIN_CALLBACK_URL=http://localhost:3000/api/v1/auth/linkedin/callback
```

### Client/Frontend URL
```env
CLIENT_URL=http://localhost:5173
```

### Email Configuration
```env
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

### Cloudinary Configuration
```env
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
```

### JWT Configuration
```env
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
```

## Setup Instructions

1. Copy the environment variables you need to your `.env` file
2. Replace placeholder values with your actual credentials
3. All Portfolio Sync URLs have default values, so they're optional unless you need custom endpoints

## Notes

- All Portfolio Sync API URLs are **optional** - they have sensible defaults
- If you don't set these variables, the service will use the default production URLs
- Useful for testing with mock APIs or custom endpoints

