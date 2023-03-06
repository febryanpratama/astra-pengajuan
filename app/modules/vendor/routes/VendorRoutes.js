const VendorController = require("../controllers/VendorController");
const router = require("express").Router();
const AuthMiddleware = require("../../../core/middleware/AuthMiddleware");
const {
  postValidator,
} = require("../../../core/validators/vendor/VendorValidator");

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
module.exports = router;
