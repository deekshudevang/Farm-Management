import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../types';

export const getInventory = async (req: AuthRequest, res: Response) => {
  const inventory = await prisma.inventory.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' }
  });
  res.json(inventory);
};

export const createInventoryItem = async (req: AuthRequest, res: Response) => {
  const { name, category, quantity, unit } = req.body;
  const item = await prisma.inventory.create({
    data: {
      name,
      category,
      quantity: parseInt(quantity, 10),
      unit: unit || 'units',
      userId: req.user.id
    }
  });
  res.status(201).json(item);
};

export const updateInventoryItem = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, category, quantity, unit } = req.body;
  
  // Verify ownership
  const targetItem = await prisma.inventory.findUnique({ where: { id } });
  if (!targetItem || targetItem.userId !== req.user.id) {
    return res.status(403).json({ error: 'Permission denied: Unauthorized asset access' });
  }

  const item = await prisma.inventory.update({
    where: { id },
    data: {
      name,
      category,
      quantity: quantity !== undefined ? parseInt(quantity, 10) : undefined,
      unit: unit !== undefined ? unit : undefined
    }
  });
  res.json(item);
};

export const deleteInventoryItem = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const targetItem = await prisma.inventory.findUnique({ where: { id } });
  if (!targetItem || targetItem.userId !== req.user.id) {
    return res.status(403).json({ error: 'Permission denied: Unauthorized asset deletion' });
  }
  await prisma.inventory.delete({ where: { id } });
  res.status(204).send();
};
