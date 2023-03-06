import { Request, Response, NextFunction } from 'express';

export function validateAuthToken(req: Request, res: Response, next: NextFunction) {
  const authToken = req.headers['x-auth-token'];

  if (!authToken || authToken !== 'valid-token') {
    return res.status(401).json({ error: 'Invalid auth token' });
  }

  // If auth token is valid, continue to the next middleware function
  next();
}
