// const { body, validationResult } = require("express-validator");
const { check } = require("express-validator");

exports.postValidator = [
  check("nama_vendor").notEmpty().withMessage("Nama Vendor Tidak Boleh Kosong"),
  check("pemilik_vendor")
    .notEmpty()
    .withMessage("Pemilik Vendor Tidak Boleh Kosong"),
  check("telpon").notEmpty().withMessage("Telpon Tidak Boleh Kosong"),
  check("alamat").notEmpty().withMessage("Alamat Tidak Boleh Kosong"),
];
