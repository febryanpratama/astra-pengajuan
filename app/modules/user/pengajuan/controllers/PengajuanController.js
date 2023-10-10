// const { Axios } = require("axios");
// const axios = require("axios");
const { default: axios } = require("axios");
const { validationResult } = require("express-validator");
const db = require("../../../../../models");
const ResponseCode = require("../../../../core/utils/ResponseCode");
const { post } = require("../routes/PengajuanRoutes");
const Pengajuan = db.pengajuans;
const Vendor = db.vendors;
const Foto = db.foto;
const History = db.history;
const Rating = db.rating;

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { fromBase64 } = require("@aws-sdk/util-base64-node");
const AWS = require("@aws-sdk/client-s3");

const { Op } = require("sequelize");

// READ: menampilkan atau mengambil semua data sesuai model dari database
exports.findAll = async (req, res) => {
  try {
    let limitd = parseInt(req.query.limit) || 10;
    let offsetd = parseInt(req.query.page) || 0;

    const offset = offsetd * limitd;
    const limit = offset + limitd;

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
        user_id: req.app.locals.credential.id,
        status: {
          [Op.in]: ["Verifikasi Admin", "Proses Admin"],
        },
      },
      limit: limit,
      offset: offset,
      order: [["tanggal_pengajuan", "DESC"]],
    });

    for (let i = 0; i < data.length; i++) {
      // let datad = data[i]
      let user = await axios.post("https://asmokalbarmobile.com/api/auth/me", {
        user_id: data[i].user_id,
      });

      let dataUser = {
        nama: user.data.data.name,
        departemen: user.data.data.departemen,
      };

      data[i].dataValues.user = dataUser;
    }

    return ResponseCode.successGet(req, res, "Data Pengajuan", data);
  } catch (err) {
    console.log(err);
    return ResponseCode.errorPost(req, res, "Data Pengajuan", err);
  }
};

exports.store = async (req, res) => {
  let data = req.body;

  AWS.config.update({
    accessKeyId: "",
    secretAccessKey: "",
    region: "",
  });

  // const s3Client = new S3Client({
  //   region: "ap-southeast-2",
  //   credentials: {
  //     accessKeyId: "AKIATNRBN2NRZZPT3WGJ",
  //     secretAccessKey: "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",
  //   },
  // });
  try {
    // Check User id from asmokalbarmobile
    const checkUser = await axios.post(
      "https://asmokalbarmobile.com/api/auth/me",
      {
        user_id: req.app.locals.credential.id,
      }
    );

    // console.log(checkUser);

    if (checkUser.data.status == false) {
      return ResponseCode.errorPost(req, res, checkUser.data.message);
    }

    // return ResponseCode.successGet(req, res, checkUser.data.data);

    const response = await Pengajuan.create({
      user_id: req.app.locals.credential.id,
      pengajuan_name: data.pengajuan_name,
      tanggal_pengajuan: new Date().toDateString(),
      deskripsi: data.deskripsi,
      prioritas: data.prioritas,
      status: "Verifikasi Admin",
      departemen: req.app.locals.credential.departemen,
      // karena sudah di set
      // is_status: "Proses",
      harga: 0,
    });

    for (let i = 0; i < data.foto.length; i++) {
      const base64Data = data.foto[i].image;

      // Convert base64 to binary buffer
      // const binaryData = Buffer.from(base64Data, 'base64');
      const binaryData = Buffer.from(
        base64Data.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      //  const binaryData = fromBase64(base64Data);

      // return res.json({binaryData})

      const type = base64Data.split(";")[0].split("/")[1];

      const fileName =
        new Date().toISOString().replace(/[-:.]/g, "") + "." + type;
      // Set up S3 upload parameters
      // const params = {
      //   Bucket: "astrapengajuan",
      //   Key: fileName,
      //   Body: binaryData,
      //   ACL: "public-read",
      //   //     ContentEncoding: 'base64',
      //   ContentType: "image/" + type,
      //   ContentEncoding: "base64",
      // };

      const params = {
        Bucket: "astrapengajuan",
        Key: fileName,
        Body: binaryData, // Assuming req.body contains the file data
      };
      await s3.send(new PutObjectCommand(params));

      const command = new PutObjectCommand(params);

      const foto = await Foto.create({
        pengajuan_id: response.id,
        file_photo: command,
        is_in: "in",
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
      });

      // console.log(fileUrl+"fileurl")
    }

    // tambah lg nanti
    // console.log(response);
    // history ini maksudnya log aktivitas

    const history = await db.history.create({
      pengajuan_id: response.id,
      tanggal: new Date().toDateString(),
      deskripsi: "Membuat Pengajuan Baru",
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString(),
    });

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
      {
        model: Rating,
        as: "detail_rating",
      },
    ],
    where: {
      id: id,
    },
  });
  // console.log(response);/

  let user = await axios.post("https://asmokalbarmobile.com/api/auth/me", {
    user_id: response.user_id,
  });

  let dataUser = {
    nama: user.data.data.name,
    departemen: user.data.data.departemen,
  };

  response.dataValues.user = dataUser;

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

    const history = await db.history.create({
      pengajuan_id: response.id,
      tanggal: new Date().toDateString(),
      deskripsi: "Menghapus / Membatalkan Data Pengajuan ",
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString(),
    });

    return ResponseCode.successPost(req, res, "Data Pengajuan Berhasil Diubah");
  } catch (err) {
    //
    console.log(err);
    return ResponseCode.errorPost(req, res, err.response);
    // console.log(err);
  }
};

