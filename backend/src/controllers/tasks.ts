import { Response } from 'express';
import { prisma } from '../utils/prisma';

export const getTasks = async (req: any, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const createTask = async (req: any, res: Response) => {
  try {
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const updateTask = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { title, status, description, priority, dueDate } = req.body;
    const task = await prisma.task.update({
      where: { 
        id,
        userId: req.user.id
      },
      data: { 
        title: title !== undefined ? title : undefined,
        status: status !== undefined ? status : undefined,
        description: description !== undefined ? description : undefined,
        priority: priority !== undefined ? priority : undefined,
        dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : undefined
      }
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const targetTask = await prisma.task.findUnique({ where: { id } });
    if (!targetTask || targetTask.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    await prisma.task.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
