import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from './jwt';
import { TokenPayload } from '@acentra/shared-types';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Express middleware to authenticate requests using JWT
 */
export function authMiddleware(jwtSecret: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      return next();
    }
    let token = extractTokenFromHeader(req.headers.authorization);

    // If no token in header, check query string (useful for downloads)
    if (!token && req.query && typeof req.query.token === 'string') {
        token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token provided' 
      });
    }

    try {
      const decoded = verifyToken(token, jwtSecret);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid or expired token' 
      });
    }
  };
}

/**
 * Express middleware to check if user has required role
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
}
