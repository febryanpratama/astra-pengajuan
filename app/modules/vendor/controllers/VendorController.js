const { validationResult } = require("express-validator");
const db = require("../../../core/models");
const ResponseCode = require("../../../core/utils/ResponseCode");
const Vendor = db.vendors;

// READ: menampilkan atau mengambil semua data sesuai model dari database
exports.findAll = async (req, res) => {
  const data = await Vendor.findAll({
    where: {
      is_deleted: null,
    },
  });

  return ResponseCode.successGet(req, res, "Data Vendor", data);
};

exports.store = async (req, res) => {
  let data = req.body;

  const response = await Vendor.create({
    nama_vendor: data.nama_vendor,
    pemilik_vendor: data.pemilik_vendor,
    telpon: data.telpon,
    alamat: data.alamat,
  });

  return ResponseCode.successPost(req, res, "Data Vendor Berhasil Ditambahkan");
};

exports.detail = async (req, res) => {
  const id = req.params.id;

  const response = await Vendor.findOne({
    where: {
      id: id,
    },
  });

  return ResponseCode.successGet(req, res, "Data Vendor", response);
};
