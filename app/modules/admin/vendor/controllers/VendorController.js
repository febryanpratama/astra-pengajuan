const { validationResult } = require("express-validator");
const db = require("../../../../../models");
const ResponseCode = require("../../../../core/utils/ResponseCode");
const { Op } = require("sequelize");
// const { post, use } = require("../routes/VendorRoutes");
const Vendor = db.vendors;
const Pengajuan = db.pengajuans;

// READ: menampilkan atau mengambil semua data sesuai model dari database
exports.findAll = async (req, res) => {
  const body = req.body


  const data = await Vendor.findAll({
    where: {
      is_deleted: null,
    },
  });


// return ResponseCode.successGet(req, res, "Data Vendor", lastDay);

  for(i=0; i<data.length; i++){
    const countAll = await Pengajuan.count({
      where: {
        vendor_id: data[i].id,
        is_deleted: null,
      },
    })
    data[i].dataValues.countAll = countAll

    const countPoor = await Pengajuan.count({
      where: {
        vendor_id: data[i].id,
        is_deleted: null,
        rating: "Poor",
      },
    })
    data[i].dataValues.countPoor = countPoor

    const countVeryPoor = await Pengajuan.count({
      where: {
        vendor_id: data[i].id,
        is_deleted: null,
        rating: "Very Poor",
      },
    })
    data[i].dataValues.countVeryPoor = countVeryPoor

    const countGood = await Pengajuan.count({
      where: {
        vendor_id: data[i].id,
        is_deleted: null,
        rating: "Good",
      },
    })

    data[i].dataValues.countGood = countGood

    const countVeryGood = await Pengajuan.count({
      where: {
        vendor_id: data[i].id,
        is_deleted: null,
        rating: "Very Good",
      },
    })
    data[i].dataValues.countVeryGood = countVeryGood
  }

  return ResponseCode.successGet(req, res, "Data Vendor", data);
};
exports.findList = async (req, res) => {
  const body = req.body

  if(!body.year){
    return ResponseCode.errorPost(req, res, "Tahun harus diisi")
  }

  const data = await Vendor.findAll({
    where: {
      is_deleted: null,
    },
  });

  var firstDay = new Date(body.year, 1-1, 1);
  var lastDay = new Date(body.year, 12, 0);

// return ResponseCode.successGet(req, res, "Data Vendor", lastDay);

  for(i=0; i<data.length; i++){
    const countAll = await Pengajuan.count({
      where: {
        vendor_id: data[i].id,
        is_deleted: null,
        tanggal_pengajuan: {
          [Op.between]: [firstDay, lastDay]
        }
      },
    })
    data[i].dataValues.countAll = countAll

    const countPoor = await Pengajuan.count({
      where: {
        vendor_id: data[i].id,
        is_deleted: null,
        rating: "Poor",
        tanggal_pengajuan: {
          [Op.between]: [firstDay, lastDay]
        }
      },
    })
    data[i].dataValues.countPoor = countPoor

    const countVeryPoor = await Pengajuan.count({
      where: {
        vendor_id: data[i].id,
        is_deleted: null,
        rating: "Very Poor",
        tanggal_pengajuan: {
          [Op.between]: [firstDay, lastDay]
        }
      },
    })
    data[i].dataValues.countVeryPoor = countVeryPoor

    const countGood = await Pengajuan.count({
      where: {
        vendor_id: data[i].id,
        is_deleted: null,
        rating: "Good",
        tanggal_pengajuan: {
          [Op.between]: [firstDay, lastDay]
        }
      },
    })

    data[i].dataValues.countGood = countGood

    const countVeryGood = await Pengajuan.count({
      where: {
        vendor_id: data[i].id,
        is_deleted: null,
        rating: "Very Good",
        tanggal_pengajuan: {
          [Op.between]: [firstDay, lastDay]
        }
      },
    })
    data[i].dataValues.countVeryGood = countVeryGood
  }

  return ResponseCode.successGet(req, res, "Data Vendor", data);
};

exports.store = async (req, res) => {
  let data = req.body;

  const response = await Vendor.create({
    nama_vendor: data.nama_vendor,
    pemilik_vendor: data.pemilik_vendor,
    no_vendor : data.no_vendor == null ? null : data.no_vendor,
    telpon: data.telpon,
    alamat: data.alamat,
  });

  const history = await db.history.create({
    pengajuan_id: response.id,
    tanggal: new Date().toDateString(),
    deskripsi: "Membuat Vendor Baru",
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
  });
  return ResponseCode.successPost(req, res, "Data Vendor Berhasil Ditambahkan");
};

exports.detail = async (req, res) => {
  const id = req.params.id;

  const response = await Vendor.findOne({
    include: [
      {
        model: Pengajuan,
        as: "Pengajuan",
      },
      //   order: [
      //     ['createAt', 'DESC']
      // ],
    ],

    where: {
      id: id,
    },
  });
  console.log(response);

  if (response == null) {
    return ResponseCode.errorPost(req, res, "Data vendor tidak ditemukan");
  }
  return ResponseCode.successGet(req, res, "Data Vendor", response);
};
exports.update = async (req, res) => {
  const id = req.params.id;
  let data = req.body;

  try {
    const response = await Vendor.update(
      {
        nama_vendor: data.nama_vendor,
        pemilik_vendor: data.pemilik_vendor,
        no_vendor : data.no_vendor == null ? null : data.no_vendor,
        telpon: data.telpon,
        alamat: data.alamat,
      },
      {
        where: {
          id: id,
        },
      }
    );

    return ResponseCode.successPost(req, res, "Data Vendor Berhasil Diubah");
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
    const response = await Vendor.update(
      {
        is_deleted: new Date().toLocaleDateString(),
      },
      {
        where: {
          id: id,
        },
      }
    );

    return ResponseCode.successPost(req, res, "Data Vendor Berhasil Dihapus");
  } catch (err) {
    //
    console.log(err);
    return ResponseCode.errorPost(req, res, err.response);
    // console.log(err);
  }
};

exports.jumlah = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await Pengajuan.count({
      where: { vendor_id: id },
    });

    return ResponseCode.successGet(
      req,
      res,
      "Sukses Mengambil Jumlah data pengajuan dari Vendor",
      data
    );
  } catch (error) {
    // console.log();

    return ResponseCode.errorPost(req, res, error.message);
  }
};
