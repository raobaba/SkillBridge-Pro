/**
 * Controller-level API Logger Middleware
 * 
 * This middleware wrapper can be applied directly to controller functions
 * to log all request/response details and handle errors without losing any existing functionality.
 * 
 * Usage:
 *   const { withApiLogging } = require('shared/middleware/controllerLogger.middleware');
 *   
 *   // Wrap individual controller function
 *   const getMessages = withApiLogging(async (req, res) => {
 *     // Your controller logic
 *   });
 *   
 *   // Or apply to all exports at once
 *   module.exports = withApiLogging(controllerObject);
 */

/**
 * Format request details for logging
 */
function formatRequestDetails(req) {
  const requestDetails = {
    method: req.method,
    url: req.originalUrl || req.url,
    path: req.path,
    query: req.query,
    params: req.params,
    ip: req.ip || req.connection.remoteAddress,
    timestamp: new Date().toISOString(),
  };

  // Add user info if authenticated
  if (req.user) {
    requestDetails.user = {
      userId: req.user.userId || req.user.id,
      email: req.user.email,
      role: req.user.role || req.user.roles?.[0],
    };
  }

  // Add body if present (but limit size for security/performance)
  if (req.body && Object.keys(req.body).length > 0) {
    const bodyStr = JSON.stringify(req.body);
    requestDetails.body = bodyStr.length > 1000 
      ? bodyStr.substring(0, 1000) + '... [truncated]'
      : req.body;
    requestDetails.bodySize = bodyStr.length;
  }

  return requestDetails;
}

/**
 * Format response details for logging
 */
