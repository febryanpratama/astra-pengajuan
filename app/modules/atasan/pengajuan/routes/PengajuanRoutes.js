// const PengajuanController = require("../controllers/PengajuanController");
const PengajuanController = require("../controllers/PengajuanController");
const router = require("express").Router();
const AuthMiddleware = require("../../../../core/middleware/AuthMiddleware");
const {
  postValidator,
} = require("../../../../core/validators/pengajuan/PengajuanValidator");

router.get("/", AuthMiddleware.AuthAtasan, PengajuanController.findAll);


router.get("/:id", AuthMiddleware.AuthAtasan, PengajuanController.detail);
router.patch(
  "/komentar/:id",
  AuthMiddleware.AuthAtasan,
  // postValidator,
  PengajuanController.komentar
  );
router.post(
  "/report/list",
  AuthMiddleware.AuthAtasan,
  PengajuanController.report
);

router.post(
  "/dashboard/count",
  AuthMiddleware.AuthAtasan,
  PengajuanController.dashboardCount
)


module.exports = router;
//
