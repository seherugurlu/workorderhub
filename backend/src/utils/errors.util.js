class AppError extends Error {
  constructor(statusCode, code, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = Array.isArray(details) ? details : [];
  }
}

module.exports = { AppError };