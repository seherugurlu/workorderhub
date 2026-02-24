const { error } = require("../utils/response.util");
const { AppError } = require("../utils/errors.util");
const { ERROR_CODES } = require("../utils/constants");

module.exports = (err, req, res, next) => {
  if (err && err.code === "LIMIT_FILE_SIZE") {
    const e = new AppError(413, ERROR_CODES.PAYLOAD_TOO_LARGE, "File too large (max 2MB)");
    return error(res, req.requestId, e.statusCode, e.code, e.message, e.details);
  }

  if (err instanceof AppError) {
    return error(res, req.requestId, err.statusCode, err.code, err.message, err.details);
  }

  return error(res, req.requestId, 500, ERROR_CODES.INTERNAL_ERROR, "Internal server error", []);
};