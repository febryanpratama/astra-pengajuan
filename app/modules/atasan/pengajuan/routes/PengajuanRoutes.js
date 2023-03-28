// const PengajuanController = require("../controllers/PengajuanController");
const PengajuanController = require("../controllers/PengajuanController");
const router = require("express").Router();
const AuthMiddleware = require("../../../../core/middleware/AuthMiddleware");
const {
  postValidator,
} = require("../../../../core/validators/pengajuan/PengajuanValidator");

router.get("/", AuthMiddleware.AuthAtasan, PengajuanController.findAll);

// router.post(
//   "/",
//   AuthMiddleware.AuthAtasan,
//   postValidator
//   PengajuanController.store
// );
router.get("/:id", AuthMiddleware.AuthAtasan, PengajuanController.detail);
router.patch(
  "/:id",
  AuthMiddleware.AuthAtasan,
  postValidator,
  PengajuanController.update
);
// router.delete("/:id", AuthMiddleware.AuthAtasan, PengajuanController.delete);
module.exports = router;
