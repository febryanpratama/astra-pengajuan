const { validationResult } = require("express-validator");
const db = require("../../../../../models");
const ResponseCode = require("../../../../core/utils/ResponseCode");
const { post } = require("../routes/PengajuanRoutes");
const Pengajuan = db.pengajuans;
const Vendor = db.vendors;
const Foto = db.foto;
const History = db.history;

const { Op } = require("sequelize");
const { default: axios } = require("axios");
// const vendorModel = require("../../../../../models/vendor.model");

// const fs = require("fs");

// READ: menampilkan atau mengambil semua data sesuai model dari database
exports.findAll = async (req, res) => {
  // return ResponseCo
  // limit page
  console.log(
    "req.params.page: " +
      req.query.page +
      " req.query.limit: " +
      req.query.limit
  );

  let limit = parseInt(req.query.limit) || 10;
  let offset = parseInt(req.query.page) || 0;

  // return ResponseCode.successGet(req, res, "Data Pengajuan", limit);
  // console.log("page: " + page + " limit: " + limit + " offset: " + offset);
  try {
    const data = await Pengajuan.findAll({
      include: [
        {
          model: Vendor,
          as: "vendor",
        },
        // {
        //   model: Foto,
        //   as: "foto",
        // },
        // {
        //   model: History,
        //   as: "aktivitas",
        // },
      ],
      where: {
        is_deleted: null,
      },
      limit: limit,
      offset: offset,
      // order: [["id", "DESC"]],
    });

    for(let i = 0; i < data.length; i++){
    // let datad = data[i]
    let user = await axios.post("https://asmokalbarmobile.com/api/auth/me", {
      user_id: data[i].user_id
    })

    let dataUser = {
      nama: user.data.data.name,
      departemen: user.data.data.departemen
    }

    data[i].dataValues.user = dataUser
  }

  return ResponseCode.successGet(req, res, "Data Pengajuan", data);
  } catch (error) {
    console.log(error)
    return ResponseCode.errorPost(req, res, error);
  }
};

// exports.store = async (req, res) => {
//   let data = req.body;

// return ResponseCode.successGet(req, res, "Data Pengajuan", data);

// return ResponseCode.successGet(req, res, "Data Pengajuan", "kontill");
// try {
// const getVendor = await db.vendors.findOne({
//   where: {
//     id: data.vendor_id,
//   },
// });
// console.log(getVendor);
// if (getVendor == null) {
//   return ResponseCode.errorPost(req, res, "Vendor tidak ditemukan");
// }

// return Response Code.successPost(req, res, "Vendor ditemukan");

//     const response = await Pengajuan.create({
//       user_id: data.user_id,
//       pengajuan_name: data.pengajuan_name,
//       tanggal_pengajuan: new Date().toDateString(),
//       deskripsi: data.deskripsi,
//       prioritas: data.prioritas,
//       status: "Verifikasi Admin",
//       // karena sudah di set
//       harga: 0,
//     });

//     data.foto.forEach((element) => {
//       const checkImage = element["image"];

//       const foto = Foto.create({
//         pengajuan_id: response.id,
//         file_photo: element["image"],
//         createAt: new Date().toDateString(),
//         updateAt: new Date().toDateString(),
//       });
//     });

//     const respHistory = await History.create({
//       pengajuan_id: response.id,
//       tanggal: new Date().toDateString(),
//       deskripsi: "Membuat Pengajuan Baru",
// createAt: new Date().toDateString(),
//     });

// store foto

//     return ResponseCode.successPost(
//       req,
//       res,
//       "Data Pengajuan Berhasil Ditambahkan"
//     );
//   } catch (error) {
//     console.log(error);
//     return ResponseCode.errorPost(req, res, error);
//   }
// };

exports.detail = async (req, res) => {
  const id = req.params.id;

  const response = await Pengajuan.findOne({
    include: [
      {
        model: Vendor,
        as: "vendor",
      },
      {
        model: Foto,
        as: "foto",
      },
      {
        model: History,
        as: "aktivitas",
      },
    ],
    where: {
      id: id,
    },
  });
  console.log(response);

  if (response == null) {
    return ResponseCode.errorPost(req, res, "Detail tidak ditemukan");
  }
  return ResponseCode.successGet(req, res, "Data Pengajuan", response);
};

exports.update = async (req, res) => {
  const id = req.params.id;
  let data = req.body;

  try {
    // logika cek id pengajuan
    const cekpengajuan = await Pengajuan.findOne({
      //join table HistoryTable
      where: { status: "Verifikasi Admin", id },
    });
    if (cekpengajuan == null) {
      return ResponseCode.errorPost(req, res, "Pengajuan tidak ditemukan");
    }

    const response = await Pengajuan.update(
      {
        user_id: data.user_id,
        pengajuan_name: data.pengajuan_name,
        deskripsi: data.deskripsi,
        prioritas: data.prioritas,
      },
      {
        where: {
          id: id,
        },
      }
    );
    return ResponseCode.successPost(req, res, "Data Pengajuan Berhasil Diubah");
  } catch (err) {
    //
    console.log(err);
    return ResponseCode.errorPost(req, res, err.response);
    // console.log(err);
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const response = await Pengajuan.update(
      {
        is_deleted: new Date(),
      },
      {
        where: {
          id: id,
        },
      }
    );

    return ResponseCode.successPost(
      req,
      res,
      "Data Pengajuan Berhasil DiHapus"
    );
  } catch (err) {
    //
    console.log(err);
    return ResponseCode.errorPost(req, res, err.response);
    // console.log(err);
  }
};

