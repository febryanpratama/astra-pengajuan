const jwt = require("jsonwebtoken");
const ResponseCode = require("../utils/ResponseCode");

class AuthMiddleware {
  AuthAdmin = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null)
      return res.status(401).json({
        status: false,
        message: "Token Not Found",
      });

    jwt.verify(token, "SecretPharse", (err, user) => {
      console.log(err);

      if (err) return ResponseCode.errorPost(req, res, err);

      req.user = user;

      next();
    });
  };
}

module.exports = new AuthMiddleware();
