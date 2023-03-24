const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;
const VendorRoutes = require("./app/modules/admin/vendor/routes/VendorRoutes");
const AuthRoutes = require("./app/modules/authentication/routes/AuthRoutes");
const PengajuanRoutes = require("./app/modules/user/pengajuan/routes/PengajuanRoutes");
const PengajuanRoutes = require("./app/modules/admin/pengajuan/routes/PengajuanRoutes");
const PengajuanRoutes = require("./app/modules/atasan/pengajuan/routes/PengajuanRoutes");

const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");
db.sequelize.sync();
// db.Sequelize.sync();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// pengajuan routes linknya belum kena admin dan atasan

// user
app.use("/api/auth", AuthRoutes);
app.use("/api/user/vendor", VendorRoutes);
app.use("/api/user/pengajuan", PengajuanRoutes);

// Admin
app.use("/api/auth", AuthRoutes);
app.use("/api/admin/vendor", VendorRoutes);
app.use("/api/admin/pengajuan", PengajuanRoutes);

// Atasan
app.use("/api/atasan/auth", AuthRoutes);
app.use("/api/atasan/pengajuan", PengajuanRoutes);

app.listen(port, () =>
  console.log(`App listening on port http://localhost:${port}!`)
);
