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
router.get("/:id", AuthMiddleware.AuthAdmin, PengajuanController.detail);
router.patch(
  "/:id",
  AuthMiddleware.AuthAdmin,
  postValidator,
  PengajuanController.update
);
router.patch("/", AuthMiddleware.AuthAdmin, PengajuanController.terima);
router.patch("/", AuthMiddleware.AuthAdmin, PengajuanController.tolak);

//url/api/pengajuan/1
router.delete("/:id", AuthMiddleware.AuthAdmin, PengajuanController.delete);

router.get("/", AuthMiddleware.AuthAdmin, PengajuanController.findAll);
module.exports = router;
