const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;
const VendorRoutes = require("./app/modules/vendor/routes/VendorRoutes");
const AuthRoutes = require("./app/modules/authentication/routes/AuthRoutes");
const PengajuanRoutes = require("./app/modules/pengajuan/routes/PengajuanRoutes");
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

app.use("/api/auth", AuthRoutes);
app.use("/api/vendor", VendorRoutes);
app.use("/api/pengajuan", PengajuanRoutes);

app.listen(port, () =>
  console.log(`App listening on port http://localhost:${port}!`)
);
