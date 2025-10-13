const logger = require('../config/logger');
const { APIError } = require('../utils/customErrors');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log the error with context
  logger.error('Error:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // Determine status code
  let statusCode = err.statusCode || 500;
  
  // Handle specific error types
  if (err.name === 'CastError') {
    statusCode = 400;
    err.message = 'Invalid ID format';
  }
  
  if (err.name === 'ValidationError') {
    statusCode = 422;
  }
  
  if (err.code === 'ECONNREFUSED') {
    statusCode = 503;
    err.message = 'Service temporarily unavailable';
  }

  // Handle axios errors (external API calls)
  if (err.response) {
    statusCode = err.response.status || 502;
    err.message = err.response.data?.message || 'External API error';
  }

  // Prepare error response
  const errorResponse = {
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      code: err.code,
      ...(err.errors && { details: err.errors })
    }
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
    errorResponse.error.name = err.name;
  }

  // Add API name for external API errors
  if (err.apiName) {
    errorResponse.error.apiName = err.apiName;
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * 404 handler
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  logger.warn(`404 Error - Route not found: ${req.method} ${req.originalUrl}`);
  next(error);
};

/**
 * Handle unhandled promise rejections
 */
const handleUnhandledRejection = () => {
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', {
      promise,
      reason: reason.stack || reason
    });
    // Don't exit the process, just log it
  });
};

/**
 * Handle uncaught exceptions
 */
const handleUncaughtException = () => {
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', {
      message: error.message,
      stack: error.stack
    });
  });
};

module.exports = { 
  errorHandler, 
  notFound,
  handleUnhandledRejection,
  handleUncaughtException
};
