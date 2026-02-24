const { AppError } = require("../utils/errors.util");
const { ERROR_CODES } = require("../utils/constants");

module.exports = (req, res, next) => {
  next(new AppError(404, ERROR_CODES.NOT_FOUND, "Route not found"));
};