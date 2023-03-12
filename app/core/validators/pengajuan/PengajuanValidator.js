/// cek lagi belum benar

const { check, checkSchema, validationResult } = require("express-validator");
const ResponseCode = require("../../utils/ResponseCode");

exports.postValidator = [
  // check("user_id)").trim().notEmpty().isString().isLength({ min: 3 }),
  // check("departemen_id").trim().notEmpty().isString().isLength({ min: 3 }),
  // check("vendor_id").trim().notEmpty().isString().isLength({ min: 3 }),
  // check("pengajuan_name").trim().notEmpty().isString().isLength({ min: 3 }),
  // check("tanggal_pengajuan").trim().notEmpty().isString().isLength({ min: 3 }),
  // check("tanggal_mulai").trim().notEmpty().isString().isLength({ min: 3 }),
  // check("tanggal_selesai").trim().notEmpty().isString().isLength({ min: 3 }),
  // check("deskripsi").trim().notEmpty().isString().isLength({ min: 3 }),
  // check("komentar").trim().notEmpty().isString().isLength({ min: 3 }),
  // check("status").trim().notEmpty().isString().isLength({ min: 3 }),
  // check("harga").trim().notEmpty().isString().isLength({ min: 3 }),

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
