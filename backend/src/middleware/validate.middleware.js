const { AppError } = require("../utils/errors.util");
const { ERROR_CODES } = require("../utils/constants");

module.exports = (schemaFn) => {
  return (req, res, next) => {
    const { value, errors } = schemaFn(req);
    if (errors && errors.length) {
      return next(new AppError(400, ERROR_CODES.VALIDATION_ERROR, "Validation failed", errors));
    }
    req.validated = value;
    next();
  };
};