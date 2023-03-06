const { check, checkSchema, validationResult } = require("express-validator");
const ResponseCode = require("../../utils/ResponseCode");

exports.postValidator = [
  check("nama_vendor").trim().notEmpty().isString().isLength({ min: 3 }),
  check("pemilik_vendor").trim().notEmpty().isString().isLength({ min: 3 }),
  check("alamat").trim().notEmpty().isString().isLength({ min: 3 }),
  check("telpon").trim().notEmpty().isString().isLength({ min: 3 }),
  (req, res, next) => {
    const errors = validationResult(req);

    console.log(errors);
    if (!errors.isEmpty()) {
      return ResponseCode.errorPost(
        req,
        res,
        errors.errors[0].param + " | " + errors.errors[0].msg
      );
    }
    next();
  },
];
