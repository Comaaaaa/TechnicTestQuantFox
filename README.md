# 💰 Expense Tracker

A modern, full-stack expense tracking application built with Next.js and NestJS, featuring glassmorphism UI design and comprehensive expense management capabilities.

![Expense Tracker](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Frontend](https://img.shields.io/badge/Frontend-Next.js%2014-blue)
![Backend](https://img.shields.io/badge/Backend-NestJS-red)
![Database](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Docker](https://img.shields.io/badge/Docker-Supported-blue)

## ✨ Features

### 🎯 Core Functionality

- **User Authentication** - Secure JWT-based login and registration
- **Expense Management** - Create, read, update, and delete expenses
- **Category Organization** - Organize expenses by categories (Food, Travel, Office, etc.)
- **Date Selection** - Custom date picker for expense entries
- **Profile Management** - Update username and change password

### 📊 Analytics & Visualization

- **Interactive Charts** - Multiple chart types (Line, Bar, Pie, Doughnut)
- **Expense Analytics** - Visual insights into spending patterns
- **Category Breakdown** - Analyze expenses by category
- **Time-based Analysis** - Track expenses over time

### 🎨 User Experience

- **Glassmorphism Design** - Modern, translucent UI elements
- **Responsive Layout** - Works seamlessly on desktop and mobile
- **Real-time Updates** - Instant feedback and data synchronization
- **Dark Theme** - Eye-friendly dark color scheme

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14 with App Directory
- **Language**: TypeScript
- **Styling**: SCSS with CSS Modules
- **Charts**: Chart.js with React-ChartJS-2
- **State Management**: React Hooks
- **Authentication**: JWT tokens with localStorage

### Backend

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport
- **Validation**: Class Validator
- **Documentation**: Swagger/OpenAPI
- **Security**: bcryptjs for password hashing

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Docker and Docker Compose (optional)

### 🐳 Docker Setup (Recommended)

1. **Clone the repository**

```bash
git clone git@github.com:Comaaaaa/TechnicTestQuantFox.git
cd TechnicTestQuantFox
```

2. **Start all services**

```bash
docker-compose up --build -d
```

3. **Access the application**

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- API Documentation: http://localhost:8080/api

## 🏗️ Project Structure

```
TechnicTestQuantFox/
├── backend/                 # NestJS Backend
│   ├── prisma/             # Database schema and migrations
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── expense/        # Expense management module
│   │   ├── user/           # User management module
│   │   ├── prisma/         # Database service
│   │   └── helpers/        # Utility functions
│   └── docker/             # Docker configuration
├── frontend/               # Next.js Frontend
│   ├── src/
│   │   ├── app/            # App directory (pages)
│   │   ├── components/     # Reusable components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # Global styles
│   └── public/             # Static assets
└── docker-compose.yml      # Multi-service Docker setup
```

## 🔌 API Endpoints

### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### User Management

- `GET /user/me` - Get current user profile
- `PUT /user/me` - Update current user profile

### Expense Management

- `GET /expense` - Get all expenses
- `POST /expense` - Create new expense
- `PUT /expense/:id` - Update expense
- `DELETE /expense/:id` - Delete expense

### API Documentation

Visit http://localhost:8080/api for interactive Swagger documentation.

## 🚢 Deployment

### Docker Deployment

```bash
# Build and start production containers
docker-compose up --build -d

```

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by glassmorphism design trends
- Uses best practices for full-stack development

---

**Made with hear for QuantFox Team**
