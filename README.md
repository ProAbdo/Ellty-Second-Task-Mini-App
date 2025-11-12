#  Calculation Tree Application

A full-stack web application for creating and managing hierarchical calculation trees. Users can start with a number and build complex calculation trees by adding mathematical operations (add, subtract, multiply, divide) that branch from parent calculations.

## ✨ Features

-  **User Authentication**: Secure user registration and login with JWT tokens
-  **Calculation Trees**: Create hierarchical calculation structures starting from a number
-  **Mathematical Operations**: Support for addition, subtraction, multiplication, and division
-  **Tree Visualization**: Interactive tree view of calculations with parent-child relationships
-  **Real-time Updates**: View all calculations and their results in real-time
-  **Responsive UI**: Modern, user-friendly interface built with Ant Design
-  **RESTful API**: Well-structured backend API with proper error handling
-  **Database Migrations**: Automated database schema management
-  **Docker Support**: Easy deployment with Docker Compose
-  **Logging**: Comprehensive logging system for debugging and monitoring

## 🛠️ Tech Stack

### 🔙 Backend

-  **Node.js** with **Express.js** - RESTful API server
-  **TypeScript** - Type-safe development
-  **PostgreSQL** - Relational database
-  **Sequelize** - ORM for database operations
-  **JWT** - Authentication and authorization
-  **bcryptjs** - Password hashing
-  **Winston** - Logging
-  **Express Validator** - Input validation
-  **Jest** - Testing framework

### 🎨 Frontend

-  **React 19** - UI library
-  **Vite** - Build tool and dev server
-  **Ant Design** - UI component library
-  **React Context API** - State management

### 🏗️ Infrastructure

- 🐳 **Docker** & **Docker Compose** - Containerization
- 🌐 **Nginx** - Web server for frontend (production)
- 🐘 **PostgreSQL** - Database server

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

-  **Node.js** (v20 or higher)
-  **npm** or **yarn**
-  **Docker** and **Docker Compose** (for containerized deployment)
-  **PostgreSQL** (if running without Docker)

## 🚀 Installation

### Option 1: 🐳 Docker Compose (Recommended)

1. Clone the repository:

```bash
git clone https://github.com/ProAbdo/Ellty-Second-Task-Mini-App
cd "Ellty-Second-Task-Mini-App"
```

2. Start all services with Docker Compose:

```bash
docker-compose up -d
```

This will start:

- PostgreSQL database on port `5432`
- Backend API server on port `8000`
- Frontend application on port `3000`

3. Access the application:
   -  Frontend: http://localhost:3000
   -  Backend API: http://localhost:8000
   -  Health Check: http://localhost:8000/health

### Option 2: 💻 Local Development

#### 🔙 Backend Setup

1. Navigate to the Backend directory:

```bash
cd Backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the `Backend` directory:

```env
NODE_ENV=development
PORT=8000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=calculation_tree
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

4. Start PostgreSQL database (if not using Docker):

```bash
# Using Docker
docker run -d \
  --name calculation-tree-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=calculation_tree \
  -p 5432:5432 \
  postgres:15-alpine
```

5. Run database migrations:

```bash
npm run migrate
```

6. Start the development server:

```bash
npm run dev
```

The backend server will run on http://localhost:8000

#### 🎨 Frontend Setup

1. Navigate to the Frontend directory:

```bash
cd Frontend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the `Frontend` directory:

```env
VITE_API_URL=http://localhost:8000/api
```

4. Start the development server:

```bash
npm run dev
```

The frontend application will run on http://localhost:3000

## ⚙️ Configuration

### 🔙 Backend Environment Variables

| Variable         | Description                               | Default                 |
| ---------------- | ----------------------------------------- | ----------------------- |
| `NODE_ENV`       | Environment mode (development/production) | `development`           |
| `PORT`           | Server port                               | `8000`                  |
| `DB_HOST`        | Database host                             | `localhost`             |
| `DB_PORT`        | Database port                             | `5432`                  |
| `DB_NAME`        | Database name                             | `calculation_tree`      |
| `DB_USER`        | Database username                         | `postgres`              |
| `DB_PASSWORD`    | Database password                         | `postgres`              |
| `JWT_SECRET`     | Secret key for JWT tokens                 | Required                |
| `JWT_EXPIRES_IN` | JWT token expiration time                 | `7d`                    |
| `CORS_ORIGIN`    | Allowed CORS origin                       | `http://localhost:3000` |

