const db = require("../../../core/models");
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
  await Vendor.findAll()
    .then((vendors) => {
      res.json({
        message: "Books retrieved successfully.",
        data: vendors,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message || "Some error occurred while retrieving books.",
        data: null,
      });
    });
};

exports.getAll = async (req, res) => {
  const data = await Vendor.findAll({});

  return res.json({
    data: "kosong",
  });
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
