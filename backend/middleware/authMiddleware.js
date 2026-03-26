const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Protect routes - verify JWT token
// @access  Private
const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (Bearer <token>)
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      next();
    } catch (error) {
      console.error('Auth Middleware Error:', error);
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - Invalid token',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized - No token provided',
    });
  }
};

module.exports = { protect };