### 🎨 Frontend Environment Variables

| Variable       | Description     | Default                     |
| -------------- | --------------- | --------------------------- |
| `VITE_API_URL` | Backend API URL | `http://localhost:8000/api` |

## 📚 API Documentation

### 🔐 Authentication Endpoints

#### 📝 Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

#### 🔑 Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

Response:

```json
{
  "token": "jwt-token",
  "user": {
    "id": 1,
    "username": "string"
  }
}
```

#### 👤 Get Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

### 🧮 Calculation Endpoints

#### 📋 Get All Calculations

```http
GET /api/calculations
```

#### 🔍 Get Calculation by ID

```http
GET /api/calculations/:id
```

#### ➕ Create Starting Number

```http
POST /api/calculations/starting-number
Authorization: Bearer <token>
Content-Type: application/json

{
  "startingNumber": 10
}
```

#### ➕➖✖️➗ Add Operation

```http
POST /api/calculations/operation
Authorization: Bearer <token>
Content-Type: application/json

{
  "parentId": 1,
  "operationType": "add",
  "rightOperand": 5
}
```

**Operation Types**: `add`, `subtract`, `multiply`, `divide`

### ❤️ Health Check

```http
GET /health
```

## 📁 Project Structure

```
.
├── Backend/
│   ├── src/
│   │   ├── config/          # Configuration files (database, logger)
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Custom middleware (auth, error handling)
│   │   ├── migrations/      # Database migrations
│   │   ├── models/          # Sequelize models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── tests/           # Test files
│   │   ├── utils/           # Utility functions
│   │   └── server.ts        # Application entry point
│   ├── dist/                # Compiled JavaScript
│   ├── logs/                # Application logs
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── Frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context providers
│   │   ├── services/        # API service
│   │   ├── theme/           # Theme configuration
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/              # Static assets
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── nginx.conf
│   └── package.json
└── docker-compose.yml
```

## 📜 Scripts

### 🔙 Backend Scripts

-  `npm run build` - Build TypeScript to JavaScript
-  `npm start` - Start production server
-  `npm run dev` - Start development server with hot reload
-  `npm test` - Run tests
-  `npm run test:watch` - Run tests in watch mode
-  `npm run test:coverage` - Run tests with coverage report
-  `npm run migrate` - Run database migrations

### 🎨 Frontend Scripts

-  `npm run dev` - Start development server
-  `npm run build` - Build for production
-  `npm run preview` - Preview production build
-  `npm run lint` - Run ESLint

## 🧪 Testing

### 🔙 Backend Tests

Run tests from the Backend directory:

```bash
cd Backend
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

### 📝 Test Files

-  `Backend/src/tests/auth.test.ts` - Authentication tests
-  `Backend/src/tests/calculation.test.ts` - Calculation tests

## 🗄️ Database Migrations

Database migrations are automatically run when using Docker Compose. For local development:

```bash
cd Backend
npm run migrate
```

## 📝 Logging

Application logs are stored in the `Backend/logs/` directory:

-  `combined.log` - All logs
-  `error.log` - Error logs only

## 💻 Development

### ➕ Adding New Features

1. Backend: Add routes in `Backend/src/routes/`
2. Backend: Add controllers in `Backend/src/controllers/`
3. Backend: Add services for business logic in `Backend/src/services/`
4. Frontend: Add components in `Frontend/src/components/`
5. Frontend: Update API service in `Frontend/src/services/api.js`

## 🐳 Docker Commands

### ▶️ Start services

```bash
docker-compose up -d
```

### ⏹️ Stop services

```bash
docker-compose down
```

### 📋 View logs

```bash
docker-compose logs -f
```

### 🔄 Rebuild services

```bash
docker-compose up -d --build
```

### 🗑️ Stop and remove volumes

```bash
docker-compose down -v
```
