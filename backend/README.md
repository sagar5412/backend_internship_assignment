# Task Management System - Backend

A scalable RESTful API built with Node.js, Express, and Prisma, featuring JWT authentication, Role-Based Access Control (RBAC), and interactive Swagger documentation.

## Features

- **Authentication**: Secure JWT-based auth with password hashing (bcrypt).
- **Security**: Admin registration protected by a secret code.
- **RBAC**: Different permissions for `USER` and `ADMIN` roles.
- **CRUD Operations**: Manage tasks with status and priority filtering.
- **Documentation**: Interactive Swagger UI at `/api-docs`.
- **Validation**: Strict input validation using Joi.

## Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone <repo-url>
   cd Backend_Internship/backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the `backend` directory based on the following:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/db"
   JWT_SECRET="your_secret_key"
   JWT_EXPIRE="24h"
   ADMIN_REGISTRATION_CODE="admin123"
   ```

4. **Database Migration**:

   ```bash
   npx prisma migrate dev
   ```

5. **Start the server**:
   ```bash
   npm start
   ```

## API Documentation

The project includes built-in Swagger documentation. Once the server is running, visit:
`http://localhost:5000/api-docs`

---

## Scalability Note

This system is designed with scalability in mind. To handle growth from 100 to 1,000,000+ users, the following strategies should be implemented:

### 1. Horizontal Scaling (Load Balancing)

- **Problem**: A single server instance has CPU/RAM limits.
- **Solution**: Deploy multiple instances of the backend using Docker and Kubernetes. Use an Nginx load balancer to distribute traffic across these instances.
- **Prerequisite**: The application is already "stateless" (uses JWT instead of sessions), making it easy to scale horizontally.

### 2. Caching with Redis

- **Problem**: Database queries (like fetching user tasks) can become slow under high load.
- **Solution**: Implement a caching layer using Redis. Store frequently accessed data (like user profiles or the task list) in RAM.
- **Efficiency**: Reduces database read load by up to 80%.

### 3. Database Optimization

- **Read/Write Splitting**: Use a Primary Postgres instance for writes and multiple Read Replicas for scaling read traffic.
- **Indexing**: Ensure indexes are created on frequently queried columns like `email`, `userId`, and `status`.

### 4. Microservices Architecture

- **Step**: As the project grows, split the `Auth` and `Task` modules into independent services.
- **Benefit**: Allows scaling the `Task` service independently if users are creating tasks faster than they are logging in.

### 5. Asynchronous Processing

- **Problem**: Long-running tasks (like sending emails or generating reports) block the main thread.
- **Solution**: Use a message queue (like RabbitMQ or BullMQ) to process these tasks in the background.
