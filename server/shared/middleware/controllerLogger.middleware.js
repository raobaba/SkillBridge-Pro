/**
 * ---------------------------------
 * File: controllerLogger.middleware.js
 * Description:
 * Comprehensive controller logging middleware that automatically tracks:
 * - Request details (method, URL, params, query, body, headers, user info)
 * - Response details (status, body, response time)
 * - Error details (message, stack, context) when API fails
 * 
 * This middleware wraps controller functions to provide detailed logging
 * without requiring manual logging code in each controller function.
 * 
 * Author: Auto-generated
 * Created On: 2025-01-XX
 * 
 * Usage:
 *   const { applyControllerLogger } = require("shared/middleware/controllerLogger.middleware");
 *   const controllers = { getUsers, createUser, ... };
 *   module.exports = applyControllerLogger(controllers);
 * ---------------------------------
 */

const { logger } = require("../utils/logger.utils");

/**
 * Generate a unique request ID for tracking
 */
const generateRequestId = () => {
  return `req-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
};

/**
 * Safely stringify an object, handling circular references
 */
const safeStringify = (obj, maxLength = 2000) => {
  try {
    const str = JSON.stringify(obj, null, 2);
    return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
  } catch (error) {
    return "[Circular or non-serializable object]";
  }
};

/**
 * Extract safe request information (without sensitive data)
 */
const extractRequestInfo = (req) => {
  const { method, originalUrl, url, query, params, body, headers, user, ip } = req;

  return {
    method,
    url: originalUrl || url,
    ip: ip || req.connection?.remoteAddress || "unknown",
    timestamp: new Date().toISOString(),
    
    // Request data
    params: params || {},
    query: query || {},
    body: body ? safeStringify(body) : null,
    
    // Headers (sanitize sensitive info)
    headers: {
      "content-type": headers["content-type"],
      "user-agent": headers["user-agent"],
      "authorization": headers["authorization"] ? "Bearer [REDACTED]" : undefined,
      "accept": headers["accept"],
    },
    
    // User information
    user: user ? {
      id: user.userId || user.id,
      email: user.email || "unknown",
      role: user.role || user.roles?.[0] || "unknown",
    } : null,
  };
};

/**
 * Log request details
 */
const logRequest = (req, requestId) => {
  const requestInfo = extractRequestInfo(req);
  
  logger.info(`[API REQUEST] ${requestId}`, {
    requestId,
    ...requestInfo,
  });

  // Also log to console for immediate visibility
  console.log(`\n[📥 REQUEST] ${requestId}`);
  console.log(`  Method: ${requestInfo.method} ${requestInfo.url}`);
  console.log(`  User: ${requestInfo.user ? `${requestInfo.user.email} (ID: ${requestInfo.user.id}, Role: ${requestInfo.user.role})` : "Guest"}`);
  console.log(`  IP: ${requestInfo.ip}`);
  
  if (Object.keys(requestInfo.params).length > 0) {
    console.log(`  Params:`, requestInfo.params);
  }
  if (Object.keys(requestInfo.query).length > 0) {
    console.log(`  Query:`, requestInfo.query);
  }
  if (requestInfo.body) {
    console.log(`  Body:`, requestInfo.body);
  }
};

/**
 * Log response details
 */
const logResponse = (req, res, requestId, startTime, responseBody = null) => {
  const endTime = process.hrtime.bigint();
  const responseTime = Number(endTime - startTime) / 1_000_000; // milliseconds
  const { statusCode } = res;

  const responseInfo = {
    requestId,
    method: req.method,
    url: req.originalUrl || req.url,
    status: statusCode,
    responseTime: `${responseTime.toFixed(2)}ms`,
    timestamp: new Date().toISOString(),
    responseBody: responseBody ? safeStringify(responseBody, 1000) : null,
  };

  logger.info(`[API RESPONSE] ${requestId}`, responseInfo);

  // Console output with color coding
  const statusEmoji = statusCode >= 500 ? "🔴" : statusCode >= 400 ? "🟡" : "🟢";
  console.log(`\n[📤 RESPONSE] ${requestId} ${statusEmoji}`);
  console.log(`  Status: ${statusCode}`);
  console.log(`  Time: ${responseTime.toFixed(2)}ms`);
  if (responseBody) {
    console.log(`  Body:`, safeStringify(responseBody, 500));
  }

  // Warn for slow responses
  if (responseTime > 1000) {
    logger.warn(`[API SLOW RESPONSE] ${requestId} - ${responseTime.toFixed(2)}ms`);
    console.log(`  ⚠️  SLOW RESPONSE WARNING (>1s)`);
  }
};

/**
 * Log error details
 */
const logError = (req, res, requestId, startTime, error) => {
  const endTime = process.hrtime.bigint();
  const responseTime = Number(endTime - startTime) / 1_000_000; // milliseconds
  const { statusCode } = res;

  const errorInfo = {
    requestId,
    method: req.method,
    url: req.originalUrl || req.url,
    status: statusCode || 500,
    responseTime: `${responseTime.toFixed(2)}ms`,
    timestamp: new Date().toISOString(),
    error: {
      message: error.message || "Unknown error",
      stack: error.stack || "No stack trace available",
      name: error.name || "Error",
      code: error.code,
      errno: error.errno,
      syscall: error.syscall,
    },
    context: {
      params: req.params,
      query: req.query,
      body: req.body ? safeStringify(req.body, 500) : null,
      user: req.user ? {
        id: req.user.userId || req.user.id,
        email: req.user.email,
        role: req.user.role || req.user.roles?.[0],
      } : null,
    },
  };

  logger.error(`[API ERROR] ${requestId}`, errorInfo);

  // Detailed console output
  console.error(`\n[❌ ERROR] ${requestId}`);
  console.error(`  Method: ${req.method} ${req.originalUrl || req.url}`);
  console.error(`  Status: ${statusCode || 500}`);
  console.error(`  Time: ${responseTime.toFixed(2)}ms`);
  console.error(`  Error: ${error.message || "Unknown error"}`);
  console.error(`  Error Type: ${error.name || "Error"}`);
  if (error.stack) {
    console.error(`  Stack Trace:\n${error.stack}`);
  }
  console.error(`  Context:`, safeStringify(errorInfo.context, 1000));
};

/**
 * Wrap a single controller function with logging
 */
const wrapControllerFunction = (controllerFn, functionName) => {
  return async (req, res, next) => {
    const requestId = generateRequestId();
    const startTime = process.hrtime.bigint();
    
    // Attach requestId to req for potential use in other middlewares
    req.requestId = requestId;

    // Log incoming request
    logRequest(req, requestId);

    // Override res.json and res.send to capture response body
    let responseBody = null;
    const originalJson = res.json.bind(res);
    const originalSend = res.send.bind(res);

    res.json = function (body) {
      responseBody = body;
      return originalJson(body);
    };

    res.send = function (body) {
      try {
        responseBody = typeof body === "string" ? JSON.parse(body) : body;
      } catch (e) {
        responseBody = body;
      }
      return originalSend(body);
    };

    try {
      // Execute the original controller function
      await controllerFn(req, res, next);

      // Only log if response hasn't been sent (might be sent in next middleware)
      if (!res.headersSent && responseBody !== null) {
        logResponse(req, res, requestId, startTime, responseBody);
      } else if (!res.headersSent) {
        // Response might be sent later, try to log after a delay
        setTimeout(() => {
          if (res.headersSent && responseBody !== null) {
            logResponse(req, res, requestId, startTime, responseBody);
          }
        }, 100);
      } else {
        // Response already sent (probably by error middleware)
        logResponse(req, res, requestId, startTime, responseBody);
      }
    } catch (error) {
      // Log error with full context
      logError(req, res, requestId, startTime, error);
      
      // Pass error to error middleware
      next(error);
    }
  };
};

/**
 * Apply logging to all controller functions in a controller object
 * 
 * @param {Object} controllers - Object containing controller functions
 * @returns {Object} - Wrapped controller functions with logging
 * 
 * @example
 * const controllers = {
 *   getUsers: async (req, res) => { ... },
 *   createUser: async (req, res) => { ... }
 * };
 * module.exports = applyControllerLogger(controllers);
 */
const applyControllerLogger = (controllers) => {
  if (!controllers || typeof controllers !== "object") {
    throw new Error("Controllers must be an object");
  }

  const wrappedControllers = {};

  for (const [key, controllerFn] of Object.entries(controllers)) {
    if (typeof controllerFn === "function") {
      wrappedControllers[key] = wrapControllerFunction(controllerFn, key);
      logger.info(`[Controller Logger] Wrapped controller function: ${key}`);
    } else {
      wrappedControllers[key] = controllerFn;
    }
  }

  return wrappedControllers;
};

module.exports = {
  applyControllerLogger,
  wrapControllerFunction,
  generateRequestId,
};