exports.terima = async (req, res) => {
  const id = req.params.id;
  let data = req.body;

  try {
    const dataPengajuan = await Pengajuan.findOne({
      where: {
        id: id,
      },
    });


    if(!dataPengajuan){
      return ResponseCode.errorPost(req, res, "Pengajuan tidak ditemukan");
    }

    
    if (data.tipe == "Proses Admin") {
      // console.log("proses admin")
      const dataVendor = await Vendor.findOne({
          where: {
            id: data.vendor_id,
          },
        })

    // return ResponseCode.successGet(req, res, "Data Pengajuan", dataVendor);

      if(!dataVendor){
        return ResponseCode.errorPost(req, res, "Vendor tidak ditemukan");
      }

      const response = await Pengajuan.update(
        {
          status: "Proses Admin",
          vendor_id: data.vendor_id,
          tanggal_mulai: data.tanggal_mulai,
          tanggal_selesai: data.tanggal_selesai,
          harga: data.harga,
        },
        {
          where: {
            id: id,
          },
        }
      );

      const history = await History.create({
        pengajuan_id: response.id,
        tanggal: new Date().toDateString(),
        deskripsi: "Pengajuan Diterima oleh Admin",
        createAt: new Date().toDateString(),
        updateAt: new Date().toDateString(),
      });

      return ResponseCode.successPost(
        req,
        res,
        "Data Pengajuan Berhasil Diproses oleh Admin"
      );
    }


    if (data.tipe == "Selesai") {
      // console.log("selesai")
      const response = await Pengajuan.update(
        {
          status: "Selesai",
        },
        {
          where: {
            id: id,
          },
        }
      );
      const respHistory = await History.create({
        pengajuan_id: response.id,
        tanggal: new Date().toDateString(),
        deskripsi: "Pengajuan Telah Diselesaikan",
        createAt: new Date().toDateString(),
        updateAt: new Date().toDateString(),
      });
      // return ResponseCode.successPost(req,res,"Data Pengajuan telah Selesai",response);
      return ResponseCode.successPost(
        req,
        res,
        " Data Pengajuan telah Selesai",
        response
      );
    }
  } catch (err) {
    console.log(err);
    return ResponseCode.errorPost(req, res, err);
  }
};

exports.tolak = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  // console.log(data)

  // data.pengajuan_name
  try {
    const response = await Pengajuan.update(
      {
        status: "Ditolak",
        // komentar: data.komentar,
      },
      {
        where: {
          id: id,
        },
      }
    );

    const respHistory = await History.create({
      pengajuan_id: id,
      tanggal: new Date().toDateString(),
      deskripsi: "Pengajuan Ditolak",
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString(),
    });

    return ResponseCode.successPost(req, res, "Data Pengajuan DiTolak");
  } catch (err) {
    console.log(err);
    return ResponseCode.errorPost(req, res, err.response);
  }
};

exports.report = async (req, res) => {
  const id = req.params.id;
  let data = req.body;

  // console.log("data");
  // INI BEDA
  const startedDate = new Date(data.tanggal_mulai + " 00:00:00");
  const endDate = new Date(data.tanggal_selesai + " 23:59:59");
  // return ResponseCode.successGet(req, res, startedDate);

  try {
    const cekreport = await Pengajuan.findAll({
      where: {
        tanggal_pengajuan: {
          [Op.between]: [data.tanggal_mulai, data.tanggal_selesai],
        },
      },
    });

    // return ResponseCode.successGet(req, res, "Data", cekreport);
    if (cekreport == null) {
      return ResponseCode.successGet(
        req,
        res,
        "Data Pengajuan Report tidak ditemukan"
      );
    }
    // const response = await Pengajuan.findAll({
    //   tanggal_pengajuan: {
    //     [Op.between]: [data.tanggal_mulai, data.tanggal_selesai],
    //   },
    //   where: {
    //     id: id,
    //   },
    // });
    return ResponseCode.successGet(
      req,
      res,
      "Data Pengajuan Report Ditemukan ",
      cekreport
    );
  } catch (err) {
    console.log(err);
    return ResponseCode.error.errorPost(req, res, err.response);
  }
};

exports.jumlah = async (req, res) => {
  const id = req.params.id;
  // let data = req.body;

  try {
    const dataPengajuan = await Pengajuan.count({
      where: {
        // vendors_id: id,
        pengajuan_id: id,
        // // status: "Ditolak",
      },
    });
    return ResponseCode.successGet(
      req,
      res,
      "Sukses Mengambil jumlah semua data Pengajuan dan Vendor",
      data
    );
  } catch (error) {
    // console.log();
    return ResponseCode.errorPost(req, res, error.response);
  }
};
