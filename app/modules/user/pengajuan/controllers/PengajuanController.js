// const { Axios } = require("axios");
// const axios = require("axios");
const { default: axios } = require("axios");
const { validationResult } = require("express-validator");
const db = require("../../../../../models");
const ResponseCode = require("../../../../core/utils/ResponseCode");
const Pengajuan = db.pengajuans;
const Vendor = db.vendors;
const Foto = db.foto;

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
    ],
    where: {
      is_deleted: null,
    },
  });

  // console.log(d)
  return ResponseCode.successGet(req, res, "Data Pengajuan", data);
};

exports.store = async (req, res) => {
  let data = req.body;

  // console.log(checkUser);
  try {
    // Check User id from asmokalbarmobile
    const checkUser = await axios.post(
      "https://asmokalbarmobile.com/api/auth/me",
      {
        user_id: data.user_id,
      }
    );

    console.log(checkUser);

    if (checkUser.data.status == false) {
      return ResponseCode.errorPost(req, res, checkUser.data.message);
    }

    // return ResponseCode.successGet(req, res, checkUser.data.data);

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

    //foto

    data.foto.forEach((element) => {
      // check dulu base64nya:image validasi

      const checkImage = element["image"];

      const foto = Foto.create({
        pengajuan_id: response.id,
        file_photo: element["image"],
        createAt: new Date().toDateString(),
        updateAt: new Date().toDateString(),
      });
    });

    // tambah lg nanti
    // console.log(response);
    const history = await db.history.create({
      pengajuan_id: response.id,
      tanggal: new Date().toDateString(),
      deskripsi: "Membuat Pengajuan Baru",
      createAt: new Date().toDateString(),
      updateAt: new Date().toDateString(),
    });

    return ResponseCode.successPost(
      req,
      res,
      "Data Pengajuan Berhasil Ditambahkan"
    );
  } catch (error) {
    // console.log(error);
    return ResponseCode.errorPost(req, res, error.data);
  }
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
//
