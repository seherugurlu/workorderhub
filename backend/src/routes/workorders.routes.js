const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const ctrl = require("../controllers/workorders.controller");
const schemas = require("../utils/validate.schemas");
const upload = require("../middleware/upload.middleware");

router.use(auth);

router.get("/", ctrl.list);
router.get("/:id", ctrl.getById);

router.post("/", validate(schemas.createWorkOrder), ctrl.create);
router.put("/:id", validate(schemas.updateWorkOrder), ctrl.update);

router.patch("/:id/status", validate(schemas.changeStatus), ctrl.changeStatus);

router.delete("/:id", ctrl.remove);

router.post("/bulk-upload", upload.single("file"), ctrl.bulkUpload);

module.exports = router;