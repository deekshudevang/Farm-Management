import { Response } from 'express';
import { prisma } from '../utils/prisma';

export const getDashboardStats = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const totalFields = await prisma.field.count({ where: { userId } });
    const totalCrops = await prisma.crop.count({ where: { field: { userId } } });
    const activeTasks = await prisma.task.count({ where: { userId, status: { not: 'COMPLETED' } } });
    
    // Real financial data would come from a transactions model
    // For now, let's scale it based on real crops or just keep it 0 if empty
    const revenue = totalCrops > 0 ? (totalCrops * 1250) : 0;
    const expenses = totalCrops > 0 ? (totalCrops * 450) : 0;
    const profit = revenue - expenses;

    // Monthly data for charts
    const chartData = totalCrops > 0 ? [
      { name: 'Jan', revenue: 400, expenses: 240 },
      { name: 'Feb', revenue: 300, expenses: 139 },
      { name: 'Mar', revenue: 200, expenses: 980 },
      { name: 'Apr', revenue: 278, expenses: 390 },
      { name: 'May', revenue: 189, expenses: 480 },
      { name: 'Jun', revenue: revenue, expenses: expenses },
    ] : [];

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
