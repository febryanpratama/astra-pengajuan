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
  let tmulai = req.query.tanggal_mulai
  let tselesai = req.query.tanggal_selesai

  const startedDate = new Date(tmulai + " 00:00:00");
  const endDate = new Date(tselesai + " 23:59:59");

  let limitd = parseInt(req.query.limit) || 10;
  let offsetd = parseInt(req.query.page) || 0;

  const offset = offsetd * limitd
  const limit = offset + limitd

  // console.log(tmulai);

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
        tanggal_pengajuan: {
          [Op.between]: [startedDate, endDate],
        },
        is_deleted: null,
      },
      limit: limit,
      offset: offset,
      order: [['tanggal_pengajuan', 'DESC']]
      // order: [["id", "DESC"]],
    });

    for(let i = 0; i < data.length; i++){
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
  // console.log(response);
  let user = await axios.post("https://asmokalbarmobile.com/api/auth/me", {
    user_id: response.user_id
  })

  let dataUser = {
    nama: user.data.data.name,
    departemen: user.data.data.departemen
  }

  response.dataValues.user = dataUser

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
          estimasi_harga: data.estimasi_harga,
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
      if(data.file_bph == null){
        return ResponseCode.errorPost(req, res, "File BPH tidak boleh kosong");
      }

      const estimasi_selesai = dataPengajuan.tanggal_selesai
      const now = new Date()
      const timeDifference = Math.abs(estimasi_selesai.getDate() - now.getDate());
      let differentDays = timeDifference
      let stats = ""
      if(estimasi_selesai > now){

        if(differentDays >= 3){
          stats = "Very Good"
        }else if(differentDays < 3 && differentDays >= 0){
          stats = "Good"
        }
      }else{
      // return ResponseCode.successGet(req, res, "Data Pengajuan", differentDays);

        if(differentDays >= 1){
          stats = "Poor"
        }else{
          stats = "Good"
        }
      }

      const response = await Pengajuan.update(
        {
          tanggal_penyelesaian : new Date().toDateString(),
          file_bph : data.file_bph,
          rating: stats,
          status: "Selesai",
          komentar_selesai: data.komentar_selesai == null ? null : data.komentar_selesai,
          harga: data.harga
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
        "Data Pengajuan telah Selesai",
        response
      );
    }
  } catch (err) {
    // console.log(err);
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
      pengajuan_id: response.id,
      tanggal: new Date().toDateString(),
      deskripsi: "Pengajuan Ditolak oleh Admin",
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString(),
    });

    return ResponseCode.successPost(req, res, "Data Pengajuan Ditolak");
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
      include: [
        {
          model: Vendor,
          as: "vendor",
        },
      ],
      where: {
        tanggal_pengajuan: {
          [Op.between]: [startedDate, endDate],
        },
        status: {
          [Op.in]: ["Selesai", "Ditolak"]
        }
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

    for(let i = 0; i < cekreport.length; i++){
      let user = await axios.post("https://asmokalbarmobile.com/api/auth/me", {
        user_id: cekreport[i].user_id
      })

      let dataUser = {
        nama: user.data.data.name,
        departemen: user.data.data.departemen
      }

      cekreport[i].dataValues.user = dataUser
    }

    return ResponseCode.successGet(
      req,
      res,
      "Data Pengajuan Report Ditemukan ",
      cekreport
    );
  } catch (err) {
    // console.log(err);
    return ResponseCode.errorPost(req, res, err.response);
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

  if(!data.tipe){
    return ResponseCode.errorPost(req, res, "Tipe tidak boleh kosong");
  }

  try {
    if (data.tipe == 'total pengajuan') {
      let count = await Pengajuan.count({
        where: {
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
    if(data.tipe == 'vendor'){
      let count = await Vendor.count({
        where: {
          is_deleted: null,
        }
      })
      const result = {
        tanggal_mulai: '-',
        tanggal_selesai: '-',
        jumlah:count
      }

      return ResponseCode.successGet(req, res, "Jumlah Data Vendor", result);
    }



  } catch (err) {
    // console.log(err);
    return ResponseCode.error.error(req, res, err.response);
  }
}

exports.chartStatus = async (req, res) => {

  const data = req.body

  if(!data.year){
    return ResponseCode.errorPost(req, res, "Tahun tidak boleh kosong");
  }

  try{
    var firstDay = new Date(data.year, 1-1, 1);
    var lastDay = new Date(data.year, 12, 0);

    let dataVendor = await Vendor.findAll({
      where: {
        is_deleted: null
      }
    })

    // return ResponseCode.successGet(req, res, "Data Pengajuan", vendor); 
    
    // return ResponseCode.errorPost(
    //   req,
    //   res,
    //   dataVendor.length
    // )
    for(let k = 0; k < dataVendor.length; k++){

      // return ResponseCode.successGet(
      //   req,
      //   res,
      //   "Sukses Mengambil jumlah semua data Pengajuan dan Vendor",
      //   dataVendor[k].id
      // )
        let countPoor = await Pengajuan.count({
          where: {
            vendor_id: parseInt(dataVendor[k].id),
            rating: 'Poor',
            tanggal_pengajuan: {
              [Op.between]: [
                firstDay,
                lastDay,
              ],
            },
          },
        });

        let countVeryPoor = await Pengajuan.count({
          where: {
            vendor_id: parseInt(dataVendor[k].id),
            rating: 'Very Poor',
            tanggal_pengajuan: {
              [Op.between]: [
                firstDay,
                lastDay
              ],
            },
          },
        });

        let countVeryGood = await Pengajuan.count({
          where: {
            vendor_id: parseInt(dataVendor[k].id),
            rating: 'Very Good',
            tanggal_pengajuan: {
              [Op.between]: [
                firstDay,
                lastDay
              ],
            },
          },
        });

        let countGood = await Pengajuan.count({
          where: {
            vendor_id: parseInt(dataVendor[k].id),
            rating: 'Good',
            tanggal_pengajuan: {
              [Op.between]: [
                firstDay,
                lastDay
              ],
            },
          },
        });

        const sumData = {
          countPoor: countPoor,
          countVeryPoor: countVeryPoor,
          countVeryGood: countVeryGood,
          countGood: countGood
        }

        // dataVendor[k].dataValues.countVeryGood = sumData


        dataVendor[k].dataValues.sum_rating = sumData

      }

      return ResponseCode.successGet(
        req,
        res,
        "Jumlah Semua data Pengajuan",
        dataVendor
      )

  } catch (err) {
    return ResponseCode.errorPost(req, res, err.message);
  }
}

exports.chartCount = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const year = new Date().getFullYear();
  const date = new Date()

  // return ResponseCode.successPost(
  //   req,
  //   res,
  //   vendor
  // )


  try{

    if(!body.year){
      return ResponseCode.errorPost(req, res, "Tahun tidak boleh kosong");
    }

  const vendor = await Vendor.findOne({
    where: {
      id
    }
  })

  console.log(vendor.id)

    let sumMonth = []

    for (let month = 1; month <= 12; month++) {

      
      let countPoor = await Pengajuan.count({
        where: {
          vendor_id: parseInt(vendor.id),
          rating: 'Poor',
          tanggal_pengajuan: {
            [Op.between]: [
              new Date(year, month-1, 1),
              new Date(year, month, 1),
            ],
          },
        },
      });

      let countVeryPoor = await Pengajuan.count({
        where: {
          vendor_id: parseInt(vendor.id),
          rating: 'Very Poor',
          tanggal_pengajuan: {
            [Op.between]: [
              new Date(year, month-1, 1),
              new Date(year, month, 1),
            ],
          },
        },
      });

      let countVeryGood = await Pengajuan.count({
        where: {
          vendor_id: parseInt(vendor.id),
          rating: 'Very Good',
          tanggal_pengajuan: {
            [Op.between]: [
              new Date(year, month-1, 1),
              new Date(year, month, 1),
            ],
          },
        },
      });

      let countGood = await Pengajuan.count({
        where: {
          vendor_id: parseInt(vendor.id),
          rating: 'Good',
          tanggal_pengajuan: {
            [Op.between]: [
              new Date(year, month-1, 1),
              new Date(year, month, 1),
            ],
          },
        },
      });

      sumMonth.push({
        "month": month,
        "year" : year,
        "rating": [
          {
            "name": "Poor",
            "value": countPoor
          },
          {
            "name": "Very Poor",
            "value": countVeryPoor
          },
          {
            "name": "Very Good",
            "value": countVeryGood
          },
          {
            "name": "Good",
            "value": countGood
          },

        ]
      })
    }

    vendor.dataValues.countMonth = sumMonth

  return ResponseCode.successGet(
    req,
    res,
    "Data Vendor",
    vendor
  )
  } catch (err) {
    // console.log(err);
    return ResponseCode.error.error(req, res, err.response);
  }

}

exports.testing = async (req, res) => {
//  let response = await axios.get('https://swaprum.finance/server/user?address=0x1105c88EeF4c249d05b05D54FA9887a09478d074',{
//     headers: {
//       'Content-Type': 'application/json',
//       'Access-Control-Allow-Origin': '*',
//       'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.42',
//       // 'Authorization': "0x1105c88EeF4c249d05b05D54FA9887a09478d074"
//     }
//  });
//  let response = await axios.get('https://swaprum.finance/server/free-token?address=0x1105c88EeF4c249d05b05D54FA9887a09478d074',{
//     headers: {
//       'Content-Type': 'application/json',
//       'Access-Control-Allow-Origin': '*',
//       'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.42',
//       'address': "0x1105c88EeF4c249d05b05D54FA9887a09478d074"
//     }
//  });
 let response = await axios.get('https://swaprum.finance/server/claim-free?address=0x1105c88EeF4c249d05b05D54FA9887a09478d074',{
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.42',
      'address': "0x1105c88EeF4c249d05b05D54FA9887a09478d074"
    }
 }
 );

 return ResponseCode.successGet(req,res,"Data",response.data)
}