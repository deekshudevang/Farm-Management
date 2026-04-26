import { Response } from 'express';
import { prisma } from '../utils/prisma';

export const getDashboardStats = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const totalFields = await prisma.field.count({ where: { userId } });
    const totalCrops = await prisma.crop.count({ where: { field: { userId } } });
    const activeTasks = await prisma.task.count({ where: { userId, status: { not: 'COMPLETED' } } });
    
    // Mock financial data since we don't have transactions yet
    const revenue = 15000;
    const expenses = 4500;
    const profit = revenue - expenses;

    // Monthly data for charts
    const chartData = [
      { name: 'Jan', revenue: 4000, expenses: 2400 },
      { name: 'Feb', revenue: 3000, expenses: 1398 },
      { name: 'Mar', revenue: 2000, expenses: 9800 },
      { name: 'Apr', revenue: 2780, expenses: 3908 },
      { name: 'May', revenue: 1890, expenses: 4800 },
      { name: 'Jun', revenue: 2390, expenses: 3800 },
    ];

    res.json({
      kpis: {
        totalFields,
        totalCrops,
        activeTasks,
        revenue,
        expenses,
        profit
      },
      chartData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
