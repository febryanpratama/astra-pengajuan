/// cek lagi belum benar

const { check, checkSchema, validationResult } = require("express-validator");
const ResponseCode = require("../../utils/ResponseCode");

exports.postValidator = [
  // check("user_id").trim().notEmpty().isString().isLength({ min: 1 }),
  check("pengajuan_name").trim().notEmpty().isString().isLength({ min: 3 }),
  check("deskripsi").trim().notEmpty().isString().isLength({ min: 3 }),
  check("prioritas")
    .trim()
    .notEmpty()
    .isString()
    .matches(/^(Low|Normal|High)$/i),
  check("foto").notEmpty(),

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
//
