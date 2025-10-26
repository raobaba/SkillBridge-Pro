# 🚀 SkillBridge Pro

A comprehensive platform connecting skilled developers with project owners, enabling seamless collaboration and project management in the tech industry.

![SkillBridge Pro](https://img.shields.io/badge/SkillBridge-Pro-blue?style=for-the-badge&logo=code)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React-18+-blue?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?style=for-the-badge&logo=postgresql)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

SkillBridge Pro is a modern, full-stack web application designed to bridge the gap between talented developers and project owners. The platform facilitates project discovery, application management, and seamless collaboration through an intuitive interface and robust backend services.

### Key Benefits

- **For Developers**: Discover exciting projects, showcase skills, and manage applications
- **For Project Owners**: Find skilled developers, manage projects, and track progress
- **For Everyone**: Streamlined communication, transparent processes, and efficient project management

## ✨ Features

### 🔍 Project Discovery
- **Advanced Search & Filtering**: Find projects by skills, location, budget, and experience level
- **AI-Powered Recommendations**: Personalized project suggestions based on developer profiles
- **Category-Based Browsing**: Explore projects by technology stack and industry
- **Real-time Updates**: Stay updated with project status changes and new opportunities

### 👨‍💻 Developer Features
- **Profile Management**: Comprehensive developer profiles with skills, experience, and portfolio
- **Application Tracking**: Monitor application status and manage applied projects
- **Skill Endorsements**: Receive and give skill endorsements from peers
- **Portfolio Showcase**: Display projects, achievements, and professional milestones
- **AI Career Insights**: Get personalized career recommendations and skill gap analysis

### 🏢 Project Owner Features
- **Project Creation**: Detailed project posting with requirements, budget, and timeline
- **Applicant Management**: Review, shortlist, and manage developer applications
- **Team Collaboration**: Invite team members and manage project roles
- **Progress Tracking**: Monitor project milestones and deliverables
- **Analytics Dashboard**: Track project performance and team productivity

### 🔐 Security & Authentication
- **Multi-Provider OAuth**: Google, GitHub, and LinkedIn authentication
- **Role-Based Access Control**: Secure access based on user roles
- **JWT Token Management**: Secure API authentication and session management
- **Data Privacy**: Comprehensive privacy settings and data protection

### 📱 Modern UI/UX
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Themes**: Customizable interface themes
- **Real-time Notifications**: Instant updates and alerts
- **Intuitive Navigation**: User-friendly interface with smooth interactions

## 🛠 Tech Stack

### Frontend
- **React 18+** - Modern UI library with hooks and functional components
- **Redux Toolkit** - State management with RTK Query for API calls
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Lucide React** - Beautiful, customizable icons
- **Axios** - HTTP client for API requests
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **Microservices Architecture** - Scalable service-oriented design
- **API Gateway** - Centralized API management and routing
- **JWT Authentication** - Secure token-based authentication
- **CORS & Helmet** - Security middleware

### Database
- **PostgreSQL** - Robust relational database
- **Drizzle ORM** - Type-safe database toolkit
- **Database Migrations** - Version-controlled schema management
- **Connection Pooling** - Optimized database connections

### DevOps & Tools
- **Docker** - Containerization for consistent deployments
- **Swagger/OpenAPI** - Comprehensive API documentation
- **ESLint & Prettier** - Code quality and formatting
- **Git** - Version control with GitHub integration

## 🏗 Architecture

SkillBridge Pro follows a **microservices architecture** with the following components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Microservices │
│   (React)       │◄──►│   (Express)     │◄──►│   (Node.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   PostgreSQL    │
                       │   Database      │
                       └─────────────────┘
```

### Service Breakdown

- **API Gateway** (`api-gateway`): Central routing, authentication, and API documentation
- **User Service** (`user-service`): User management, authentication, and profiles
- **Project Service** (`project-service`): Project management, applications, and collaboration
- **Settings Service** (`settings-service`): User preferences and system configuration

## 🚀 Installation

### Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** 15+
- **Git** for version control

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/skillbridge-pro.git
   cd skillbridge-pro
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install all service dependencies
   npm run install:all
   ```

3. **Set up the database**
   ```bash
   # Create database and run migrations
   npm run db:migrate
   
   # Seed the database with sample data
   npm run db:seed
   ```

4. **Configure environment variables**
   ```bash
   # Copy environment files
   cp .env.example .env
   
   # Update database credentials in .env files
   # Update JWT secrets and OAuth credentials
   ```

5. **Start the application**
   ```bash
   # Start all services
   npm start
   
   # Or start individual services
   npm run start:gateway    # API Gateway (port 3000)
   npm run start:user       # User Service (port 3001)
   npm run start:project   # Project Service (port 3002)
   npm run start:settings  # Settings Service (port 3003)
   ```

6. **Start the frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

## ⚙️ Configuration

### Environment Variables

Create `.env` files in each service directory with the following variables:

```env
# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=skillbridge_db
DB_SSL=false

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Database Setup

1. **Create PostgreSQL database**
   ```sql
   CREATE DATABASE skillbridge_db;
   ```

2. **Run migrations**
   ```bash
   npm run db:migrate
   ```

3. **Seed sample data**
   ```bash
   npm run db:seed
   ```

## 📚 API Documentation

### Swagger Documentation

Access the interactive API documentation at:
- **API Gateway**: `http://localhost:3000/api-docs`
- **User Service**: `http://localhost:3001/api-docs`
- **Project Service**: `http://localhost:3002/api-docs`
- **Settings Service**: `http://localhost:3003/api-docs`

### Key API Endpoints

#### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/oauth/google` - Google OAuth
- `POST /api/v1/auth/oauth/github` - GitHub OAuth

#### Projects
- `GET /api/v1/projects` - List all projects
- `POST /api/v1/projects` - Create new project
- `GET /api/v1/projects/:id` - Get project details
- `PUT /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project

#### Applications
- `POST /api/v1/projects/apply` - Apply to project
- `GET /api/v1/projects/developer/applied-projects` - Get developer's applied projects
- `GET /api/v1/projects/:id/applicants` - Get project applicants
- `PUT /api/v1/projects/applicants/status` - Update application status

#### User Management
- `GET /api/v1/user/profile` - Get user profile
- `PUT /api/v1/user/profile` - Update user profile
- `GET /api/v1/user/developers` - List developers
- `POST /api/v1/user/{userId}/roles` - Assign user roles

## 💻 Usage

### For Developers

1. **Create Account**: Sign up with email or OAuth providers
2. **Complete Profile**: Add skills, experience, and portfolio
3. **Browse Projects**: Use search and filters to find relevant projects
4. **Apply to Projects**: Submit applications with cover letters
5. **Track Applications**: Monitor application status and manage responses
6. **Manage Portfolio**: Showcase projects and receive endorsements

### For Project Owners

1. **Create Account**: Register as a project owner
2. **Post Projects**: Create detailed project listings with requirements
3. **Review Applications**: Evaluate developer applications and profiles
4. **Manage Team**: Invite team members and assign roles
5. **Track Progress**: Monitor project milestones and deliverables
6. **Analytics**: View project performance and team productivity

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm test
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing frontend framework
- **Node.js Community** - For the robust backend runtime
- **PostgreSQL Team** - For the reliable database system
- **Open Source Contributors** - For the various libraries and tools used

## 📞 Support

- **Documentation**: [Wiki](https://github.com/yourusername/skillbridge-pro/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/skillbridge-pro/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/skillbridge-pro/discussions)
- **Email**: support@skillbridgepro.com

## 🔮 Roadmap

### Upcoming Features
- [ ] **Real-time Chat**: Integrated messaging system
- [ ] **Video Interviews**: Built-in video calling for interviews
- [ ] **Payment Integration**: Secure payment processing
- [ ] **Mobile App**: React Native mobile application
- [ ] **Advanced Analytics**: Comprehensive reporting dashboard
- [ ] **AI Matching**: Enhanced AI-powered project matching
- [ ] **Time Tracking**: Built-in time tracking and reporting
- [ ] **File Sharing**: Secure file sharing and collaboration

### Version History
- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added AI recommendations and enhanced search
- **v1.2.0** - Improved UI/UX and mobile responsiveness
- **v2.0.0** - Major architecture overhaul with microservices

---

<div align="center">

**Made with ❤️ by the SkillBridge Pro Team**

[⭐ Star this repo](https://github.com/yourusername/skillbridge-pro) | [🐛 Report Bug](https://github.com/yourusername/skillbridge-pro/issues) | [💡 Request Feature](https://github.com/yourusername/skillbridge-pro/issues)

</div>
