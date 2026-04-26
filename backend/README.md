# 🛰️ AgriSmart — API Core

This is the backend engine for the AgriSmart Enterprise platform.

## ⚡ Quick Start
1. Configure `.env` with your MySQL `DATABASE_URL`.
2. `npm install`
3. `npx prisma generate`
4. `npm run dev`

## 📡 API Architecture
- **Auth**: `/api/auth` (Login/Register)
- **Crops**: `/api/crops` (Lifecycle management)
- **Fields**: `/api/fields` (Geospatial sectors)
- **Inventory**: `/api/inventory` (Resource tracking)
- **Tasks**: `/api/tasks` (Operational pipeline)

## 🛡️ Security
- JWT-based middleware.
- Scoped Prisma controllers.
