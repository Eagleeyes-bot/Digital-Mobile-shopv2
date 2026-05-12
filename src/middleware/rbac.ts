import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/auth';

// In a real app, this would verify a JWT or session
export const rbacMiddleware = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // For demo purposes, we check a custom header or default to GUEST
    const userRole = (req.headers['x-user-role'] as UserRole) || UserRole.GUEST;

    if (allowedRoles.includes(userRole)) {
      next();
    } else {
      res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }
  };
};
