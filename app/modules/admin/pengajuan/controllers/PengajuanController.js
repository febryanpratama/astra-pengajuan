const { validationResult } = require("express-validator");
const db = require("../../../../../models");
const ResponseCode = require("../../../../core/utils/ResponseCode");
const { post } = require("../routes/PengajuanRoutes");
const Pengajuan = db.pengajuans;
const Vendor = db.vendors;
const History = db.history;
const fotos = db.fotos;
const fs = require("fs");


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
      // karena sudah di set
      harga: 0,
    });

    //foto

    const fotos = await fotos  ({
      let matches = req.body.image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let response = {};
      if (matches.length!==3){
        return new Error ('Invalid input string');
      }
      response.type = matches[1];
      response.data = new Buffer(matches[2],'base64');
      let decodedImg = response;
      let imageBuffer = decodedImg.data;
      let type = decodedImg.type;
      let extension = mime.extension(type);
      let fileName = "image." + extension;
      try {
        fs.writeFileSync(assets + fileName, imageBuffer, 'utf8');
        return res.send({"status" :"sussces"});
      }catch (e) {
        next(e);
    }); 

    // const respFoto = await fotos.create({
    //   pengajuan_id: response.id,
    //   file_photo: data.file_photo,
    // });

    // const base64Image = req.body.image;
    // const buffer = Buffer.from(base64Image, 'base64');
    // res.sendFile('nama-file.jpg', { root: __dirname });
    // const fs = require('fs');
// fs.writeFile('nama-file.jpg', buffer, (err) => {
//   if (err) throw err;
//   console.log('File telah tersimpan.');
// });


    // tambah lg nanti
    // console.log(response);
    const respHistory = await History.create({
      pengajuan_id: response.id,
      tanggal: new Date().toDateString(),
      deskripsi: "Membuat Pengajuan Baru",
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
