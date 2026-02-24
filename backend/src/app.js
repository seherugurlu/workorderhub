const express = require("express");
const requestId = require("./middleware/requestId.middleware");
const errorMiddleware = require("./middleware/error.middleware");
const notFound = require("./middleware/notfound.middleware");
const routes = require("./routes/index.routes");

const app = express();

app.use(express.json());
app.use(requestId);

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms ${req.requestId}`);
  });
  next();
});

app.use(routes);

app.use(notFound);
app.use(errorMiddleware);

module.exports = app;