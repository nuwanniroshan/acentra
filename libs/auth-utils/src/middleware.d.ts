import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from '@acentra/shared-types';
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
export declare function authMiddleware(jwtSecret: string): (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
/**
 * Express middleware to check if user has required role
 */
export declare function requireRole(...roles: string[]): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
