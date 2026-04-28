import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getFields = async (req: Request, res: Response) => {
  const fields = await prisma.field.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' }
  });
  res.json(fields);
};

export const createField = async (req: Request, res: Response) => {
  const { name, size, unit, location } = req.body;
  const field = await prisma.field.create({
    data: {
      name,
      size: parseFloat(size),
      unit,
      location: location || '',
      userId: req.user.id
    }
  });
  res.status(201).json(field);
};

export const updateField = async (req: Request, res: Response) => {
  const { id } = req.params;
  const targetField = await prisma.field.findUnique({ where: { id: id as string } });
  
  if (!targetField || targetField.userId !== req.user.id) {
    return res.status(403).json({ error: 'Permission denied: Unauthorized field access' });
  }

  const { name, size, unit, location } = req.body;
  const field = await prisma.field.update({
    where: { id: id as string },
    data: { 
      name, 
      size: size !== undefined ? parseFloat(size) : undefined, 
      unit, 
      location 
    }
  });
  res.json(field);
};

export const deleteField = async (req: Request, res: Response) => {
  const { id } = req.params;
  const targetField = await prisma.field.findUnique({ where: { id: id as string } });
  if (!targetField || targetField.userId !== req.user.id) {
    return res.status(403).json({ error: 'Permission denied: Unauthorized field deletion' });
  }

  // Note: Prisma will handle cascading deletes if configured in schema, 
  // otherwise we'd need to handle crops here.
  await prisma.field.delete({ where: { id: id as string } });
  res.status(204).send();
};
