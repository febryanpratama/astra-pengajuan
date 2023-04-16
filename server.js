const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;
const AuthRoutes = require("./app/modules/authentication/routes/AuthRoutes");

const VendorRoutes = require("./app/modules/admin/vendor/routes/VendorRoutes");
const VendorRoutesUser = require("./app/modules/user/vendor/routes/VendorRoutes");

const PengajuanRoutes = require("./app/modules/user/pengajuan/routes/PengajuanRoutes");
const PengajuanRoutesadmin = require("./app/modules/admin/pengajuan/routes/PengajuanRoutes");
const PengajuanRoutesatasan = require("./app/modules/atasan/pengajuan/routes/PengajuanRoutes");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json({ type: "application/json",limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

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
  console.log(`App listening on port http://localhost:${port}!`)
);
