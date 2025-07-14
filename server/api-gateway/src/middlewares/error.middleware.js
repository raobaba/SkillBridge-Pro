
const { logger } = require("../utils/logger.utils");

function errorMiddleware(error, req, res, next) {
  let { status, message, data } = error;
  status = Number.isInteger(status) && status >= 100 && status < 600 ? status : 500;
  if (process.env.NODE_ENV !== "production") {
    console.error(`[❌ ERROR] ${status} - ${message}\n`, error.stack);
  } else {
    console.error(`[❌ ERROR] ${status} - ${message}`);
  }
  message = status === 500 ? "Internal server error" : message || "Something went wrong";
  logger.error(`${req.method} ${req.originalUrl} ${status || 500} - ${message}`);

  res.status(status).json({
    type: "error",
    status,
    message,
    data: data || null,
  });
}

module.exports = errorMiddleware;
