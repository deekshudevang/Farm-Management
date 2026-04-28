import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../types';

export const getProfile = async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          fields: true,
          tasks: true,
          inventory: true,
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({ error: 'Identity not found in system' });
  }

  res.json(user);
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const { name, email } = req.body;

  if (email) {
    const existing = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (existing && existing.id !== req.user.id) {
      return res.status(400).json({ error: 'Conflict: Email already registered to another account' });
    }
  }

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      ...(name && { name: name.trim() }),
      ...(email && { email: email.trim().toLowerCase() }),
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  res.json(user);
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Input required: Current and new security codes must be provided' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Security constraint: New code must be at least 6 characters' });
  }

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) {
    return res.status(404).json({ error: 'Identity validation failed' });
  }

  const validPassword = await bcrypt.compare(currentPassword, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: 'Validation failed: Current security code is incorrect' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: req.user.id },
    data: {
      password: hashedPassword,
      // Removed plainPassword storage - security violation
    },
  });

  res.json({ message: 'Security code updated successfully' });
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;

  // Manual cascade (if not set in Prisma schema)
  await prisma.$transaction([
    prisma.inventory.deleteMany({ where: { userId } }),
    prisma.task.deleteMany({ where: { userId } }),
    prisma.crop.deleteMany({ where: { field: { userId } } }),
    prisma.field.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);

  res.json({ message: 'Enterprise account and all associated data purged successfully' });
};
