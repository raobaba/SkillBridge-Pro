# Project Service - API Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Service Architecture](#service-architecture)
3. [Authentication & Authorization](#authentication--authorization)
4. [Project CRUD APIs](#project-crud-apis)
5. [Application Management APIs](#application-management-apis)
6. [Invitation Management APIs](#invitation-management-apis)
7. [Project Interaction APIs](#project-interaction-apis)
8. [File Management APIs](#file-management-apis)
9. [Project Analytics APIs](#project-analytics-apis)
10. [Search & Discovery APIs](#search--discovery-apis)
11. [AI Suggestion APIs](#ai-suggestion-apis)
12. [Project Owner Dashboard APIs](#project-owner-dashboard-apis)
13. [Database Models](#database-models)
14. [Error Handling](#error-handling)

---

## Overview

The **Project Service** is a microservice responsible for managing projects, applications, invitations, and all project-related interactions in the SkillBridge Pro platform. It serves as the central hub for project owners to post projects and developers to discover and apply to them.

### Key Features

- 📋 Project CRUD Operations
- 🎯 Application Management (Apply, Withdraw, Status Updates)
- 📧 Invitation System (Send, Accept, Decline)
- 📁 File Management
- ⭐ Reviews & Ratings
- 🚀 Project Boosting
- 💬 Comments & Discussions
- 🔍 Advanced Search & Filtering
- 🤖 AI-Powered Project Suggestions
- 📊 Analytics & Reporting
- 👤 Project Owner Dashboard

### Base URL

```
http://localhost:3002
```

### API Prefixes

- Project APIs: `/api/v1/projects`
- AI APIs: `/api/v1/ai`

---

## Service Architecture

### Directory Structure

```
project-service/
├── src/
│   ├── config/              # Configuration files
│   │   └── database.js       # Database connection
│   ├── controllers/          # Request handlers
│   │   ├── projects.controller.js
│   │   └── ai.controller.js
│   ├── models/              # Database models
│   │   ├── projects.model.js
│   │   ├── project-applicants.model.js
│   │   ├── project-invites.model.js
│   │   ├── project-files.model.js
│   │   ├── project-reviews.model.js
│   │   ├── project-comments.model.js
│   │   └── ... (many more)
│   ├── routes/              # API routes
│   │   ├── projects.routes.js
│   │   └── ai.routes.js
│   ├── services/            # Business logic
│   │   └── projects.service.js
│   ├── utils/               # Utility functions
│   │   ├── aiService.js
│   │   └── chatServiceClient.js
│   └── server.js            # Express app setup
└── README.md
```

### Request Flow

```
Client Request
    ↓
API Gateway (Port 3000)
    ↓
Project Service (Port 3002)
    ↓
Route Handler (routes/*.routes.js)
    ↓
Authentication Middleware (if required)
    ↓
Role Authorization Middleware (if required)
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

### Authentication

Most endpoints require JWT authentication via the `Authorization` header:
```
Authorization: Bearer <token>
```

### Role-Based Authorization

The service uses role-based access control with the following roles:

- **Project Owner** (`project-owner`): Can create and manage projects
- **Developer** (`developer`): Can apply to projects and respond to invitations
- **Project Manager**: Can manage projects (subset of project owner permissions)

### Authorization Middleware

- `authenticate`: Verifies JWT token and attaches user to `req.user`
- `requireProjectOwner`: Ensures user has project-owner role
- `requireDeveloper`: Ensures user has developer role
- `requireProjectManager`: Ensures user can manage projects (owner or manager)

---

## Project CRUD APIs

### Create Project

**Endpoint:** `POST /api/v1/projects`

**Authentication:** Required (Project Owner)

**Request Body:**
```json
{
  "title": "E-commerce Website Development",
  "description": "We need a full-stack developer to build an e-commerce platform...",
  "roleNeeded": "Full-Stack Developer",
  "category": "Web Development",
  "subcategory": "E-commerce",
  "experienceLevel": "mid",
  "budgetMin": 5000,
  "budgetMax": 10000,
  "currency": "USD",
  "isRemote": true,
  "location": "Remote",
  "duration": "3 months",
  "startDate": "2024-02-01T00:00:00Z",
  "deadline": "2024-05-01T00:00:00Z",
  "requirements": "React, Node.js, PostgreSQL experience required",
  "benefits": "Flexible hours, competitive pay, learning opportunities",
  "skills": ["React", "Node.js", "PostgreSQL", "TypeScript"],
  "tags": ["e-commerce", "full-stack", "remote"]
}
```

**Flow:**
1. Authenticate user (must be project-owner)
2. Validate required fields: `title`, `description`, `roleNeeded`
3. Extract user ID from JWT token (`req.user.userId`)
4. Create project record in `projects` table
5. Associate skills with project (create entries in `project_skills` table)
6. Associate tags with project (create entries in `project_tags` table)
7. Set default values:
   - `status`: "draft"
   - `priority`: "medium"
   - `currency`: "USD"
   - `isRemote`: true
   - `visibility`: "public"
8. Return created project with all associations

**Response:**
```json
{
  "success": true,
  "status": 201,
  "message": "Project created successfully",
  "data": {
    "id": 1,
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "ownerId": 123,
    "title": "E-commerce Website Development",
    "description": "...",
    "status": "draft",
    "skills": ["React", "Node.js", "PostgreSQL"],
    "tags": ["e-commerce", "full-stack"]
  }
}
```

### Get Project

**Endpoint:** `GET /api/v1/projects/:id`

**Authentication:** Not Required (Public)

**Flow:**
1. Extract project ID from URL parameter
2. Query `projects` table with all related data:
   - Project details
   - Associated skills
   - Associated tags
   - Owner information
   - Statistics (applicants count, views, etc.)
3. Return project data

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "E-commerce Website Development",
    "description": "...",
    "owner": {
      "id": 123,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "skills": ["React", "Node.js", "PostgreSQL"],
    "tags": ["e-commerce", "full-stack"],
    "applicantsCount": 5,
    "viewsCount": 150,
    "ratingAvg": 4.5
  }
}
```

### List Projects

**Endpoint:** `GET /api/v1/projects`

**Authentication:** Not Required (Public)

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20)
- `status`: Filter by status (draft, active, completed, etc.)
- `category`: Filter by category
- `experienceLevel`: Filter by experience level
- `isRemote`: Filter by remote/on-site
- `minBudget`: Minimum budget
- `maxBudget`: Maximum budget
- `search`: Search in title/description
- `skills`: Comma-separated skills
- `tags`: Comma-separated tags
- `sortBy`: Sort field (createdAt, applicantsCount, etc.)
- `sortOrder`: Sort direction (asc, desc)

**Flow:**
1. Parse query parameters
2. Build database query with filters
3. Apply pagination
4. Join with related tables (skills, tags, owner)
5. Return paginated results

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": 1,
        "title": "E-commerce Website Development",
        "description": "...",
        "status": "active",
        "applicantsCount": 5
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### Get Public Projects

**Endpoint:** `GET /api/v1/projects/public`

**Authentication:** Not Required (Public)

**Description:** Optimized endpoint for developer discovery, returns only active projects with essential fields.

**Query Parameters:** Same as List Projects

**Flow:**
1. Filter only active projects
2. Return simplified project data (no drafts, no internal fields)
3. Optimized for performance

### Update Project

**Endpoint:** `PUT /api/v1/projects/:id`

**Authentication:** Required (Project Manager)

**Request Body:** Same as Create Project (all fields optional)

**Flow:**
1. Authenticate user
2. Verify user is project owner or manager
3. Find project by ID
4. Verify ownership
5. Update project fields
6. Update skills/tags if provided
7. Return updated project

### Delete Project

**Endpoint:** `DELETE /api/v1/projects/:id`

**Authentication:** Required (Project Manager)

**Flow:**
1. Authenticate user
2. Verify user is project owner or manager
3. Find project by ID
4. Verify ownership
5. Soft delete: Set `isDeleted = true` (or hard delete based on configuration)
6. Return success message

---

## Application Management APIs

### Apply to Project

**Endpoint:** `POST /api/v1/projects/apply`

**Authentication:** Required (Developer)

**Request Body:**
```json
{
  "projectId": 1,
  "message": "I'm interested in this project and have relevant experience...",
  "proposedBudget": 7500,
  "estimatedDuration": "2.5 months"
}
```

**Flow:**
1. Authenticate user (must be developer)
2. Validate required fields: `projectId`
3. Check if project exists and is accepting applications
4. Check if user already applied
5. Check if project has reached `maxApplicants` limit
6. Create application record in `project_applicants` table:
   - `status`: "pending"
   - `appliedAt`: Current timestamp
7. Increment `applicantsCount` and `newApplicantsCount` on project
8. Send confirmation email to developer
9. Send notification email to project owner
10. Create direct conversation in chat service (if configured)
11. Return success

**Response:**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "id": 1,
    "projectId": 1,
    "developerId": 456,
    "status": "pending",
    "appliedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Withdraw Application

**Endpoint:** `DELETE /api/v1/projects/apply`

**Authentication:** Required (Developer)

**Request Body:**
```json
{
  "projectId": 1
}
```

**Flow:**
1. Authenticate user (must be developer)
2. Find application by project ID and user ID
3. Verify application exists and belongs to user
4. Delete application record
5. Decrement `applicantsCount` on project
6. Send withdrawal email to project owner
7. Return success

### Update Applicant Status

**Endpoint:** `PUT /api/v1/projects/applicants/status`

**Authentication:** Required (Project Manager)

**Request Body:**
```json
{
  "projectId": 1,
  "developerId": 456,
  "status": "shortlisted"
}
```

**Status Values:**
- `pending`: Initial status
- `shortlisted`: Selected for interview
- `accepted`: Application accepted
- `rejected`: Application rejected

**Flow:**
1. Authenticate user (must be project manager)
2. Verify project ownership
3. Find application by project ID and developer ID
4. Update application status
5. If status is "accepted":
   - Add developer to project team
   - Create team member record
6. Send status update email to developer
7. Return success

### List Applicants

**Endpoint:** `GET /api/v1/projects/:projectId/applicants`

**Authentication:** Required (Project Manager)

**Query Parameters:**
- `status`: Filter by status
- `page`: Page number
- `limit`: Results per page

**Flow:**
1. Authenticate user (must be project manager)
2. Verify project ownership
3. Query `project_applicants` table
4. Join with user table to get developer details
5. Return applicants list

**Response:**
```json
{
  "success": true,
  "data": {
    "applicants": [
      {
        "id": 1,
        "developerId": 456,
        "developer": {
          "name": "Jane Developer",
          "email": "jane@example.com",
          "skills": ["React", "Node.js"]
        },
        "status": "pending",
        "appliedAt": "2024-01-15T10:30:00Z",
        "message": "I'm interested in this project..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5
    }
  }
}
```

### List My Applications

**Endpoint:** `GET /api/v1/projects/applications/my`

**Authentication:** Required (Developer)

**Query Parameters:**
- `status`: Filter by status
- `page`: Page number
- `limit`: Results per page

**Flow:**
1. Authenticate user (must be developer)
2. Query `project_applicants` table for user
3. Join with projects table
4. Return applications with project details

### Get My Applied Project IDs

**Endpoint:** `GET /api/v1/projects/applications/my/ids`

**Authentication:** Required (Developer)

**Description:** Returns only project IDs that the user has applied to (useful for frontend filtering).

**Response:**
```json
{
  "success": true,
  "data": [1, 2, 3, 5, 8]
}
```

### Get My Applications Count

**Endpoint:** `GET /api/v1/projects/applications/my/count`

**Authentication:** Required (Developer)

**Response:**
```json
{
  "success": true,
  "count": 5
}
```

### Get Developer Applied Projects

**Endpoint:** `GET /api/v1/projects/developer/applied-projects`

**Authentication:** Required (Developer)

**Description:** Returns full project details for all projects the developer has applied to.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "project": {
        "id": 1,
        "title": "E-commerce Website Development",
        "status": "active"
      },
      "application": {
        "status": "pending",
        "appliedAt": "2024-01-15T10:30:00Z"
      }
    }
  ]
}
```

---

## Invitation Management APIs

### Create Invite

**Endpoint:** `POST /api/v1/projects/invite`

**Authentication:** Required (Project Manager)

**Request Body:**
```json
{
  "projectId": 1,
  "developerId": 456,
  "role": "Senior Developer",
  "message": "We'd love to have you join our team!"
}
```

**Flow:**
1. Authenticate user (must be project manager)
2. Verify project ownership
3. Check if developer already applied or is already on team
4. Create invitation record in `project_invites` table:
   - `status`: "pending"
   - `invitedAt`: Current timestamp
5. Send invitation email to developer
6. Return success

**Response:**
```json
{
  "success": true,
  "message": "Invitation sent successfully",
  "data": {
    "id": 1,
    "projectId": 1,
    "developerId": 456,
    "status": "pending",
    "invitedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get My Invites

**Endpoint:** `GET /api/v1/projects/invites/my`

**Authentication:** Required

**Description:** Returns all invitations received by the authenticated user.

**Query Parameters:**
- `status`: Filter by status (pending, accepted, declined)
- `page`: Page number
- `limit`: Results per page

**Flow:**
1. Authenticate user
2. Query `project_invites` table for user
3. Join with projects table
4. Return invitations with project details

**Response:**
```json
{
  "success": true,
  "data": {
    "invites": [
      {
        "id": 1,
        "projectId": 1,
        "project": {
          "title": "E-commerce Website Development",
          "description": "..."
        },
        "status": "pending",
        "role": "Senior Developer",
        "message": "We'd love to have you join our team!",
        "invitedAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### Get Sent Invitations

**Endpoint:** `GET /api/v1/projects/invites/sent`

**Authentication:** Required (Project Manager)

**Description:** Returns all invitations sent by the authenticated project owner.

**Flow:**
1. Authenticate user (must be project manager)
2. Query `project_invites` table for projects owned by user
3. Join with projects and users tables
4. Return sent invitations

### Cancel Invite

**Endpoint:** `DELETE /api/v1/projects/invite`

**Authentication:** Required (Project Manager)

**Request Body:**
```json
{
  "inviteId": 1
}
```

**Flow:**
1. Authenticate user (must be project manager)
2. Find invitation by ID
3. Verify invitation belongs to user's project
4. Check if invitation is still pending
5. Update invitation status to "cancelled" or delete
6. Return success

### Respond to Invite

**Endpoint:** `PUT /api/v1/projects/invite/respond`

**Authentication:** Required

**Request Body:**
```json
{
  "inviteId": 1,
  "status": "accepted"
}
```

**Status Values:**
- `accepted`: Accept the invitation
- `declined`: Decline the invitation

**Flow:**
1. Authenticate user
2. Find invitation by ID
3. Verify invitation belongs to user
4. Check if invitation is still pending
5. Update invitation status
6. If accepted:
   - Add user to project team
   - Create team member record
7. Send response notification email to project owner
8. Return success

---

## Project Interaction APIs

### Add Project Favorite

**Endpoint:** `POST /api/v1/projects/favorites`

**Authentication:** Required

**Request Body:**
```json
{
  "projectId": 1
}
```

**Flow:**
1. Authenticate user
2. Check if already favorited
3. Create favorite record in `project_favorites` table
4. Increment `favoritesCount` on project
5. Return success

### Remove Project Favorite

**Endpoint:** `DELETE /api/v1/projects/favorites`

**Authentication:** Required

**Request Body:**
```json
{
  "projectId": 1
}
```

**Flow:**
1. Authenticate user
2. Find favorite record
3. Delete favorite record
4. Decrement `favoritesCount` on project
5. Return success

### Get Project Favorites

**Endpoint:** `GET /api/v1/projects/favorites/my`

**Authentication:** Required

**Flow:**
1. Authenticate user
2. Query `project_favorites` table for user
3. Join with projects table
4. Return favorited projects

### Add Project Save

**Endpoint:** `POST /api/v1/projects/saves`

**Authentication:** Required

**Request Body:**
```json
{
  "projectId": 1
}
```

**Description:** Similar to favorites, but for "saved for later" functionality.

**Flow:**
1. Authenticate user
2. Check if already saved
3. Create save record in `project_saves` table
4. Return success

### Remove Project Save

**Endpoint:** `DELETE /api/v1/projects/saves`

**Authentication:** Required

**Request Body:**
```json
{
  "projectId": 1
}
```

### Get Project Saves

**Endpoint:** `GET /api/v1/projects/saves/my`

**Authentication:** Required

### Add Project Comment

**Endpoint:** `POST /api/v1/projects/comments`

**Authentication:** Required

**Request Body:**
```json
{
  "projectId": 1,
  "content": "This project looks interesting!",
  "parentId": null
}
```

**Flow:**
1. Authenticate user
2. Validate required fields: `projectId`, `content`
3. Create comment record in `project_comments` table
4. If `parentId` is provided, create nested comment (reply)
5. Return created comment

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "projectId": 1,
    "userId": 456,
    "content": "This project looks interesting!",
    "parentId": null,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get Project Comments

**Endpoint:** `GET /api/v1/projects/:projectId/comments`

**Authentication:** Not Required (Public)

**Flow:**
1. Query `project_comments` table for project
2. Join with users table
3. Build nested comment structure (replies)
4. Return comments tree

### Update Project Comment

**Endpoint:** `PUT /api/v1/projects/comments/:commentId`

**Authentication:** Required

**Request Body:**
```json
{
  "content": "Updated comment text"
}
```

**Flow:**
1. Authenticate user
2. Find comment by ID
3. Verify comment belongs to user
4. Update comment content
5. Return updated comment

### Delete Project Comment

**Endpoint:** `DELETE /api/v1/projects/comments/:commentId`

**Authentication:** Required

**Flow:**
1. Authenticate user
2. Find comment by ID
3. Verify comment belongs to user (or user is project owner)
4. Delete comment (or soft delete)
5. Return success

### Add Review

**Endpoint:** `POST /api/v1/projects/reviews`

**Authentication:** Required

**Request Body:**
```json
{
  "projectId": 1,
  "rating": 5,
  "comment": "Great project! Very professional team."
}
```

**Flow:**
1. Authenticate user
2. Validate required fields: `projectId`, `rating` (1-5)
3. Check if user already reviewed (one review per user per project)
4. Create review record in `project_reviews` table
5. Recalculate project `ratingAvg` and `ratingCount`
6. Return created review

### Add Boost

**Endpoint:** `POST /api/v1/projects/boost`

**Authentication:** Required (Project Manager)

**Request Body:**
```json
{
  "projectId": 1,
  "plan": "premium",
  "amountCents": 5000,
  "currency": "USD",
  "durationDays": 7
}
```

**Flow:**
1. Authenticate user (must be project manager)
2. Verify project ownership
3. Create boost record in `project_boosts` table
4. Set `isFeatured = true` on project
5. Set `featuredUntil` timestamp
6. Return boost details

---

## File Management APIs

### Add File

**Endpoint:** `POST /api/v1/projects/files`

**Authentication:** Required (Project Manager)

**Request:** Multipart form data

**Form Fields:**
- `projectId`: Project ID
- `file`: File to upload
- `description`: File description (optional)
- `category`: File category (optional)

**Flow:**
1. Authenticate user (must be project manager)
2. Verify project ownership
3. Upload file to Supabase/Cloudinary
4. Get file URL
5. Create file record in `project_files` table:
   - Store file metadata (name, URL, size, mimeType)
6. Return file details

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "projectId": 1,
    "name": "project-spec.pdf",
    "url": "https://...",
    "sizeKb": 1024,
    "mimeType": "application/pdf",
    "uploadedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get Project Files

**Endpoint:** `GET /api/v1/projects/:projectId/files`

**Authentication:** Not Required (Public)

**Flow:**
1. Query `project_files` table for project
2. Return files list

---

## Project Analytics APIs

### Get Project Updates

**Endpoint:** `GET /api/v1/projects/:projectId/updates`

**Authentication:** Not Required (Public)

**Description:** Returns project update posts (announcements, progress updates, etc.).

**Flow:**
1. Query `project_updates` table for project
2. Order by `createdAt` DESC
3. Return updates

### Get Project Reviews

**Endpoint:** `GET /api/v1/projects/:projectId/reviews`

**Authentication:** Not Required (Public)

**Flow:**
1. Query `project_reviews` table for project
2. Join with users table
3. Return reviews

### Get Project Boosts

**Endpoint:** `GET /api/v1/projects/:projectId/boosts`

**Authentication:** Not Required (Public)

**Description:** Returns boost history for a project.

### Get Project Stats

**Endpoint:** `GET /api/v1/projects/:projectId/stats`

**Authentication:** Not Required (Public)

**Response:**
```json
{
  "success": true,
  "data": {
    "applicantsCount": 25,
    "viewsCount": 500,
    "favoritesCount": 15,
    "sharesCount": 8,
    "ratingAvg": 4.5,
    "ratingCount": 10,
    "commentsCount": 5,
    "updatesCount": 3
  }
}
```

### Generate Applicants Report

**Endpoint:** `POST /api/v1/projects/analytics/download` or `/api/v1/projects/export`

**Authentication:** Required (Project Manager)

**Request Body:**
```json
{
  "projectIds": [1, 2, 3],
  "format": "pdf"
}
```

**Flow:**
1. Authenticate user (must be project manager)
2. Verify project ownership for all projects
3. Query applicants for all projects
4. Generate PDF/CSV report
5. Return download link or file

---

## Search & Discovery APIs

### Search Projects

**Endpoint:** `GET /api/v1/projects/search`

**Authentication:** Not Required (Public)

**Query Parameters:**
- `q`: Search query
- `skills`: Comma-separated skills
- `tags`: Comma-separated tags
- `category`: Category filter
- `minBudget`: Minimum budget
- `maxBudget`: Maximum budget
- `isRemote`: Remote filter
- `experienceLevel`: Experience level filter
- `page`: Page number
- `limit`: Results per page

**Flow:**
1. Parse search query and filters
2. Build complex database query with:
   - Full-text search on title/description
   - Skill matching
   - Tag matching
   - Budget range filtering
   - Other filters
3. Apply pagination
4. Return search results

### Get Search Suggestions

**Endpoint:** `GET /api/v1/projects/search/suggestions`

**Authentication:** Not Required (Public)

**Query Parameters:**
- `q`: Search query (partial)

**Description:** Returns autocomplete suggestions for search.

**Response:**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      "E-commerce Website",
      "E-commerce Platform",
      "E-commerce App"
    ]
  }
}
```

### Get Global Skills and Tags

**Endpoint:** `GET /api/v1/projects/global/skills-tags`

**Authentication:** Not Required (Public)

**Description:** Returns all available skills and tags in the system.

**Response:**
```json
{
  "success": true,
  "data": {
    "skills": ["React", "Node.js", "PostgreSQL", ...],
    "tags": ["e-commerce", "full-stack", "remote", ...]
  }
}
```

### Get Project Recommendations

**Endpoint:** `GET /api/v1/projects/recommendations`

**Authentication:** Required

**Query Parameters:**
- `limit`: Number of recommendations (default: 10)

**Flow:**
1. Authenticate user
2. Get user's skills and preferences
3. Find projects matching user's profile:
   - Skill matching
   - Experience level matching
   - Category preferences
4. Calculate match scores
5. Return top recommendations

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "project": {
          "id": 1,
          "title": "E-commerce Website Development"
        },
        "matchScore": 95,
        "reason": "Matches your React and Node.js skills"
      }
    ]
  }
}
```

### Get Project Categories

**Endpoint:** `GET /api/v1/projects/categories`

**Authentication:** Not Required (Public)

**Description:** Returns all available project categories.

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      "Web Development",
      "Mobile Development",
      "Data Science",
      ...
    ]
  }
}
```

### Get Filter Options

**Endpoint:** `GET /api/v1/projects/filter-options`

**Authentication:** Not Required (Public)

**Description:** Returns all available filter options (categories, skills, tags, experience levels, etc.) for building filter UI.

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [...],
    "skills": [...],
    "tags": [...],
    "experienceLevels": ["entry", "mid", "senior", "lead"],
    "statuses": ["draft", "active", "completed"],
    "priorities": ["low", "medium", "high"]
  }
}
```

---

## AI Suggestion APIs

All AI endpoints use Google Generative AI to provide intelligent suggestions for project creation.

### Generate Project Description

**Endpoint:** `POST /api/v1/ai/description`

**Authentication:** Required

**Request Body:**
```json
{
  "title": "E-commerce Website",
  "category": "Web Development",
  "roleNeeded": "Full-Stack Developer"
}
```

**Flow:**
1. Authenticate user
2. Send project data to AI service
3. Generate enhanced project description
4. Return description

**Response:**
```json
{
  "success": true,
  "description": "We are seeking an experienced Full-Stack Developer to build a comprehensive e-commerce platform..."
}
```

### Generate Project Titles

**Endpoint:** `POST /api/v1/ai/titles`

**Authentication:** Required

**Request Body:**
```json
{
  "description": "We need to build an e-commerce website...",
  "category": "Web Development"
}
```

**Response:**
```json
{
  "success": true,
  "titles": [
    "E-commerce Website Development",
    "Online Store Platform",
    "E-commerce Platform Development"
  ]
}
```

### Generate Skill Suggestions

**Endpoint:** `POST /api/v1/ai/skills`

**Authentication:** Required

**Request Body:**
```json
{
  "title": "E-commerce Website",
  "description": "...",
  "category": "Web Development"
}
```

**Response:**
```json
{
  "success": true,
  "skills": ["React", "Node.js", "PostgreSQL", "TypeScript", "Express"]
}
```

### Generate Requirements

**Endpoint:** `POST /api/v1/ai/requirements`

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "requirements": [
    "3+ years of React experience",
    "Strong knowledge of Node.js",
    "Experience with PostgreSQL databases"
  ]
}
```

### Generate Benefits

**Endpoint:** `POST /api/v1/ai/benefits`

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "benefits": [
    "Competitive salary",
    "Flexible working hours",
    "Remote work opportunity",
    "Learning and growth opportunities"
  ]
}
```

### Generate Budget Suggestions

**Endpoint:** `POST /api/v1/ai/budget`

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "budget": {
    "min": 5000,
    "max": 10000,
    "currency": "USD",
    "reasoning": "Based on project scope and required skills..."
  }
}
```

### Generate Comprehensive Suggestions

**Endpoint:** `POST /api/v1/ai/comprehensive`

**Authentication:** Required

**Description:** Generates all suggestions at once (description, titles, skills, requirements, benefits, budget).

**Response:**
```json
{
  "success": true,
  "suggestions": {
    "description": "...",
    "titles": [...],
    "skills": [...],
    "requirements": [...],
    "benefits": [...],
    "budget": {...}
  }
}
```

---

## Project Owner Dashboard APIs

### Get Project Owner Stats

**Endpoint:** `GET /api/v1/projects/owner/stats`

**Authentication:** Required (Project Owner)

**Flow:**
1. Authenticate user (must be project owner)
2. Aggregate statistics from user's projects:
   - Total projects
   - Active projects
   - Total applicants
   - Pending applications
   - Completed projects
   - Average rating
3. Return statistics

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProjects": 10,
    "activeProjects": 5,
    "totalApplicants": 150,
    "pendingApplications": 25,
    "completedProjects": 3,
    "averageRating": 4.5
  }
}
```

### Get Project Owner Projects

**Endpoint:** `GET /api/v1/projects/owner/projects`

**Authentication:** Required (Project Owner)

**Query Parameters:**
- `status`: Filter by status
- `page`: Page number
- `limit`: Results per page

**Flow:**
1. Authenticate user (must be project owner)
2. Query projects owned by user
3. Include statistics (applicants, views, etc.)
4. Return projects list

### Get Project Owner Reviews

**Endpoint:** `GET /api/v1/projects/owner/reviews`

**Authentication:** Required (Project Owner)

**Description:** Returns all reviews for projects owned by the user.

### Get Project Owner Developers

**Endpoint:** `GET /api/v1/projects/owner/developers`

**Authentication:** Required (Project Owner)

**Description:** Returns all developers who have applied to or are working on the user's projects.

### Get Pending Evaluations

**Endpoint:** `GET /api/v1/projects/owner/pending-evaluations`

**Authentication:** Required (Project Owner)

**Description:** Returns projects that need evaluation/review.

### Get Evaluation History

**Endpoint:** `GET /api/v1/projects/owner/evaluation-history`

**Authentication:** Required (Project Owner)

**Description:** Returns history of project evaluations.

---

## Database Models

### Projects Table

```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  uuid UUID UNIQUE NOT NULL,
  owner_id INTEGER NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  role_needed TEXT NOT NULL,
  status project_status DEFAULT 'draft' NOT NULL,
  priority priority DEFAULT 'medium',
  category TEXT,
  experience_level experience_level,
  budget_min INTEGER,
  budget_max INTEGER,
  currency VARCHAR(8) DEFAULT 'USD',
  is_remote BOOLEAN DEFAULT true,
  location TEXT,
  duration TEXT,
  start_date TIMESTAMP,
  deadline TIMESTAMP,
  requirements TEXT,
  benefits TEXT,
  company TEXT,
  website TEXT,
  featured_until TIMESTAMP,
  is_urgent BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  max_applicants INTEGER,
  language TEXT DEFAULT 'English',
  timezone TEXT,
  match_score_avg INTEGER DEFAULT 0,
  rating_avg NUMERIC DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  applicants_count INTEGER DEFAULT 0,
  new_applicants_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Project Applicants Table

```sql
CREATE TABLE project_applicants (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id),
  developer_id INTEGER NOT NULL REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending',
  message TEXT,
  proposed_budget INTEGER,
  estimated_duration TEXT,
  applied_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, developer_id)
);
```

### Project Invites Table

```sql
CREATE TABLE project_invites (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id),
  developer_id INTEGER NOT NULL REFERENCES users(id),
  role TEXT,
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  invited_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP,
  UNIQUE(project_id, developer_id)
);
```

### Project Team Table

```sql
CREATE TABLE project_team (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  role TEXT,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);
```

### Project Files Table

```sql
CREATE TABLE project_files (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id),
  uploader_id INTEGER NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  mime_type TEXT,
  size_kb INTEGER,
  description TEXT,
  category TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW()
);
```

### Project Reviews Table

```sql
CREATE TABLE project_reviews (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id),
  reviewer_id INTEGER NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, reviewer_id)
);
```

### Project Comments Table

```sql
CREATE TABLE project_comments (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  parent_id INTEGER REFERENCES project_comments(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Project Skills Table

```sql
CREATE TABLE project_skills (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id),
  skill_id INTEGER NOT NULL REFERENCES skills(id),
  UNIQUE(project_id, skill_id)
);
```

### Project Tags Table

```sql
CREATE TABLE project_tags (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES projects(id),
  tag_id INTEGER NOT NULL REFERENCES tags(id),
  UNIQUE(project_id, tag_id)
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

### Error Scenarios

1. **Missing Authentication**:
   - Status: 401
   - Message: "Unauthorized"
   - Occurs when: JWT token is missing or invalid

2. **Insufficient Permissions**:
   - Status: 403
   - Message: "Forbidden"
   - Occurs when: User doesn't have required role

3. **Project Not Found**:
   - Status: 404
   - Message: "Project not found"
   - Occurs when: Project ID doesn't exist

4. **Already Applied**:
   - Status: 409
   - Message: "You have already applied to this project"
   - Occurs when: User tries to apply twice

5. **Max Applicants Reached**:
   - Status: 400
   - Message: "Project has reached maximum applicants"
   - Occurs when: Project `maxApplicants` limit is reached

---

## Email Notifications

The service sends email notifications for various events:

1. **Application Submitted**: Confirmation to developer, notification to project owner
2. **Application Withdrawn**: Notification to project owner
3. **Application Status Updated**: Notification to developer (shortlisted, accepted, rejected)
4. **Invitation Sent**: Invitation email to developer
5. **Invitation Responded**: Notification to project owner (accepted/declined)

All emails are sent asynchronously and failures don't break the main flow.

---

## Environment Variables

Required environment variables for the project service:

```env
# Server
PORT=3002
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/skillbridge

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend
FRONTEND_URL=http://localhost:5173

# AI Service (Google Generative AI)
GOOGLE_AI_API_KEY=your-google-ai-api-key

# File Storage (Supabase)
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key

# Chat Service (for creating conversations)
CHAT_SERVICE_URL=http://localhost:3004
```

---

## Testing

### Manual Testing

```bash
# Create Project
curl -X POST http://localhost:3002/api/v1/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Project","description":"...","roleNeeded":"Developer"}'

# List Projects
curl -X GET http://localhost:3002/api/v1/projects

# Apply to Project
curl -X POST http://localhost:3002/api/v1/projects/apply \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"projectId":1}'

# Search Projects
curl -X GET "http://localhost:3002/api/v1/projects/search?q=e-commerce&skills=React"
```

---

## Best Practices

### 1. Project Status Flow

Projects follow a status lifecycle:
- `draft` → `upcoming` → `active` → `completed`/`cancelled`
- Projects can be `paused` at any time
- Only `active` projects accept applications

### 2. Application Limits

- Projects can have a `maxApplicants` limit
- Once reached, no new applications are accepted
- Project owners can manually close applications

### 3. Invitation vs Application

- **Applications**: Developers proactively apply to projects
- **Invitations**: Project owners invite specific developers
- Both can result in team membership

### 4. File Uploads

- Files are uploaded to Supabase/Cloudinary
- Only project managers can upload files
- File metadata is stored in database

### 5. Search Optimization

- Use indexed fields for filtering (skills, tags, category)
- Full-text search on title/description
- Consider caching popular searches

---

## Integration with Other Services

### User Service

- User authentication (JWT validation)
- User profile data for applicants/team members

### Chat Service

- Automatic conversation creation when applications are submitted
- Direct messaging between project owners and developers

### Notification Service

- Application notifications
- Invitation notifications
- Status update notifications

---

## Support

For issues or questions, please contact the development team or create an issue in the repository.

---

**Last Updated:** January 2024
**Version:** 1.0.0

