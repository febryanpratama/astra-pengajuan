const express = require("express");
const cors = require("cors");
const app = express();
// const aws = require("@aws-sdk/client-s3");
const multer = require("multer");
// const multerS3 = require('multer-s3');
const port = 8081;
const AuthRoutes = require("./app/modules/authentication/routes/AuthRoutes");

const VendorRoutes = require("./app/modules/admin/vendor/routes/VendorRoutes");
const VendorRoutesUser = require("./app/modules/user/vendor/routes/VendorRoutes");

const PengajuanRoutes = require("./app/modules/user/pengajuan/routes/PengajuanRoutes");
const PengajuanRoutesadmin = require("./app/modules/admin/pengajuan/routes/PengajuanRoutes");
const PengajuanRoutesatasan = require("./app/modules/atasan/pengajuan/routes/PengajuanRoutes");
const bodyParser = require("body-parser");

// var corsOptions = {
//   origin: function (origin, callback) {},
//   methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
//   credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
//   allowedHeaders: [
//     "Content-Type",
//     "Authorization",
//     "X-Requested-With",
//     "device-remember-token",
//     "Access-Control-Allow-Origin",
//     "Origin",
//     "Accept",
//   ],
// };

app.use(cors());
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
