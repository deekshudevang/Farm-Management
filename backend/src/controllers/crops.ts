import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getCrops = async (req: Request, res: Response) => {
  const crops = await prisma.crop.findMany({
    where: { field: { userId: req.user.id } },
    include: { field: true }
  });
  res.json(crops);
};

export const createCrop = async (req: Request, res: Response) => {
  const { name, stage, fieldId, variety } = req.body;
  
  // Verify field belongs to user
  const field = await prisma.field.findUnique({ where: { id: fieldId } });
  if (!field || field.userId !== req.user.id) {
    return res.status(403).json({ error: 'Permission denied: Field does not belong to user' });
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
};

export const updateCrop = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { stage, variety, name } = req.body;
  
  const targetCrop = await prisma.crop.findUnique({
    where: { id },
    include: { field: true }
  });
  
  if (!targetCrop || targetCrop.field.userId !== req.user.id) {
    return res.status(403).json({ error: 'Permission denied: Access to this resource is unauthorized' });
  }

  const crop = await prisma.crop.update({
    where: { id },
    data: { 
      stage: stage !== undefined ? stage : undefined,
      variety: variety !== undefined ? variety : undefined,
      name: name !== undefined ? name : undefined
    }
  });
  res.json(crop);
};
