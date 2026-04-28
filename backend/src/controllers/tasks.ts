import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getTasks = async (req: Request, res: Response) => {
  const tasks = await prisma.task.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' }
  });
  res.json(tasks);
};

export const createTask = async (req: Request, res: Response) => {
  const { title, description, priority, dueDate } = req.body;
  const task = await prisma.task.create({
    data: {
      title,
      description: description || '',
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: req.user.id
    }
  });
  res.status(201).json(task);
};

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, status, description, priority, dueDate } = req.body;
  
  // Verify ownership
  const targetTask = await prisma.task.findUnique({ where: { id } });
  if (!targetTask || targetTask.userId !== req.user.id) {
    return res.status(403).json({ error: 'Permission denied: Unauthorized activity access' });
  }

  const task = await prisma.task.update({
    where: { id },
    data: { 
      title: title !== undefined ? title : undefined,
      status: status !== undefined ? status : undefined,
      description: description !== undefined ? description : undefined,
      priority: priority !== undefined ? priority : undefined,
      dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : undefined
    }
  });
  res.json(task);
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const targetTask = await prisma.task.findUnique({ where: { id } });
  if (!targetTask || targetTask.userId !== req.user.id) {
    return res.status(403).json({ error: 'Permission denied: Unauthorized activity deletion' });
  }
  await prisma.task.delete({ where: { id } });
  res.status(204).send();
};
