// const PengajuanController = require("../controllers/PengajuanController");
const PengajuanController = require("../controllers/PengajuanController");
const router = require("express").Router();
const AuthMiddleware = require("../../../core/middleware/AuthMiddleware");
// const {
//   postValidator,
// } = require("../../../core/validators/pengajuan/PengajuanValidator");

router.get("/", AuthMiddleware.AuthAdmin, PengajuanController.findAll);

router.post(
  "/",
  AuthMiddleware.AuthAdmin,
  // postValidator,
  PengajuanController.store
);
router.get("/:id", AuthMiddleware.AuthAdmin, PengajuanController.detail);
router.patch(
  "/:id",
  AuthMiddleware.AuthAdmin,
  // postValidator,
  PengajuanController.update
);
router.delete("/:id", AuthMiddleware.AuthAdmin, PengajuanController.delete);
module.exports = router;