function formatResponseDetails(res, responseTime, responseData = null) {
  return {
    status: res.statusCode,
    statusText: res.statusMessage,
    responseTime: `${responseTime}ms`,
    data: responseData && typeof responseData === 'object' 
      ? (JSON.stringify(responseData).length > 500 
          ? '[Response data too large to log]'
          : responseData)
      : responseData,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Format error details for logging
 */
function formatErrorDetails(error, req, controllerName) {
  const errorDetails = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    code: error.code,
    errno: error.errno,
    syscall: error.syscall,
    timestamp: new Date().toISOString(),
    controller: controllerName,
  };

  // Add request context to error
  errorDetails.request = {
    method: req.method,
    url: req.originalUrl || req.url,
    user: req.user ? {
      userId: req.user.userId || req.user.id,
      email: req.user.email,
      role: req.user.role || req.user.roles?.[0],
    } : null,
  };

  return errorDetails;
}

/**
 * Wrapper function to apply API logging to a single controller function
 * 
 * @param {Function} controllerFn - The controller function to wrap
 * @param {string} controllerName - Optional name for the controller (defaults to function name)
 * @returns {Function} - Wrapped controller function with logging
 */
function withApiLogging(controllerFn, controllerName = null) {
  const fnName = controllerName || controllerFn.name || 'anonymous';
  
  return async (req, res, next) => {
    const startTime = Date.now();
    const requestId = `req-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Log incoming request
    const requestDetails = formatRequestDetails(req);
    console.log(`\n${'='.repeat(80)}`);
    console.log(`[CONTROLLER REQUEST] ${requestId}`);
    console.log(`Controller: ${fnName}`);
    console.log(`Method: ${requestDetails.method} | URL: ${requestDetails.url}`);
    console.log(`User: ${requestDetails.user ? `${requestDetails.user.email} (ID: ${requestDetails.user.userId}, Role: ${requestDetails.user.role})` : 'Unauthenticated'}`);
    console.log(`IP: ${requestDetails.ip} | Timestamp: ${requestDetails.timestamp}`);
    
    if (Object.keys(requestDetails.query || {}).length > 0) {
      console.log(`Query Params:`, requestDetails.query);
    }
    
    if (Object.keys(requestDetails.params || {}).length > 0) {
      console.log(`Route Params:`, requestDetails.params);
    }
    
    if (requestDetails.body) {
      console.log(`Request Body:`, requestDetails.body);
    }

    // Store original response methods to intercept
    const originalSend = res.send.bind(res);
    const originalJson = res.json.bind(res);
    const originalEnd = res.end.bind(res);

    // Response data collector
    let responseData = null;
    let responseSent = false;

    // Override res.send to capture response
    res.send = function(data) {
      if (!responseSent) {
        responseData = data;
        responseSent = true;
      }
      return originalSend(data);
    };

    // Override res.json to capture response
    res.json = function(data) {
      if (!responseSent) {
        responseData = data;
        responseSent = true;
      }
      return originalJson(data);
    };

    // Override res.end to capture response
    res.end = function(data) {
      if (!responseSent && data) {
        responseData = data.toString();
        responseSent = true;
      }
      return originalEnd(data);
    };

    // Try-catch wrapper to handle errors
    try {
      // Call the original controller function
      const result = await controllerFn(req, res, next);

      // If controller returns a promise and response hasn't been sent yet
      if (result && typeof result.then === 'function' && !responseSent) {
        await result;
      }

      // Log response when finished (if not already logged)
      if (!responseSent) {
        res.once('finish', () => {
          logResponse(requestId, fnName, res, startTime, responseData);
        });
      } else {
        // Response was already sent, log immediately
        logResponse(requestId, fnName, res, startTime, responseData);
      }

    } catch (error) {
      // Handle errors
      const responseTime = Date.now() - startTime;
      const errorDetails = formatErrorDetails(error, req, fnName);

      console.error(`\n❌ [CONTROLLER ERROR] ${requestId}`);
      console.error(`Controller: ${fnName}`);
      console.error(`Request: ${errorDetails.request.method} ${errorDetails.request.url}`);
      console.error(`User: ${errorDetails.request.user ? `${errorDetails.request.user.email} (ID: ${errorDetails.request.user.userId})` : 'Unauthenticated'}`);
      console.error(`Error: ${errorDetails.name}: ${errorDetails.message}`);
      console.error(`Stack:`, errorDetails.stack);
      console.error(`Response Time: ${responseTime}ms`);
      console.error(`${'='.repeat(80)}\n`);

      // Pass error to next middleware (don't handle it here, let error middleware handle it)
      if (!responseSent) {
        next(error);
      }
    }
  };
}

/**
 * Log response details
 */
function logResponse(requestId, controllerName, res, startTime, responseData) {
  const responseTime = Date.now() - startTime;
  const responseDetails = formatResponseDetails(res, responseTime, responseData);

  console.log(`\n[CONTROLLER RESPONSE] ${requestId}`);
  console.log(`Controller: ${controllerName}`);
  console.log(`Status: ${responseDetails.status} ${responseDetails.statusText} | Time: ${responseDetails.responseTime}`);
  
  if (responseDetails.data && responseDetails.status >= 400) {
    // Always log error responses in detail
    try {
      const errorData = typeof responseDetails.data === 'string' 
        ? JSON.parse(responseDetails.data) 
        : responseDetails.data;
      console.log(`Error Response:`, errorData);
    } catch (e) {
      console.log(`Error Response:`, responseDetails.data);
    }
  } else if (responseDetails.data && process.env.LOG_SUCCESS_RESPONSES === 'true') {
    // Only log success responses if explicitly enabled
    console.log(`Response Data:`, responseDetails.data);
  }

  // Log performance warning if response is slow
  if (responseTime > 1000) {
    console.warn(`⚠️  SLOW RESPONSE: ${responseTime}ms for controller ${controllerName}`);
  }

  // Log critical errors
  if (responseDetails.status >= 500) {
    console.error(`\n❌ SERVER ERROR [${requestId}]`);
    console.error(`Controller: ${controllerName}`);
    console.error(`Status: ${responseDetails.status}`);
    if (responseDetails.data) {
      console.error(`Error Details:`, responseDetails.data);
    }
  }

  console.log(`${'='.repeat(80)}\n`);
}

/**
 * Apply logging to an entire controller object (all exported functions)
 * 
 * @param {Object} controllerObject - Object containing controller functions
 * @returns {Object} - Controller object with all functions wrapped
 */
function applyToController(controllerObject) {
  const wrappedController = {};
  
  for (const [key, value] of Object.entries(controllerObject)) {
    if (typeof value === 'function') {
      wrappedController[key] = withApiLogging(value, key);
    } else {
      wrappedController[key] = value;
    }
  }
  
  return wrappedController;
}

module.exports = {
  withApiLogging,
  applyToController,
};

