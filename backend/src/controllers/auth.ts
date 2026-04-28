import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma';

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const sanitizedEmail = email.trim().toLowerCase();
  const sanitizedName = name.trim();

  const existingUser = await prisma.user.findUnique({ where: { email: sanitizedEmail } });
  if (existingUser) {
    return res.status(400).json({ error: 'Conflict: User already exists in the system' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email: sanitizedEmail,
      password: hashedPassword,
      name: sanitizedName
    }
  });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: '24h' }
  );

  res.status(201).json({ 
    token, 
    user: { id: user.id, email: user.email, name: user.name, role: user.role } 
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const sanitizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({ where: { email: sanitizedEmail } });
  if (!user) {
    return res.status(400).json({ error: 'Validation failed: Invalid credentials provided' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: 'Validation failed: Invalid credentials provided' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: '24h' }
  );

  res.json({ 
    token, 
    user: { id: user.id, email: user.email, name: user.name, role: user.role } 
  });
};
