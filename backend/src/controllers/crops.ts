import { Response } from 'express';
import { prisma } from '../utils/prisma';

export const getCrops = async (req: any, res: Response) => {
  try {
    const crops = await prisma.crop.findMany({
      where: { field: { userId: req.user.id } },
      include: { field: true }
    });
    res.json(crops);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch crops' });
  }
};

export const createCrop = async (req: any, res: Response) => {
  try {
    const { name, stage, fieldId, variety } = req.body;
    
    // Verify field belongs to user
    const field = await prisma.field.findUnique({ where: { id: fieldId } });
    if (!field || field.userId !== req.user.id) {
      return res.status(403).json({ error: 'Invalid field' });
    }

    const crop = await prisma.crop.create({
      data: {
        name,
        stage,
        fieldId,
        variety: variety || ''
      }
    });
    res.status(201).json(crop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create crop' });
  }
};

export const updateCrop = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { stage, variety, name } = req.body;
    const crop = await prisma.crop.update({
      where: { id },
      data: { 
        stage: stage !== undefined ? stage : undefined,
        variety: variety !== undefined ? variety : undefined,
        name: name !== undefined ? name : undefined
      }
    });
    res.json(crop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update crop' });
  }
};
