import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import fieldsRoutes from './routes/fields';
import cropsRoutes from './routes/crops';
import tasksRoutes from './routes/tasks';
import inventoryRoutes from './routes/inventory';
import settingsRoutes from './routes/settings';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS - restrict to known origins
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '10kb' })); // Limit body size to prevent abuse

app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/fields', fieldsRoutes);
app.use('/api/crops', cropsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/inventory', inventoryRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler - must be registered AFTER all routes
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
