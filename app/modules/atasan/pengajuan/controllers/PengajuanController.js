const { validationResult } = require("express-validator");
const db = require("../../../../../models");
const ResponseCode = require("../../../../core/utils/ResponseCode");
const { post } = require("../routes/PengajuanRoutes");
const Pengajuan = db.pengajuans;
const Vendor = db.vendors;
const Foto = db.foto;
const History = db.history;

const { Op } = require("sequelize");

// READ: menampilkan atau mengambil semua data sesuai model dari database
exports.findAll = async (req, res) => {
  const data = await Pengajuan.findAll({
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
      is_deleted: null,
    },
  });

  return ResponseCode.successGet(req, res, "Data Pengajuan", data);
};

exports.detail = async (req, res) => {
  const id = req.params.id;

  const response = await Pengajuan.findOne({
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

exports.komentar = async (req, res) => {
  const id = req.params.id;
  let data = req.body;

  const response = await Pengajuan.update(
    {
      komentar: data.komentar,
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
    "Komentar Pengajuan Berhasil Ditambahkan"
  );
  //
  // console.log(err);
  // return ResponseCode.errorPost(req, res, err.response);
  // // console.log(err);
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
