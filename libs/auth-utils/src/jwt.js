"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
exports.decodeToken = decodeToken;
exports.extractTokenFromHeader = extractTokenFromHeader;
const tslib_1 = require("tslib");
const jwt = tslib_1.__importStar(require("jsonwebtoken"));
/**
 * Generate a JWT token for a user
 */
function generateToken(payload, secret, expiresIn = '1h') {
    return jwt.sign(payload, secret, { expiresIn });
}
/**
 * Verify and decode a JWT token
 */
function verifyToken(token, secret) {
    return jwt.verify(token, secret);
}
/**
 * Decode a JWT token without verification (useful for debugging)
 */
function decodeToken(token) {
    return jwt.decode(token);
}
/**
 * Extract token from Authorization header
 */
function extractTokenFromHeader(authHeader) {
    if (!authHeader) {
        return null;
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }
    return parts[1];
}
//# sourceMappingURL=jwt.js.map