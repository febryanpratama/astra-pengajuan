const express = require("express");
const cors = require("cors");
const app = express();
// const aws = require("@aws-sdk/client-s3");
const multer = require("multer");
// const multerS3 = require('multer-s3');
const port = 3000;
const AuthRoutes = require("./app/modules/authentication/routes/AuthRoutes");

const VendorRoutes = require("./app/modules/admin/vendor/routes/VendorRoutes");
const VendorRoutesUser = require("./app/modules/user/vendor/routes/VendorRoutes");

const PengajuanRoutes = require("./app/modules/user/pengajuan/routes/PengajuanRoutes");
const PengajuanRoutesadmin = require("./app/modules/admin/pengajuan/routes/PengajuanRoutes");
const PengajuanRoutesatasan = require("./app/modules/atasan/pengajuan/routes/PengajuanRoutes");
const bodyParser = require("body-parser");

// var corsOptionsDelegate = function (req, callback) {
//   var corsOptions;
//   if (allowlist.indexOf(req.header("Origin")) !== -1) {
//     corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
//   } else {
//     corsOptions = { origin: false }; // disable CORS for this request
//   }
//   callback(null, corsOptions); // callback expects two parameters: error and options
// };

// app.options(cors(corsOptionsDelegate));
app.use(bodyParser.json({ type: "application/json", limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

// aws.config.update({
//   accessKeyId: "AKIATNRBN2NRZZPT3WGJ",
//   secretAccessKey: "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",
//   region: "ap-southeast-2",
// });

const db = require("./models");
db.sequelize.sync();
// db.Sequelize.sync();
const corsOptions = {
  origin: "https://lapor-pak-astra.vercel.app", // Replace with your allowed origin(s)
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // If you need to support cookies, sessions, or authentication headers
  optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  ); // If needed
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Authorization,"
  ); // If needed
  // res.setHeader("preflightContinue", true); // If needed
  // res.setHeader("Access-Control-Allow-Credentials", true); // If needed

  // res.send("cors problem fixed:)");
  next();
});

// const corsOption = {
//   origin: "https://lapor-pak-astra.vercel.app",
//   optionsSuccessStatus: 200,
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Headers":
//     "Content-Type, Authorization, X-Requested-With, Accept, Origin, Referer, User-Agent",
//   preflightContinue: true,
//   credentials: true,
// };

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// user
app.use("/api/auth", AuthRoutes);
app.use("/api/user/vendor", VendorRoutesUser);
app.use("/api/user/pengajuan", PengajuanRoutes);

// Admin
// app.use("/api/auth", AuthRoutes);
app.use("/api/admin/vendor", VendorRoutes);
app.use("/api/admin/pengajuan", PengajuanRoutesadmin);

// Atasan
// app.use("/api/atasan/auth", AuthRoutes);
app.use("/api/atasan/pengajuan", PengajuanRoutesatasan);

app.listen(port, () =>
  console.log(`App listening on port http://localhost:${port}`)
);
