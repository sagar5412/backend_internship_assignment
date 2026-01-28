# Backend Developer Intern Assignment

**Submitted by:** G K Sagar
**Role:** Backend Developer Intern

---

## 🚀 Project Overview

This is a complete **Full Stack Task Management System** built with **Node.js, Express, Prisma (PostgreSQL)**, and **React**. It features secure JWT authentication, Role-Based Access Control (Admin/User), and a comprehensive Admin Dashboard.

## 📂 Repository Structure

- **`/backend`**: Node.js/Express REST API.
- **`/frontend`**: React + Vite UI.

## 🏃‍♂️ Quick Start Guide

### 1. Setup Backend

```bash
cd backend
npm install
# Setup .env file (see backend/README.md)
npx prisma migrate dev
npm start
```

Runs on: `http://localhost:5000` | Swagger Docs: `http://localhost:5000/api-docs`

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on: `http://localhost:5173`

---

## ✅ Features Implemented

### Backend (Primary Focus)

- [x] **Auth**: JWT Login/Register with Password Hashing.
- [x] **RBAC**: Admin vs User roles (`adminOnly` middleware).
- [x] **CRUD**: Full Create, Read, Update, Soft-Delete for Tasks.
- [x] **Admin Features**: View all users, view all tasks, restore deleted data, permanent delete.
- [x] **Validation**: Joi schemas for all inputs.
- [x] **Documentation**: Swagger UI integration.

### Frontend

- [x] **Auth UI**: Login & Register (requires `Admin Code` for Admin role).
- [x] **Task Dashboard**: Filter, create, edit, and delete tasks.
- [x] **Admin Dashboard**: Manage users, active tasks, and trash (restore/delete).
- [x] **UX**: Toast notifications, responsive design, modal forms.

---

## 📈 Scalability Note

To scale this system from 100 to 1,000,000+ users:

1.  **Horizontal Scaling**: usage of Nginx Load Balancers to distribute traffic across multiple Node.js instances (Docker/Kubernetes).
    - _Why_: Node.js is single-threaded; more instances = more concurrency.
2.  **Database Strategy**:
    - **Read Replicas**: Separate Postgres instances for Read operations (Task dashboard) vs Write operations (Create Task).
    - **Indexing**: Proper B-Tree indexes on `userId`, `status`, and `isDeleted` columns.
3.  **Caching**: Implement **Redis** for `GET /tasks` endpoints to reduce DB hits by 80%. Cache invalidation happens on Task Create/Update.
4.  **Microservices**: Future split into `Auth-Service` and `Task-Service` to scale them independently.

---

## 🔒 Security Measures

- **BCrypt**: 12-round salt for password hashing.
- **JWT**: Stateless authentication securely stored.
- **Input Sanitization**: All requests validated with Joi to prevent Injection/Pollution.
- **Soft Deletes**: Data is initially marked `isDeleted: true` for recovery, allowing Audit trails.
