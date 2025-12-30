import { TokenPayload } from '@acentra/shared-types';
/**
 * Generate a JWT token for a user
 */
export declare function generateToken(payload: TokenPayload, secret: string, expiresIn?: string | number): string;
/**
 * Verify and decode a JWT token
 */
export declare function verifyToken(token: string, secret: string): TokenPayload;
/**
 * Decode a JWT token without verification (useful for debugging)
 */
export declare function decodeToken(token: string): TokenPayload | null;
/**
 * Extract token from Authorization header
 */
export declare function extractTokenFromHeader(authHeader?: string): string | null;
