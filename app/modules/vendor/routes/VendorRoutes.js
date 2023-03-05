const VendorController = require("../controllers/VendorController");
const router = require("express").Router();

router.get("/", VendorController.findAll);
router.get("/all", VendorController.getAll);

module.exports = router;
