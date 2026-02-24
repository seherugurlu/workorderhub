const multer = require("multer");
const { AppError } = require("../utils/errors.util");
const { ERROR_CODES } = require("../utils/constants");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const name = file.originalname || "";
    const isCsv = name.toLowerCase().endsWith(".csv");
    if (!isCsv) {
      return cb(new AppError(415, ERROR_CODES.UNSUPPORTED_MEDIA_TYPE, "Only .csv files are allowed"));
    }
    cb(null, true);
  }
});

module.exports = upload;