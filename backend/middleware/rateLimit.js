const { isDev } = require('../config/env');

// Simple in-memory throttling (per process). Good enough for dev/single-instance.
// In production multi-instance, replace with Redis-based limiter.
const buckets = new Map();

const nowMs = () => Date.now();

const getKey = (req, keyFn) => {
  try {
    return keyFn(req);
  } catch {
    return req.ip || 'unknown';
  }
};

const rateLimit = ({
  windowMs = 60_000,
  max = 30,
  key = (req) => req.user?._id?.toString() || req.ip || 'anon',
  message = 'Too many requests. Please slow down.',
} = {}) => {
  return (req, res, next) => {
    const k = getKey(req, key);
    const ts = nowMs();
    const entry = buckets.get(k) || { start: ts, count: 0 };

    if (ts - entry.start >= windowMs) {
      entry.start = ts;
      entry.count = 0;
    }

    entry.count += 1;
    buckets.set(k, entry);

    if (entry.count > max) {
      if (isDev) console.warn('[rateLimit] blocked', { key: k, path: req.originalUrl, count: entry.count });
      return res.status(429).json({
        success: false,
        message,
        error: { code: 'RATE_LIMITED' },
      });
    }

    return next();
  };
};

module.exports = { rateLimit };

