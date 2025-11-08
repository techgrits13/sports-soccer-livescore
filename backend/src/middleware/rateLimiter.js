const rateLimit = require('express-rate-limit');

/**
 * Determine if we should trust proxy headers
 * Only trust in production when behind a reverse proxy (e.g., Render, Heroku)
 */
const isProduction = process.env.NODE_ENV === 'production';
const isBehindProxy = process.env.RENDER === 'true' || process.env.HEROKU === 'true';

// Configure trust for rate limiter based on environment
const trustProxyForRateLimit = isProduction && isBehindProxy ? 1 : false;

/**
 * General API rate limiter
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Explicitly configure trust proxy for rate limiter
  validate: { trustProxy: trustProxyForRateLimit },
});

/**
 * Strict rate limiter for intensive endpoints
 */
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests to this endpoint, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: trustProxyForRateLimit },
});

/**
 * Live data rate limiter (more lenient for real-time data)
 */
const liveLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 requests per minute
  message: {
    success: false,
    error: 'Too many live data requests, please try again in a minute.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { trustProxy: trustProxyForRateLimit },
});

module.exports = {
  apiLimiter,
  strictLimiter,
  liveLimiter
};
