# 🌾 AgriSmart Pro — Farm Management System

A full-stack farm management dashboard for tracking crops, fields, tasks, inventory, and more. Built with React + TypeScript (frontend) and Express + Prisma (backend).

![AgriSmart](https://img.shields.io/badge/AgriSmart-Pro-teal?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?style=flat-square&logo=prisma)

---

## 📑 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Testing](#-testing)
- [Security](#-security)
- [Tech Stack](#-tech-stack)
- [Contributing](#-contributing)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Secure login/register with hashed passwords (bcrypt, 12 rounds) |
| 🌱 **Crop Lifecycle** | Track crops through Seedling → Growing → Ready → Harvested |
| 🗺️ **Field Management** | Register and manage land sectors with soil classification |
| 📋 **Task Pipeline** | Kanban-style task management with status tracking |
| 📦 **Inventory System** | Track seeds, fertilizers, and equipment with low-stock alerts |
| 📊 **Dashboard Analytics** | KPI cards, revenue charts, and crop distribution visuals |
| ✅ **Input Validation** | End-to-end validation with Zod schemas (frontend + backend) |
| 🛡️ **Error Boundaries** | Graceful crash recovery with user-friendly error screens |
| 🔔 **Toast Notifications** | Real-time success/error feedback via react-hot-toast |
| 📱 **Responsive Design** | Works across desktop, tablet, and mobile devices |

---

## 🏗 Architecture

```
farm-management/
├── backend/                # Express + Prisma REST API
│   ├── prisma/             # Database schema & migrations
│   ├── src/
│   │   ├── controllers/    # Route handler logic
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── routes/          # Express route definitions
│   │   └── utils/           # Prisma client, Zod schemas
│   └── .env.example
│
├── frontend/               # React + Vite SPA
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth context provider
│   │   ├── pages/          # Page-level components
│   │   ├── services/       # Axios API client
│   │   └── utils/          # Zod schemas & TypeScript types
│   └── .env.example
│
└── README.md               # You are here
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **MySQL** database
- **npm** package manager

### 1. Clone the Repository

```bash
git clone https://github.com/deekshudevang/Farm-Management.git
cd Farm-Management
```

### 2. Setup Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials and a strong JWT secret
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend at `http://localhost:5000`.

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | MySQL connection string | `mysql://user:pass@localhost:3306/agrismart` |
| `JWT_SECRET` | Secret key for JWT signing | `your-super-secret-key` |
| `PORT` | Server port | `5000` |
| `CORS_ORIGIN` | Allowed frontend origins (comma-separated) | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create new account |
| `POST` | `/api/auth/login` | Sign in & get JWT |

### Protected Routes (require `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/stats` | Dashboard KPIs & charts |
| `GET/POST` | `/api/fields` | List/Create fields |
| `PUT/DELETE` | `/api/fields/:id` | Update/Delete a field |
| `GET/POST` | `/api/crops` | List/Create crops |
| `PUT` | `/api/crops/:id` | Update crop stage |
| `GET/POST` | `/api/tasks` | List/Create tasks |
| `PUT/DELETE` | `/api/tasks/:id` | Update/Delete a task |
| `GET/POST` | `/api/inventory` | List/Create inventory |
| `PUT/DELETE` | `/api/inventory/:id` | Update/Delete inventory |
| `GET/PUT` | `/api/settings/profile` | View/Update profile |
| `PUT` | `/api/settings/password` | Change password |
| `DELETE` | `/api/settings/account` | Delete account |

---

## 🧪 Testing

```bash
cd frontend

# Run tests in watch mode
npm test

# Run tests once (CI mode)
npm run test:run
```

Tests cover all Zod validation schemas for:
- Login / Register forms
- Crop, Field, Task, Inventory schemas

---

## 🔒 Security

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Authentication**: 24-hour expiration tokens
- **Input Validation**: Zod schemas on both frontend and backend
- **CORS Protection**: Whitelist-based origin control
- **Body Size Limiting**: 10KB max request body
- **Auto-Logout**: Automatic session expiry on 401/403 responses
- **Error Boundaries**: Graceful crash recovery in the frontend

---

## 🚀 Deployment

AgriSmart is ready for production. Follow these steps to host it in the cloud.

### 1. Database (MySQL)
Create a production MySQL database using **Aiven**, **Railway**, or **TiDB Cloud**.
- Copy your `DATABASE_URL` (e.g., `mysql://user:pass@host:port/db`).

### 2. Backend (Render / Railway)
- Connect your GitHub repository.
- Root Directory: `backend`
- Build Command: `npm run build` (runs `tsc`)
- Start Command: `npm start` (runs `node dist/index.js`)
- **Environment Variables**:
  - `DATABASE_URL`: Your cloud MySQL connection string.
  - `JWT_SECRET`: A long, secure random string.
  - `NODE_ENV`: `production`

### 3. Frontend (Vercel / Netlify)
- Connect your GitHub repository.
- Root Directory: `frontend`
- Framework Preset: `Vite`
- **Environment Variables**:
  - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://your-api.onrender.com/api`)

---

## 🏗 Technology Stack

### Frontend
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + Framer Motion (Animations)
- **State Management**: Zustand
- **Analytics**: Recharts
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library

### Backend
- **Server**: Express 5 (Node.js)
- **ORM**: Prisma
- **Database**: MySQL
- **Validation**: Zod
- **Security**: JWT (jsonwebtoken) + bcryptjs
- **Middleware**: CORS, Body-Parser, Async Error Handling

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

ISC © [Deekshu Devang](https://github.com/deekshudevang)
