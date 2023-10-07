const VendorController = require("../controllers/VendorController");
const router = require("express").Router();
const AuthMiddleware = require("../../../../core/middleware/AuthMiddleware");
const {
  postValidator,
} = require("../../../../core/validators/vendor/VendorValidator");

router.get("/", AuthMiddleware.AuthAdmin, VendorController.findAll);

router.post(
  "/",
  AuthMiddleware.AuthAdmin,
  postValidator,
  VendorController.store
);
router.get("/:id", AuthMiddleware.AuthAdmin, VendorController.detail);
router.patch(
  "/:id",
  AuthMiddleware.AuthAdmin,
  postValidator,
  VendorController.update
);
router.post("/list", AuthMiddleware.AuthAdmin, VendorController.findList);


router.get("/jumlah/:id", AuthMiddleware.AuthAdmin, VendorController.jumlah);

router.delete("/:id", AuthMiddleware.AuthAdmin, VendorController.delete);

module.exports = router;
