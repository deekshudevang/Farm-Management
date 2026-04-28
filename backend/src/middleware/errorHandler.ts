import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Error:', err);

  if (err.name === 'ZodError') {
    return res.status(400).json({ error: 'Validation Error', details: err.errors });
  }

  res.status(500).json({ error: 'Internal Server Error' });
};
