class ErrorHandler extends Error {
  constructor(message, status) {
    super(message);
    this.status = status; // ✅ consistently named 'status'
    Error.captureStackTrace(this, this.constructor);
  }

  sendError(res) {
    res.status(this.status).json({
      success: false,
      message: this.message,
      status: this.status,
    });
  }
}

module.exports = ErrorHandler;
