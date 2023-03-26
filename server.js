const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;
const VendorRoutes = require("./app/modules/admin/vendor/routes/VendorRoutes");
const AuthRoutes = require("./app/modules/authentication/routes/AuthRoutes");
const PengajuanRoutes = require("./app/modules/user/pengajuan/routes/PengajuanRoutes");
const PengajuanRoutesAtasan = require("./app/modules/atasan/pengajuan/routes/PengajuanRoutes");
//tesn
const PengajuanRoutesAdmin = require("./app/modules/admin/pengajuan/routes/PengajuanRoutes");

const PengajuanRoutesUser = require("./app/modules/user/pengajuan/routes/PengajuanRoutes");
const VendorRoutesUser = require("./app/modules/user/vendor/routes/VendorRoutes");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: false }));

const db = require("./models");
db.sequelize.sync();
// db.Sequelize.sync();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// pengajuan routes linknya belum kena admin dan user
// vendor user routes linknya belum kena admin

// user
app.use("/api/auth", AuthRoutes);
app.use("/api/user/vendor", VendorRoutesUser);
app.use("/api/user/pengajuan", PengajuanRoutesUser);

// Admin
app.use("/api/auth", AuthRoutes);
app.use("/api/admin/vendor", VendorRoutes);
app.use("/api/admin/pengajuan", PengajuanRoutesAdmin);

// Atasan
app.use("/api/atasan/auth", AuthRoutes);
app.use("/api/atasan/pengajuan", PengajuanRoutesAtasan);

app.listen(port, () =>
  console.log(`App listening on port http://localhost:${port}!`)
);
