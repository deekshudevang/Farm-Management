import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getDashboardStats = async (req: Request, res: Response) => {
  const userId = req.user.id;

  const [totalFields, totalCrops, activeTasks, crops, tasks] = await Promise.all([
    prisma.field.count({ where: { userId } }),
    prisma.crop.count({ where: { field: { userId } } }),
    prisma.task.count({ where: { userId, status: { not: 'COMPLETED' } } }),
    prisma.crop.findMany({ where: { field: { userId } } }),
    prisma.task.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: 'desc' }
    })
  ]);
  
  // Real financial data simulation
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

  const cropsDistribution = [
    { name: 'Seedling', value: crops.filter(c => c.stage === 'Seedling').length },
    { name: 'Growing', value: crops.filter(c => c.stage === 'Growing').length },
    { name: 'Ready', value: crops.filter(c => c.stage === 'Ready').length },
    { name: 'Harvested', value: crops.filter(c => c.stage === 'Harvested').length },
  ].filter(d => d.value > 0);

  res.json({
    kpis: {
      totalFields,
      totalCrops,
      activeTasks,
      revenue,
      expenses,
      profit
    },
    chartData,
    cropsDistribution,
    tasks
  });
};
