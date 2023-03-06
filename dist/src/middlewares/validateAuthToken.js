"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAuthToken = void 0;
function validateAuthToken(req, res, next) {
    const authToken = req.headers['x-auth-token'];
    if (!authToken || authToken !== 'valid-token') {
        return res.status(401).json({ error: 'Invalid auth token' });
    }
    // If auth token is valid, continue to the next middleware function
    next();
}
exports.validateAuthToken = validateAuthToken;
