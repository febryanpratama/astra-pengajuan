// const PengajuanController = require("../controllers/PengajuanController");
const PengajuanController = require("../controllers/PengajuanController");
const router = require("express").Router();
const AuthMiddleware = require("../../../../core/middleware/AuthMiddleware");
const {
  postValidator,
} = require("../../../../core/validators/pengajuan/PengajuanValidator");

// user
router.get("/", AuthMiddleware.AuthUser, PengajuanController.findAll);

router.post(
  "/",
  AuthMiddleware.AuthUser,
  postValidator,
  PengajuanController.store
);
router.get("/:id", AuthMiddleware.AuthUser, PengajuanController.detail);
router.patch(
  "/:id",
  AuthMiddleware.AuthUser,
  // postValidator,/
  PengajuanController.update
);
// router.delete("/:id", AuthMiddleware.AuthUser, PengajuanController.delete);
router.delete("/:id", AuthMiddleware.AuthUser, PengajuanController.terimatolak);

router.post("/report", AuthMiddleware.AuthUser, PengajuanController.report);

module.exports = router;
