const { validationResult } = require("express-validator");
const db = require("../../../../../models");
const ResponseCode = require("../../../../core/utils/ResponseCode");
const Pengajuan = db.pengajuans;
const Vendor = db.vendors;

// READ: menampilkan atau mengambil semua data sesuai model dari database
exports.findAll = async (req, res) => {
  const data = await Pengajuan.findAll({
    include: [
      {
        model: Vendor,
        as: "vendor",
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
      harga: 0,
    });

    return ResponseCode.successPost(
      req,
      res,
      "Data Pengajuan Berhasil Ditambahkan"
    );
  } catch (error) {
    return ResponseCode.errorPost(req, res, error);
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
    const response = await Pengajuan.update(
      {
        user_id: data.user_id,
        vendor_id: data.vendor_id,
        pengajuan_name: data.pengajuan_name,
        tanggal_pengajuan: data.tanggal_pengajuan,
        tanggal_mulai: data.tanggal_mulai,
        tangggal_selesai: data.tangggal_selesai,
        deskripsi: data.deskripsi,
        komentar: data.komentar,
        prioritas: data.prioritas,
        status: data.status,
        harga: data.harga,
      },
      {
        where: {
          id: id,
        },
      }
    );
    //

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
