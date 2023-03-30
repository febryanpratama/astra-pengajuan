// const PengajuanController = require("../controllers/PengajuanController");
const PengajuanController = require("../controllers/PengajuanController");
const router = require("express").Router();
const AuthMiddleware = require("../../../../core/middleware/AuthMiddleware");
const {
  postValidator,
} = require("../../../../core/validators/pengajuan/PengajuanValidator");

router.get("/", AuthMiddleware.AuthAdmin, PengajuanController.findAll);
// api/pengajuan
router.post(
  "/",
  AuthMiddleware.AuthAdmin,
  postValidator,
  PengajuanController.store
);
// url/api/prngajuan
// Ini punya pebri
router.get("/report", AuthMiddleware.AuthUser, PengajuanController.report);
// router.get("/history", AuthMiddleware.AuthAdmin, PengajuanController.history);

router.get("/:id", AuthMiddleware.AuthUser, PengajuanController.detail);
router.patch(
  "/:id",
  AuthMiddleware.AuthUser,
  postValidator,
  PengajuanController.update
);

// Ini Punya agus
// router.get("/", AuthMiddleware.AuthAdmin, PengajuanController.report);

router.patch("/", AuthMiddleware.AuthUser, PengajuanController.terima);
router.patch("/", AuthMiddleware.AuthUser, PengajuanController.tolak);

//url/api/pengajuan/1
router.delete("/:id", AuthMiddleware.AuthAdmin, PengajuanController.delete);

router.get("/", AuthMiddleware.AuthAdmin, PengajuanController.findAll);
module.exports = router;
