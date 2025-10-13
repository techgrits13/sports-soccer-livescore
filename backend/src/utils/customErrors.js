/**
 * Custom error classes for better error handling and HTTP status codes
 */

/**
 * Base API Error class
 */
class APIError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Bad Request Error (400)
 */
class BadRequestError extends APIError {
  constructor(message = 'Bad Request') {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}

/**
 * Unauthorized Error (401)
 */
class UnauthorizedError extends APIError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Forbidden Error (403)
 */
class ForbiddenError extends APIError {
  constructor(message = 'Forbidden') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

/**
 * Not Found Error (404)
 */
class NotFoundError extends APIError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Validation Error (422)
 */
class ValidationError extends APIError {
  constructor(message = 'Validation failed', errors = []) {
    super(message, 422);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * Too Many Requests Error (429)
 */
class TooManyRequestsError extends APIError {
  constructor(message = 'Too many requests') {
    super(message, 429);
    this.name = 'TooManyRequestsError';
  }
}

/**
 * Internal Server Error (500)
 */
class InternalServerError extends APIError {
  constructor(message = 'Internal server error') {
    super(message, 500);
    this.name = 'InternalServerError';
  }
}

/**
 * Service Unavailable Error (503)
 */
class ServiceUnavailableError extends APIError {
  constructor(message = 'Service temporarily unavailable') {
    super(message, 503);
    this.name = 'ServiceUnavailableError';
  }
}

/**
 * API Quota Exceeded Error (429)
 */
class QuotaExceededError extends APIError {
  constructor(message = 'API quota exceeded') {
    super(message, 429);
    this.name = 'QuotaExceededError';
  }
}

/**
 * External API Error (502)
 */
class ExternalAPIError extends APIError {
  constructor(message = 'External API error', apiName = 'Unknown') {
    super(message, 502);
    this.name = 'ExternalAPIError';
    this.apiName = apiName;
  }
}

/**
 * Database Error (500)
 */
class DatabaseError extends APIError {
  constructor(message = 'Database error') {
    super(message, 500);
    this.name = 'DatabaseError';
  }
}

/**
 * Cache Error (500)
 */
class CacheError extends APIError {
  constructor(message = 'Cache error') {
    super(message, 500);
    this.name = 'CacheError';
  }
}

module.exports = {
  APIError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  TooManyRequestsError,
  InternalServerError,
  ServiceUnavailableError,
  QuotaExceededError,
  ExternalAPIError,
  DatabaseError,
  CacheError
};