exports.rating = async (req, res) => {
  const id = req.params.id;
  let data = req.body;

  try {
    // logika cek id pengajuan
    const cekpengajuan = await Pengajuan.findOne({
      where: { status: "Selesai", id },
    });

    if (cekpengajuan == null) {
      return ResponseCode.errorPost(req, res, "Pengajuan tidak ditemukan");
    }

    const cekrating = await Rating.findOne({
      where: { pengajuan_id: id },
    });

    if (cekrating != null) {
      return ResponseCode.errorPost(req, res, "Pengajuan sudah di rating");
    }

    const response = await Rating.create({
      pengajuan_id: id,
      user_id: req.app.locals.credential.id,
      vendor_id: cekpengajuan.vendor_id,
      rating: data.rating,
    });

    console.log(response);
    const history = await db.history.create({
      pengajuan_id: response.id,
      tanggal: new Date().toDateString(),
      deskripsi: "Pengguna Berhasil Memberikan Rating",
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString(),
    });

    return ResponseCode.successPost(req, res, "Data Pengajuan Berhasil Diubah");
  } catch (err) {
    //
    console.log(err);
    return ResponseCode.errorPost(req, res, err.response);
    // console.log(err);
  }
};
//admin terima tolak
// };
exports.terimatolak = async (req, res) => {
  const id = req.params.id;
  let data = req.body;
  try {
    if (data.is_status == "Tolak") {
      const tolakPengajuan = await Pengajuan.update(
        {
          status: "Tolak",
        },
        {
          where: {
            id,
          },
        }
      );
    }

    if (data.is_status != "Tolak") {
      const tolakPengajuan = await Pengajuan.update(
        {
          status: "Proses Admin",
        },
        {
          where: {
            id,
          },
        }
      );
    }
    return ResponseCode.successPost(req, res, "Data Pengajuan Berhasil Diubah");
  } catch (err) {
    //
    console.log(err);
    return ResponseCode.errorPost(req, res, err.response);
    // console.log(err);
  }
};

