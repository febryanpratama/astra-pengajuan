const VendorController = require("../controllers/VendorController");
const router = require("express").Router();
const AuthMiddleware = require("../../../core/middleware/AuthMiddleware");
const {
  postValidator,
} = require("../../../core/validators/vendor/VendorValidator");

router.get("/", VendorController.findAll);

router.post("/", postValidator, VendorController.store);
router.get("/:id", AuthMiddleware.AuthAdmin, VendorController.detail);
router.patch("/:id", postValidator, VendorController.update);

router.delete("/:id", AuthMiddleware.AuthAdmin, VendorController.delete);

module.exports = router;
