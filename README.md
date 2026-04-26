# 🌿 AgriSmart Enterprise — Premium Farm Management System

![AgriSmart Banner](assets/banner.png)

AgriSmart is a professional, high-performance farm management platform designed for the modern enterprise. Built with a **10/10 Design System**, it combines cutting-edge **Glassmorphism**, **Dynamic Interactions**, and **Real-time Analytics** to provide a seamless experience for managing crops, fields, inventory, and operations.

The entire architecture is designed with true multi-tenancy, ensuring enterprise data is fully isolated, secure, and personalized per user.

---

## ✨ Key Features

### 📊 Enterprise Intelligence
- **Dynamic Analytics**: High-performance Area, Bar, and Pie charts displaying real-time revenue, crop lifecycle distribution, and resource levels.
- **KPI Tracking**: Instant snapshots of total productivity, active task load, and projected financial metrics.
- **Automated Calculations**: Financial models automatically adjust based on active bio-assets in the system.

### 🚜 Geospatial Sector Management
- **Field Directory**: Manage your land as precision-mapped sectors.
- **Soil Profiling**: Track soil compositions (Loamy, Clay, Black, etc.) and acreage for each sector to optimize yield strategies.

### 🌾 Cultivation Lifecycle
- **Phase Tracking**: Monitor crops across detailed lifecycle stages (Seedling → Growing → Ready → Harvested).
- **Genetic Variants**: Track specific crop varieties and genomes within each active sector.
- **Strict Isolation**: Crops are securely bound to specific user-owned fields.

### 📦 Resource Stockpile
- **SKU-Level Inventory**: Detailed tracking of seeds, fertilizers, and operational equipment.
- **Auto-Threshold Alerts**: Visual neon alerts automatically flag items that fall below critical safety stock levels.
- **Standardized Units**: Granular tracking using proper metrics (kg, liters, bags, etc.).

### 📋 Operational Pipeline
- **Workload Sync**: Fully synchronized task management with priority indexing (High/Medium/Low).
- **Due Date Tracking**: Monitor deadlines for critical farm operations like irrigation, harvesting, and maintenance.

---

## 🛠️ Technology Stack

This platform is built on a modern, high-performance web stack:

- **Frontend Environment**: React 19 + Vite for ultra-fast compilation.
- **Styling & UI**: TailwindCSS configured with a custom, premium "Space-Modern" Glassmorphism theme. Lucide React for crisp iconography. Recharts for dynamic visual intelligence.
- **Backend Architecture**: Node.js and Express 5 providing a rapid, secure RESTful API.
- **Database & ORM**: MySQL database managed through Prisma ORM 5.22, providing type-safe queries and rigorous schema enforcement.
- **Security**: Industry-standard JWT (JSON Web Tokens) for session isolation and Bcrypt for robust password encryption.

---

## 🚀 How to Run in VS Code

Follow these straightforward steps to launch the enterprise platform locally.

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MySQL Server** (Running locally or via cloud, e.g., XAMPP, Docker, or PlanetScale)
- **VS Code**

### 2. Backend & Database Setup
The system uses Prisma, making database setup incredibly easy. You do not need to manually import SQL files.

1. Open the **`backend`** folder in VS Code.
2. Open the `.env` file and ensure your database credentials are correct:
   ```env
   DATABASE_URL="mysql://YOUR_USER:YOUR_PASSWORD@localhost:3306/farm_management"
   JWT_SECRET="your_premium_secret_key"
   ```
   *(If the `farm_management` database doesn't exist yet, create an empty one in your MySQL client first).*
3. Open an integrated terminal (`Ctrl + ~`) in the **`backend`** directory and run:
   ```bash
   # Install backend dependencies
   npm install

   # Push the database schema to MySQL (creates all tables automatically)
   npx prisma db push

   # Generate the Prisma Client
   npx prisma generate

   # (Optional but Recommended) Populate the database with realistic Enterprise data
   npx tsx src/seed.ts

   # Start the Express server
   npm run dev
   ```
   *The backend will start running on `http://localhost:5000`.*

### 3. Frontend Configuration
1. Open a **new terminal split** in VS Code.
2. Navigate to the **`frontend`** directory and run:
   ```bash
   cd frontend
   
   # Install frontend dependencies
   npm install
   
   # Start the Vite development server
   npm run dev
   ```
3. The platform interface will now be live at **`http://localhost:5173`**. Hold `Ctrl` and click the link in the terminal to open it in your browser.

---

## 🔑 Demo Access

If you ran the `npx tsx src/seed.ts` command during setup, the system is pre-loaded with a beautiful dataset. You can log in immediately with:

- **Email**: `admin@smartfarm.com`
- **Password**: `password123`

*Note: You can also click "Sign Up" on the login screen to create a fresh, empty account to see the platform's multi-tenant isolation in action.*

---

## 📸 Dashboard Preview

![Dashboard Preview](assets/dashboard.png)

---

## 📄 License
This project is proprietary and built for high-performance enterprise agriculture.

---
*Architected and Engineered for Excellence.*