exports.report = async (req, res) => {
  const id = req.app.locals.credential.id;
  let data = req.body;

  // console.log()
  // const data = req.query;

  // return ResponseCode.successGet(req, res, "Data Pengajuan", data);
  // console.log("data");
  // INI BEDA
  const startedDate = new Date(data.tanggal_mulai + " 00:00:00");
  const endDate = new Date(data.tanggal_selesai + " 23:59:59");
  // return ResponseCode.successGet(req, res, startedDate);

  try {
    const cekreport = await Pengajuan.findAll({
      include: [
        {
          model: Rating,
          as: "detail_rating",
        },
      ],
      where: {
        user_id: req.app.locals.credential.id,
        tanggal_pengajuan: {
          [Op.between]: [startedDate, endDate],
        },
        status: {
          [Op.in]: ["Ditolak", "Selesai"],
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

    for (let i = 0; i < cekreport.length; i++) {
      let user = await axios.post("https://asmokalbarmobile.com/api/auth/me", {
        user_id: cekreport[i].user_id,
      });

      let dataUser = {
        nama: user.data.data.name,
        departemen: user.data.data.departemen,
      };

      cekreport[i].dataValues.user = dataUser;
    }

    const response = await Pengajuan.findAll({
      tanggal_pengajuan: {
        [Op.between]: [data.tanggal_mulai, data.tanggal_selesai],
      },
      where: {
        id: id,
      },
    });
    return ResponseCode.successGet(
      req,
      res,
      "Data Pengajuan Report Ditemukan ",
      cekreport
    );
  } catch (err) {
    console.log(err);
    return ResponseCode.error.error(req, res, err.response);
  }
};

exports.dashboardCount = async (req, res) => {
  let data = req.body;

  // console.log()
  // const data = req.query;

  // return ResponseCode.successGet(req, res, "Data Pengajuan", data);
  // console.log("data");
  // INI BEDA
  const start = new Date();
  var first = start.getDate() - start.getDay();
  var last = first + 6;

  var firstday = new Date(start.setDate(first));
  var lastday = new Date(start.setDate(last));

  // return ResponseCode.successGet(req, res, firstday);
  const startedDate = new Date(data.tanggal_mulai + " 00:00:00");
  const endDate = new Date(data.tanggal_selesai + " 23:59:59");
  // return ResponseCode.successGet(req, res, startedDate);

  if (!data.tipe) {
    return ResponseCode.errorPost(req, res, "Tipe tidak boleh kosong");
  }
  try {
    if (data.tipe == "total pengajuan") {
      let count = await Pengajuan.count({
        where: {
          user_id: req.app.locals.credential.id,
          tanggal_pengajuan: {
            [Op.between]: [firstday, lastday],
          },
        },
      });

      const result = {
        tanggal_mulai: firstday,
        tanggal_selesai: lastday,
        jumlah: count,
      };

      return ResponseCode.successGet(
        req,
        res,
        "Jumlah Semua data Pengajuan",
        result
      );
    }

    if (data.tipe == "pengajuan diterima") {
      let count = await Pengajuan.count({
        where: {
          status: "Proses Vendor",
          user_id: req.app.locals.credential.id,
          tanggal_pengajuan: {
            [Op.between]: [firstday, lastday],
          },
        },
      });

      const result = {
        tanggal_mulai: firstday,
        tanggal_selesai: lastday,
        jumlah: count,
      };

      return ResponseCode.successGet(
        req,
        res,
        "Jumlah Data Diterima Admin",
        result
      );
    }

    if (data.tipe == "pengajuan ditinjau") {
      let count = await Pengajuan.count({
        where: {
          status: "Verifikasi Admin",
          user_id: req.app.locals.credential.id,
          tanggal_pengajuan: {
            [Op.between]: [firstday, lastday],
          },
        },
      });

      const result = {
        tanggal_mulai: firstday,
        tanggal_selesai: lastday,
        jumlah: count,
      };

      return ResponseCode.successGet(
        req,
        res,
        "Jumlah Data Ditinjau Admin",
        result
      );
    }
    if (data.tipe == "ditolak") {
      let count = await Pengajuan.count({
        where: {
          status: "Ditolak",
          user_id: req.app.locals.credential.id,
          tanggal_pengajuan: {
            [Op.between]: [firstday, lastday],
          },
        },
      });

      const result = {
        tanggal_mulai: firstday,
        tanggal_selesai: lastday,
        jumlah: count,
      };

      return ResponseCode.successGet(
        req,
        res,
        "Jumlah Data Ditolak Admin",
        result
      );
    }
    if (data.tipe == "selesai") {
      let count = await Pengajuan.count({
        where: {
          status: "Selesai",
          user_id: req.app.locals.credential.id,
          tanggal_pengajuan: {
            [Op.between]: [firstday, lastday],
          },
        },
      });

      const result = {
        tanggal_mulai: firstday,
        tanggal_selesai: lastday,
        jumlah: count,
      };

      return ResponseCode.successGet(
        req,
        res,
        "Jumlah Data Selesai Admin",
        result
      );
    }
  } catch (err) {
    console.log(err);
    return ResponseCode.error.error(req, res, err.response);
  }
};
