class ErrorHandler extends Error {
  constructor(message, status) {
    super(message);
    this.status = status; // ✅ consistently named 'status'
    Error.captureStackTrace(this, this.constructor);
  }

  sendError(res) {
    res.status(this.status).json({
      type: "error",
      status: this.status,
      message: this.message,
      data: null,
    });
  }
}

module.exports = ErrorHandler;
