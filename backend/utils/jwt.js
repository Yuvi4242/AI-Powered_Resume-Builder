const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || typeof secret !== 'string' || !secret.trim()) {
    const err = new Error('JWT_SECRET is missing from environment variables.');
    err.code = 'JWT_SECRET_MISSING';
    throw err;
  }
  return secret;
};

const signAccessToken = (payload, options = {}) => {
  const secret = getJwtSecret();
  const expiresIn = options.expiresIn || '7d';
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyAccessToken = (token) => {
  const secret = getJwtSecret();
  return jwt.verify(token, secret);
};

const getBearerTokenFromRequest = (req) => {
  const header = req.headers?.authorization || req.headers?.Authorization;
  if (!header || typeof header !== 'string') return null;
  const [scheme, value] = header.split(' ');
  if (!scheme || scheme.toLowerCase() !== 'bearer') return null;
  return value || null;
};

module.exports = {
  signAccessToken,
  verifyAccessToken,
  getBearerTokenFromRequest,
};

