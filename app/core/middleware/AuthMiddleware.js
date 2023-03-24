const jwt = require("jsonwebtoken");
const ResponseCode = require("../utils/ResponseCode");

class AuthMiddleware {
  AuthAdmin = (req, res, next) => {
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

    if (payload.roles != "admin") {
      return res.status(401).json({
        status: false,
        message: "Your not Authorized",
      });
    }

    req.app.locals.credential = payload;
    next();
  };
  AuthUser = (req, res, next) => {
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
        message: "Your not Authorized",
      });
    }

    req.app.locals.credential = payload;

    next();
  };

  AuthAtasan = (req, res, next) => {
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

    if (payload.roles != "Atasan") {
      return res.status(401).json({
        status: false,
        message: "Your not Authorized",
      });
    }

    req.app.locals.credential = payload;

    next();
  };
}

module.exports = new AuthMiddleware();
