const { validationResult } = require("express-validator");
const db = require("../../../../../models");
const ResponseCode = require("../../../../core/utils/ResponseCode");
const { post, use } = require("../routes/PengajuanRoutes");
const Pengajuan = db.pengajuans;
const Vendor = db.vendors;
const Foto = db.foto;
const History = db.history;

const { Op } = require("sequelize");

// const fs = require("fs");

// READ: menampilkan atau mengambil semua data sesuai model dari database
exports.findAll = async (req, res) => {
  // return ResponseCode.successGet(req, res, "Data Pengajuan", "xx");

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

exports.store = async (req, res) => {
  let data = req.body;

  // return ResponseCode.successGet(req, res, "Data Pengajuan", data);

  // return ResponseCode.successGet(req, res, "Data Pengajuan", "kontill");
  try {
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

    const response = await Pengajuan.create({
      user_id: data.user_id,
      pengajuan_name: data.pengajuan_name,
      tanggal_pengajuan: new Date().toDateString(),
      deskripsi: data.deskripsi,
      prioritas: data.prioritas,
      status: "Verifikasi Admin",
      // karena sudah di set
      harga: 0,
    });

    data.foto.forEach((element) => {
      const checkImage = element["image"];

      const foto = Foto.create({
        pengajuan_id: response.id,
        file_photo: element["image"],
        createAt: new Date().toDateString(),
        updateAt: new Date().toDateString(),
      });
    });

    const respHistory = await History.create({
      pengajuan_id: response.id,
      tanggal: new Date().toDateString(),
      deskripsi: "Membuat Pengajuan Baru",
      // createAt: new Date().toDateString(),
    });

    // store foto

    return ResponseCode.successPost(
      req,
      res,
      "Data Pengajuan Berhasil Ditambahkan"
    );
  } catch (error) {
    console.log(error);
    return ResponseCode.errorPost(req, res, error);
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

  // untuk tes req params id req
  const { vendor, tanggal_mulai, tanggal_selesai } = req.body;
  // return ResponseCode.successGet(req, res, "hjmtjtj", {
  //   ID: id,
  //   tanggal_mulai: tanggal_mulai,
  //   Tanggal_selesai: tanggal_selesai,
  // });

  try {
    const dataPengajuan = await Pengajuan.findOne({
      where: {
        id: id,
        Tanggal_mulai: tanggal_mulai,
        Tanggal_selesai: tanggal_selesai,
      },
    });

    if (dataPengajuan.status == "Verifikasi Admin") {
      const response = await Pengajuan.update(
        {
          status: "Proses Admin",
          Tanggal_mulai: tanggal_mulai,
          Tanggal_selesai: tanggal_selesai,
        },
        {
          where: {
            id: id,
            Tanggal_mulai: tanggal_mulai,
            Tanggal_selesai: tanggal_selesai,
          },
        }
      );

      return ResponseCode.successPost(
        req,
        res,
        "Data Pengajuan Berhasil DiHapus"
      );
    }

    if (dataPengajuan.status == "Proses Admin") {
      const response = await Pengajuan.update(
        {
          status: "Proses Vendor",
          Tanggal_mulai: tanggal_mulai,
          Tanggal_selesai: tanggal_selesai,
        },
        {
          where: {
            id: id,
            Tanggal_mulai: tanggal_mulai,
            Tanggal_selesai: tanggal_selesai,
          },
        }
      );
    }

    if (dataPengajuan.status == "Proses Vendor") {
      const response = await Pengajuan.update(
        {
          status: "Selesai",
          Tanggal_mulai: tanggal_mulai,
          Tanggal_selesai: tanggal_selesai,
        },
        {
          where: {
            id: id,
            Tanggal_mulai: tanggal_mulai,
            Tanggal_selesai: tanggal_selesai,
          },
        }
      );
    }
  } catch (err) {}
};

exports.tolak = async (req, res) => {
  const id = req.params.id;
  // const data = req.body;

  // data.pengajuan_name
  try {
    const response = await Pengajuan.update(
      {
        //tanggal mulai tanggal selesai
        status: "Ditolak",
        komentar: data.komentar,
      },
      {
        where: {
          id: id,
        },
      }
    );

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
