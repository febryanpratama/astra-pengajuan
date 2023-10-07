const { validationResult } = require("express-validator");
const db = require("../../../../../models");
const ResponseCode = require("../../../../core/utils/ResponseCode");
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

// exports.store = async (req, res) => {
//   let data = req.body;

//   const response = await Vendor.create({
//     nama_vendor: data.nama_vendor,
//     pemilik_vendor: data.pemilik_vendor,
//     telpon: data.telpon,
//     alamat: data.alamat,
//   });

//   return ResponseCode.successPost(req, res, "Data Vendor Berhasil Ditambahkan");
// };

// exports.detail = async (req, res) => {
//   const id = req.params.id;

//   const response = await Vendor.findOne({
//     where: {
//       id: id,
//     },
//   });

//   return ResponseCode.successGet(req, res, "Data Vendor", response);
// };

// exports.update = async (req, res) => {
//   const id = req.params.id;
//   let data = req.body;

//   try {
//     const response = await Vendor.update(
//       {
//         nama_vendor: data.nama_vendor,
//         pemilik_vendor: data.pemilik_vendor,
//         telpon: data.telpon,
//         alamat: data.alamat,
//       },
//       {
//         where: {
//           id: id,
//         },
//       }
//     );

//     return ResponseCode.successPost(req, res, "Data Vendor Berhasil Diubah");
//   } catch (err) {
//     //
//     console.log(err);
//     return ResponseCode.errorPost(req, res, err.response);
//     // console.log(err);
//   }
// };
exports.detail = async (req, res) => {
  const id = req.params.id;

  const response = await Vendor.findOne({
    where: {
      id: id,
    },
  });

  return ResponseCode.successGet(req, res, "Data Vendor", response);
};

// exports.delete = async (req, res) => {
//   const id = req.params.id;

//   try {
//     const response = await Vendor.update(
//       {
//         is_deleted: new Date().toLocaleDateString(),
//       },
//       {
//         where: {
//           id: id,
//         },
//       }
//     );

//     return ResponseCode.successPost(req, res, "Data Vendor Berhasil Dihapus");
//   } catch (err) {
//     //
//     console.log(err);
//     return ResponseCode.errorPost(req, res, err.response);
//     // console.log(err);
//   }
// };
