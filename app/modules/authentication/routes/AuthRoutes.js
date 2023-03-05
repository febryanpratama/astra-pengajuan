const AuthController = require("../controllers/AuthController");
const router = require("express").Router();

router.post("/", AuthController.login);

module.exports = router;
