"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.requireRole = requireRole;
const jwt_1 = require("./jwt");
/**
 * Express middleware to authenticate requests using JWT
 */
function authMiddleware(jwtSecret) {
    return (req, res, next) => {
        if (req.user) {
            return next();
        }
        let token = (0, jwt_1.extractTokenFromHeader)(req.headers.authorization);
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
            const decoded = (0, jwt_1.verifyToken)(token, jwtSecret);
            req.user = decoded;
            next();
        }
        catch (error) {
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
function requireRole(...roles) {
    return (req, res, next) => {
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
//# sourceMappingURL=middleware.js.map