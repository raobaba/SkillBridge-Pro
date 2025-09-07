

const { logger } = require("../utils/logger.utils");

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
