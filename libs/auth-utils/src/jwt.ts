import * as jwt from 'jsonwebtoken';
import { TokenPayload } from '@acentra/shared-types';

/**
 * Generate a JWT token for a user
 */
export function generateToken(
  payload: TokenPayload,
  secret: string,
  expiresIn: string | number = '1h'
): string {
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string, secret: string): TokenPayload {
  return jwt.verify(token, secret) as TokenPayload;
}

/**
 * Decode a JWT token without verification (useful for debugging)
 */
export function decodeToken(token: string): TokenPayload | null {
  return jwt.decode(token) as TokenPayload | null;
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}
