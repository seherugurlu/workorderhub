const crypto = require("crypto");

module.exports = (req, res, next) => {
  const id = crypto.randomUUID();
  req.requestId = id;
  res.setHeader("x-request-id", id);
  next();
};