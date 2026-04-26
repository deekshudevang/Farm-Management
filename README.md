# 🌿 AgriSmart Enterprise — Premium Farm Management System

![AgriSmart Banner](assets/banner.png)

AgriSmart is a professional, high-performance farm management platform designed for the modern enterprise. Built with a **10/10 Design System**, it combines cutting-edge **Glassmorphism**, **3D Interactions**, and **Real-time Analytics** to provide a seamless experience for managing crops, fields, inventory, and operations.

---

## ✨ Key Features

### 📊 Enterprise Intelligence
- **Real-time Analytics**: High-performance Area, Bar, and Pie charts for monitoring revenue, crop distribution, and resource levels.
*   **KPI Tracking**: Instant snapshots of net productivity, asset utilization, and operating costs.

### 🚜 Geospatial Sector Management
- **Field Directory**: Manage your land as precision-mapped sectors.
- **Soil Composition**: Track soil profiles (Loamy, Clay, Black, etc.) per sector to optimize yield.

### 🌾 Cultivation Lifecycle
- **Phase Tracking**: Monitor crops from Seedling to Harvest with visual progress indicators.
- **Genome Identification**: Unique identifiers for every crop variant in your system.

### 📦 Resource Stockpile
- **SKU-Level Inventory**: Detailed tracking of seeds, fertilizers, and equipment.
- **Auto-Threshold Alerts**: Visual neon alerts for items below safety stock levels.

### 📋 Operational Pipeline
- **Workload Sync**: Synchronized task management for farm workers and admins.
- **Priority Indexing**: Automated status transitions for mission-critical activities.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Lucide Icons, Recharts, TailwindCSS (Base), Premium Glassmorphic CSS.
- **Backend**: Node.js, Express, Prisma ORM, JWT Authentication.
- **Database**: MySQL (Optimized with relations).

---

## 🚀 How to Run in VS Code

Follow these steps to get your enterprise platform running locally:

### 1. Prerequisites
- **Node.js** (v16 or higher)
- **MySQL Server** (Running locally or on a cloud instance)
- **VS Code**

### 2. Database Setup
1. Open your MySQL client (e.g., MySQL Workbench or Command Line).
2. Create a new database named `farm_management`.
3. Import the provided `farm_db.sql` file located in the root directory:
   ```bash
   mysql -u root -p farm_management < farm_db.sql
   ```

### 3. Backend Configuration
1. Open the `backend` folder in VS Code.
2. Open the `.env` file and update your database credentials:
   ```env
   DATABASE_URL="mysql://YOUR_USER:YOUR_PASSWORD@localhost:3306/farm_management"
   JWT_SECRET="your_premium_secret_key"
   ```
3. Open a terminal in VS Code (`Ctrl + ~`) and run:
   ```bash
   cd backend
   npm install
   npx prisma generate
   npm run dev
   ```

### 4. Frontend Configuration
1. Open a **new terminal** in VS Code.
2. Run the following commands:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. The platform will be live at `http://localhost:5173`.

---

## 📸 Dashboard Preview

![Dashboard Preview](assets/dashboard.png)

---

## 🔒 Security
AgriSmart uses industry-standard **JWT (JSON Web Tokens)** for session management and **Bcrypt** for password encryption, ensuring your enterprise data remains secure.

## 📄 License
This project is proprietary and built for high-performance enterprise agriculture.

---
*Created by Antigravity AI — Pair Programming with Excellence.*
