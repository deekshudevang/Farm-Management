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
    const { title } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
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
    const { title, status } = req.body;
    const task = await prisma.task.update({
      where: { id },
      data: { 
        title: title !== undefined ? title : undefined,
        status: status !== undefined ? status : undefined
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
    await prisma.task.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
