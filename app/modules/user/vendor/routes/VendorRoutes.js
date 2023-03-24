const VendorController = require("../controllers/VendorController");
const router = require("express").Router();
const AuthMiddleware = require("../../../../core/middleware/AuthMiddleware");
const {
  postValidator,
} = require("../../../../core/validators/vendor/VendorValidator");

router.get("/", AuthMiddleware.AuthUser, VendorController.findAll);

// router.post(
//   "/",
//   AuthMiddleware.AuthAdmin,
//   postValidator,
//   VendorController.store
// );
router.get("/:id", AuthMiddleware.AuthUser, VendorController.detail);
// router.patch(
//   "/:id",
//   AuthMiddleware.AuthAdmin,
//   postValidator,
//   VendorController.update
// );

// router.delete("/:id", AuthMiddleware.AuthAdmin, VendorController.delete);

module.exports = router;
