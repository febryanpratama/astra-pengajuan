const { validationResult } = require("express-validator");
const db = require("../../../core/models");
const ResponseCode = require("../../../core/utils/ResponseCode");
const Vendor = db.vendors;

// CREATE: untuk enambahkan data kedalam tabel book
exports.create = (req, res) => {
  -p;
  // validate request
  if (!req.body.title) {
    return res.status(400).send({
      message: "Title can not be empty",
    });
  }

  // daya yang didapatkan dari inputan oleh pengguna
  const book = {
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false,
  };

  // proses menyimpan kedalam database
  Book.create(book)
    .then((data) => {
      res.json({
        message: "Book created successfully.",
        data: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message || "Some error occurred while creating the Book.",
        data: null,
      });
    });
};

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
  // const errors = validationResult(data);

  // if (!errors.isEmpty()) {
  //   return ResponseCode.errorPost(req, res, errors.array());
  // }

  const response = await Vendor.create({
    nama_vendor: data.nama_vendor,
    pemilik_vendor: data.pemilik_vendor,
    telpon: data.telpon,
    alamat: data.alamat,
  });

  return ResponseCode.successPost(req, res, "Data Vendor Berhasil Ditambahkan");
};

// // UPDATE: Merubah data sesuai dengan id yang dikirimkan sebagai params
// exports.update = (req, res) => {
//   const id = req.params.id;
//   Book.update(req.body, {
//     where: { id },
//   })
//     .then((num) => {
//       if (num == 1) {
//         res.json({
//           message: "Book updated successfully.",
//           data: req.body,
//         });
//       } else {
//         res.json({
//           message: `Cannot update book with id=${id}. Maybe book was not found or req.body is empty!`,
//           data: req.body,
//         });
//       }
//     })
//     .catch((err) => {
//       res.status(500).json({
//         message: err.message || "Some error occurred while updating the book.",
//         data: null,
//       });
//     });
// };

// // DELETE: Menghapus data sesuai id yang dikirimkan
// exports.delete = (req, res) => {
//   const id = req.params.id;
//   Book.destroy({
//     where: { id },
//   })
//     .then((num) => {
//       if (num == 1) {
//         res.json({
//           message: "Book deleted successfully.",
//           data: req.body,
//         });
//       } else {
//         res.json({
//           message: `Cannot delete book with id=${id}. Maybe book was not found!`,
//           data: req.body,
//         });
//       }
//     })
//     .catch((err) => {
//       res.status(500).json({
//         message: err.message || "Some error occurred while deleting the book.",
//         data: null,
//       });
//     });
// };

// BONUS ===> Mengambil data sesuai id yang dikirimkan
// exports.findOne = (req, res) => {
//   Book.findByPk(req.params.id)
//     .then((book) => {
//       res.json({
//         message: "Book retrieved successfully.",
//         data: book,
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         message: err.message || "Some error occurred while retrieving book.",
//         data: null,
//       });
//     });
// };
