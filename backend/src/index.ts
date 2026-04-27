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

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/fields', fieldsRoutes);
app.use('/api/crops', cropsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/inventory', inventoryRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
