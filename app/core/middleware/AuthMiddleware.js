const jwt = require("jsonwebtoken");
const ResponseCode = require("../utils/ResponseCode");

class AuthMiddleware {
  AuthAdmin = (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      // console.log(token);
      if (token == null)
        return res.status(401).json({
          status: false,
          message: "Token Not Found",
        });

      let payload = jwt.verify(token, "SecretPharse");

      if (payload == null)
        return res.status(401).json({
          status: false,
          message: "Token Not Found",
        });

      // console.log(payload.roles);

      // return ResponseCode.successGet(res, payload.roles);
      if (payload.roles != "admin") {
        return res.status(401).json({
          status: false,
          message: "Your not Authorized Admin",
        });
      }

      req.app.locals.credential = payload;
      next();
    } catch (err) {
      // console.log(err);
      return res.status(401).json({
        status: false,
        message: err.message,
      });
    }
  };

  AuthUser = (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      // console.log(token);
      if (token == null)
        return res.status(401).json({
          status: false,
          message: "Token Not Found",
        });

      let payload = jwt.verify(token, "SecretPharse");

      if (payload == null)
        return res.status(401).json({
          status: false,
          message: "Token Not Found",
        });

      if (payload.roles != "user") {
        return res.status(401).json({
          status: false,
          message: "Your not Authorized User",
        });
      }

      req.app.locals.credential = payload;

      next();
    } catch (err) {
      return res.status(401).json({
        status: false,
        message: err.message,
      });
    }
  };

  AuthAtasan = (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      // console.log(token);
      if (token == null)
        return res.status(401).json({
          status: false,
          message: "Token Not Found",
        });

      let payload = jwt.verify(token, "SecretPharse");

      if (payload == null)
        return res.status(401).json({
          status: false,
          message: "Token Not Found",
        });

      if (payload.roles != "atasan") {
        return res.status(401).json({
          status: false,
          message: "Your not Authorized Atasan",
        });
      }

      req.app.locals.credential = payload;

      next();
    } catch (err) {
      return res.status(401).json({
        status: false,
        message: err.message,
      });
    }
  };
}

module.exports = new AuthMiddleware();
