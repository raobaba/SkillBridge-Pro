/**
 * ---------------------------------
 * File: error.middleware.js
 * Description:
 * Custom error-handling middleware that catches errors, logs them with appropriate details, 
 * and sends a structured response to the client. The response varies based on the environment 
 * (development or production), providing more detailed logs in development.
 * 
 * Author: Rameshware Marbate
 * Created On: May-07-2025
 * Updated On: May-07-2025
 * 
 * Notes:
 * - Catches errors thrown by any part of the application.
 * - Logs errors with full stack trace in development and limited info in production.
 * - Ensures that a valid HTTP status code is used (default to 500 if invalid).
 * - Provides a standardized error response with status, message, and optional data.
 * - Logs the error using the `logger` utility for further tracking.
 * ---------------------------------
 */


const { logger } = require("../utils/logger.utils");

/**
 * Custom error handling middleware
 * 
 * This middleware catches errors thrown by other parts of the application, logs them, and sends a formatted error response to the client.
 * It checks the environment (development or production) to decide on the level of detail in the logs.
 */
function errorMiddleware(error, req, res, next) {
  let { status, message, data } = error;

  // Ensure status is a valid HTTP status code
  status = Number.isInteger(status) && status >= 100 && status < 600 ? status : 500;

  // Log the error with full stack trace (only in development)
  if (process.env.NODE_ENV !== "production") {
    console.error(`[❌ ERROR] ${status} - ${message}\n`, error.stack);
  } else {
    console.error(`[❌ ERROR] ${status} - ${message}`);
  }

  // Ensure message is a string & handle internal server errors
  message = status === 500 ? "Internal server error" : message || "Something went wrong";
  logger.error(`${req.method} ${req.originalUrl} ${status || 500} - ${message}`);

  res.status(status).json({
    type: "error",
    status,
    message,
    data: data || null, // Ensure `data` is explicitly returned
  });
}

module.exports = errorMiddleware;
