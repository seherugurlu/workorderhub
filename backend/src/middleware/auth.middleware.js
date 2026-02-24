const { AppError } = require("../utils/errors.util");
const { ERROR_CODES } = require("../utils/constants");

module.exports = (req, res, next) => {
  const key = req.header("x-api-key");
  if (!key || key !== process.env.API_KEY) {
    return next(new AppError(401, ERROR_CODES.UNAUTHORIZED, "Missing or invalid API key"));
  }
  next();
};