// src/middleware/auth.middleware.js

const { verifyAccessToken } = require('../utils/jwt.util');

/**
 * Middleware to protect routes - requires valid JWT token
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from httpOnly cookie
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = { authenticate };
