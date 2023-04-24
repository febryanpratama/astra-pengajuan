// const PengajuanController = require("../controllers/PengajuanController");
const PengajuanController = require("../controllers/PengajuanController");
const router = require("express").Router();
const AuthMiddleware = require("../../../../core/middleware/AuthMiddleware");
const {
  postValidator,
} = require("../../../../core/validators/pengajuan/PengajuanValidator");
// const { application } = require("express");

router.get("/", AuthMiddleware.AuthAdmin, PengajuanController.findAll);

router.post(
  "/report/list",
  AuthMiddleware.AuthAdmin,
  PengajuanController.report
);

router.get("/:id", AuthMiddleware.AuthAdmin, PengajuanController.detail);

router.patch(
  "/:id",
  AuthMiddleware.AuthAdmin,
  postValidator,
  PengajuanController.update
);

router.delete("/:id", AuthMiddleware.AuthAdmin, PengajuanController.delete);

router.get("/", AuthMiddleware.AuthAdmin, PengajuanController.findAll);
router.patch(
  "/terima/:id",
  AuthMiddleware.AuthAdmin,
  PengajuanController.terima
);

router.get("/jumlah/:id", AuthMiddleware.AuthAdmin, PengajuanController.jumlah);

router.patch("/tolak/:id", AuthMiddleware.AuthAdmin, PengajuanController.tolak);

router.post(
  "/dashboard/count",
  AuthMiddleware.AuthAdmin,
  PengajuanController.dashboardCount
)
module.exports = router;
