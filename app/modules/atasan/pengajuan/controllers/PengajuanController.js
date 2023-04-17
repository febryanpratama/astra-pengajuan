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

// READ: menampilkan atau mengambil semua data sesuai model dari database
exports.findAll = async (req, res) => {
  // return ResponseCode.successGet(req, res, "Data Pengajuan", "xx");

  // console.log(
  //   "req.params.page: " +
  //     req.query.page +
  //     " req.query.limit: " +
  //     req.query.limit
  // );
  console.log("findall")

  let limit = parseInt(req.query.limit) || 10;
  let offset = parseInt(req.query.page) || 0;

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
        departemen: req.app.locals.credential.departemen,
      },
      limit: limit,
      offset: offset,
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

    // return ResponseCode.successGet(req, res, "Data Pengajuan", data);
  } catch (err) {
    console.log(err);
    return ResponseCode.errorPost(req, res, err.response);
  }

  // return ResponseCode.successGet(req, res, "Data Pengajuan", data);
};

exports.detail = async (req, res) => {
  const id = req.params.id;
  console.log("detail")

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
  },{
    where: {
      id: id,
    },
  });
  // console.log(response);

  if (response == null) {
    return ResponseCode.errorPost(req, res, "Detail tidak ditemukan");
  }
  return ResponseCode.successGet(req, res, "Data Pengajuan", response);
};

exports.komentar = async (req, res) => {
  const id = req.params.id;
  let data = req.body;

  console.log("komentar")

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
};

exports.report = async (req, res) => {
  const id = req.params.id;
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
      where: {
        tanggal_pengajuan: {
          [Op.between]: [startedDate, endDate],
        },
        departemen: req.app.locals.credential.departemen,
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

  var firstday = new Date(start.setDate(first))
  var lastday = new Date(start.setDate(last))

  // return ResponseCode.successGet(req, res, firstday);
  const startedDate = new Date(data.tanggal_mulai + " 00:00:00");
  const endDate = new Date(data.tanggal_selesai + " 23:59:59");
  // return ResponseCode.successGet(req, res, startedDate);

  try {
    if (data.tipe == 'total pengajuan') {
      let count = await Pengajuan.count({
        where: {
          departemen: req.app.locals.credential.departemen,
          tanggal_pengajuan:{
            [Op.between]: [firstday, lastday],
          }
        }
      }) 

      
const result = {
  tanggal_mulai: firstday,
  tanggal_selesai: lastday,
  jumlah:count
}
      
      return ResponseCode.successGet(req, res, "Jumlah Semua data Pengajuan", result);
    }

    if(data.tipe == 'pengajuan diterima'){
      let count = await Pengajuan.count({
        where: {
          status: 'Proses Vendor',
          departemen: req.app.locals.credential.departemen,
          tanggal_pengajuan:{
            [Op.between]: [firstday, lastday],
          }
        }
      }) 

      const result = {
        tanggal_mulai: firstday,
        tanggal_selesai: lastday,
        jumlah:count
      }

      return ResponseCode.successGet(req, res, "Jumlah Data Diterima Admin", result);
    }

    if(data.tipe == 'pengajuan ditinjau'){
      let count = await Pengajuan.count({
        where: {
          status: 'Verifikasi Admin',
          departemen: req.app.locals.credential.departemen,
          tanggal_pengajuan:{
            [Op.between]: [firstday, lastday],
          }
        }
      }) 

      const result = {
        tanggal_mulai: firstday,
        tanggal_selesai: lastday,
        jumlah:count
      }

      return ResponseCode.successGet(req, res, "Jumlah Data Ditinjau Admin", result);
    }
    if(data.tipe == 'ditolak'){
      let count = await Pengajuan.count({
        where: {
          status: 'Ditolak',
          departemen: req.app.locals.credential.departemen,
          tanggal_pengajuan:{
            [Op.between]: [firstday, lastday],
          }
        }
      }) 

      const result = {
        tanggal_mulai: firstday,
        tanggal_selesai: lastday,
        jumlah:count
      }

      return ResponseCode.successGet(req, res, "Jumlah Data Ditolak Admin", result);
    }
    if(data.tipe == 'selesai'){
      let count = await Pengajuan.count({
        where: {
          status: 'Selesai',
          departemen: req.app.locals.credential.departemen,
          tanggal_pengajuan:{
            [Op.between]: [firstday, lastday],
          }
        }
      }) 

      const result = {
        tanggal_mulai: firstday,
        tanggal_selesai: lastday,
        jumlah:count
      }

      return ResponseCode.successGet(req, res, "Jumlah Data Selesai Admin", result);
    }

  } catch (err) {
    console.log(err);
    return ResponseCode.error.error(req, res, err.response);
  }
}

