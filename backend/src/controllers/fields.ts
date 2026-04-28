import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../types';

export const getFields = async (req: AuthRequest, res: Response) => {
  const fields = await prisma.field.findMany({
    where: { userId: req.user.id },
    include: { crops: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(fields);
};

export const createField = async (req: AuthRequest, res: Response) => {
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
};

export const updateField = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, size, soilType } = req.body;
  
  // Verify ownership before update
  const targetField = await prisma.field.findUnique({ where: { id } });
  if (!targetField || targetField.userId !== req.user.id) {
    return res.status(403).json({ error: 'Permission denied: Unauthorized sector access' });
  }

  const field = await prisma.field.update({
    where: { id },
    data: {
      name,
      size: parseFloat(size),
      soilType
    }
  });
  res.json(field);
};

export const deleteField = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const targetField = await prisma.field.findUnique({ where: { id } });
  if (!targetField || targetField.userId !== req.user.id) {
    return res.status(403).json({ error: 'Permission denied: Unauthorized sector deletion' });
  }

  // Note: Prisma will handle cascading deletes if configured in schema, 
  // otherwise we'd need to handle crops here.
  await prisma.field.delete({ where: { id } });
  res.status(204).send();
};
