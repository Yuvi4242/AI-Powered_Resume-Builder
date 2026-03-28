const User = require('../models/User');
const { getBearerTokenFromRequest, verifyAccessToken } = require('../utils/jwt');
const { isDev } = require('../config/env');

// @desc    Protect routes - verify JWT token
// @access  Private
const protect = async (req, res, next) => {
  const token = getBearerTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized - No token provided',
      error: { code: 'AUTH_NO_TOKEN' },
    });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not found',
        error: { code: 'AUTH_USER_NOT_FOUND' },
      });
    }

    return next();
  } catch (error) {
    const name = error?.name;
    const code =
      name === 'TokenExpiredError' ? 'AUTH_TOKEN_EXPIRED' :
      name === 'JsonWebTokenError' ? 'AUTH_TOKEN_INVALID' :
      error?.code === 'JWT_SECRET_MISSING' ? 'AUTH_SERVER_MISCONFIG' :
      'AUTH_UNAUTHORIZED';

    if (isDev) {
      console.warn('[auth] token verification failed', {
        code,
        name,
        message: error?.message,
        path: req.originalUrl,
        method: req.method,
      });
    }

    return res.status(401).json({
      success: false,
      message:
        code === 'AUTH_TOKEN_EXPIRED' ? 'Unauthorized - Token expired' :
        code === 'AUTH_TOKEN_INVALID' ? 'Unauthorized - Invalid token' :
        'Unauthorized',
      error: { code },
    });
  }
};

module.exports = { protect };
