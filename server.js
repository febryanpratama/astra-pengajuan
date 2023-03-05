const express = require("express");
const cors = require("cors");
const app = express();
const port = 8081;
const VendorRoutes = require("./app/modules/vendor/routes/VendorRoutes");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./app/core/models");
db.sequelize.sync();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/vendor", VendorRoutes);

app.listen(port, () =>
  console.log(`App listening on port http://localhost:${port}!`)
);
