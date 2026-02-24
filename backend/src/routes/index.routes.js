const router = require("express").Router();
const { ok } = require("../utils/response.util");
const workOrdersRoutes = require("./workorders.routes");

router.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

router.use("/api/workorders", workOrdersRoutes);

module.exports = router;