# Repository Cloning Workflow

## Overview
This document explains how project repository cloning works in SkillBridge Pro, from project creation to developer access.

## Workflow

### 1. Project Owner - Adding Repository URL

**Where:** Project Creation/Edit Form (`ProjectForm.jsx`)

**Steps:**
1. Project owner creates or edits a project
2. In the "Company Information" section, they can add a **Repository URL** field
3. Enter the GitHub/GitLab repository URL (e.g., `https://github.com/username/project-name`)
4. Save the project

**Database:**
- Field: `repository_url` (text) in `projects` table
- Added to database schema in `projects.model.js`

### 2. Developer Application Process

**Where:** Project Discovery Page

**Steps:**
1. Developer browses available projects
2. Developer applies to a project
3. Project owner reviews applications
4. Project owner accepts/shortlists the developer

**Status Flow:**
- `applied` → `shortlisted` → `accepted` / `hired`

### 3. Developer Repository Access

**Where:** Developer Dashboard → Overview Tab → Repository Access Section

**Access Control:**
- ✅ **Accessible:** Developers with status `accepted`, `shortlisted`, or `hired`
- ❌ **Restricted:** Developers with status `applied`, `pending`, or `rejected`

**Features:**
- View repository URL
- Copy repository URL to clipboard
- Copy clone URL (HTTPS) to clipboard
- Open repository in new tab
- View clone instructions (Git CLI, GitHub Desktop, VS Code)

**Component:** `RepositoryAccess.jsx`

### 4. Repository Cloning

**Clone URL Format:**
- GitHub: `https://github.com/username/project-name.git`
- GitLab: `https://gitlab.com/username/project-name.git`

**Clone Methods:**
1. **Git Command Line:**
   ```bash
   git clone https://github.com/username/project-name.git
   ```

2. **GitHub Desktop:**
   - File → Clone Repository
   - Paste repository URL
   - Choose local path

3. **VS Code:**
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Git: Clone"
   - Paste repository URL

## Database Schema

```sql
ALTER TABLE projects ADD COLUMN repository_url TEXT;
```

## API Endpoints

### Create Project
- **POST** `/api/v1/projects`
- **Body:** Includes `repositoryUrl` field
- **Response:** Created project with `repositoryUrl`

### Update Project
- **PUT** `/api/v1/projects/:id`
- **Body:** Can include `repositoryUrl` field
- **Response:** Updated project

### Get Project
- **GET** `/api/v1/projects/:id`
- **Response:** Project object with `repositoryUrl` field

## Frontend Components

### 1. ProjectForm.jsx
- **Location:** `client/src/modules/project/components/ProjectForm.jsx`
- **Feature:** Repository URL input field in project creation/edit form
- **Field:** `repositoryUrl` in form data

### 2. RepositoryAccess.jsx
- **Location:** `client/src/modules/dashboard/components/RepositoryAccess.jsx`
- **Feature:** Displays repository access UI for developers
- **Props:**
  - `project`: Project object with `repositoryUrl`
  - `applicationStatus`: Developer's application status

### 3. DeveloperView.jsx
- **Location:** `client/src/modules/dashboard/components/DeveloperView.jsx`
- **Feature:** Shows Repository Access section in Overview tab
- **Display:** Only shows for accepted/shortlisted/hired developers

## Security & Access Control

1. **Repository URL Visibility:**
   - Only visible to developers with `accepted`, `shortlisted`, or `hired` status
   - Project owners can always see/edit their own project repository URLs

2. **Access Validation:**
   - Frontend checks application status before displaying repository
   - Backend should validate access when serving project data (future enhancement)

## Future Enhancements

1. **SSH Clone Support:** Add SSH clone URL option
2. **Branch Selection:** Allow developers to select specific branches
3. **Access Tokens:** Generate temporary access tokens for private repositories
4. **Repository Integration:** Direct integration with GitHub/GitLab APIs
5. **Clone History:** Track when developers clone repositories
6. **Repository Permissions:** Fine-grained permission control

## Testing Checklist

- [ ] Project owner can add repository URL when creating project
- [ ] Project owner can edit repository URL
- [ ] Repository URL is saved to database
- [ ] Developer with `accepted` status can see repository
- [ ] Developer with `shortlisted` status can see repository
- [ ] Developer with `applied` status cannot see repository
- [ ] Clone URL is correctly formatted
- [ ] Copy to clipboard works
- [ ] Open in new tab works
- [ ] Clone instructions are accurate

