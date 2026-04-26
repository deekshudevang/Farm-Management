import { Response } from 'express';
import { prisma } from '../utils/prisma';

export const getInventory = async (req: any, res: Response) => {
  try {
    const inventory = await prisma.inventory.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
};

export const createInventoryItem = async (req: any, res: Response) => {
  try {
    const { name, category, quantity } = req.body;
    const item = await prisma.inventory.create({
      data: {
        name,
        category,
        quantity: parseInt(quantity, 10)
      }
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create inventory item' });
  }
};

export const updateInventoryItem = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, quantity } = req.body;
    const item = await prisma.inventory.update({
      where: { id },
      data: {
        name,
        category,
        quantity: parseInt(quantity, 10)
      }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update inventory item' });
  }
};

export const deleteInventoryItem = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.inventory.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete inventory item' });
  }
};
