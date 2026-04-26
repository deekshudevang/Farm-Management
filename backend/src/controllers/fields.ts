import { Response } from 'express';
import { prisma } from '../utils/prisma';

export const getFields = async (req: any, res: Response) => {
  try {
    const fields = await prisma.field.findMany({
      where: { userId: req.user.id },
      include: { crops: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(fields);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fields' });
  }
};

export const createField = async (req: any, res: Response) => {
  try {
    const { name, size, soilType } = req.body;
    const field = await prisma.field.create({
      data: {
        name,
        size: parseFloat(size),
        soilType,
        userId: req.user.id
      }
    });
    res.status(201).json(field);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create field' });
  }
};

export const updateField = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { name, size, soilType } = req.body;
    const field = await prisma.field.update({
      where: { 
        id,
        userId: req.user.id
      },
      data: {
        name,
        size: parseFloat(size),
        soilType
      }
    });
    res.json(field);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update field' });
  }
};

export const deleteField = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const targetField = await prisma.field.findUnique({ where: { id } });
    if (!targetField || targetField.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.field.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete field' });
  }
};
