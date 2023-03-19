"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "production";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.vendors = require("./vendor.model")(sequelize, Sequelize);
db.pengajuans = require("./pengajuan.model")(sequelize, Sequelize);
db.history = require("./history.model")(sequelize, Sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.sequelize.sync({ force: false }).then(() => {
  console.log("yes re-sync done!");
});

// Join

db.pengajuans.belongsTo(db.vendors, {
  foreignKey: "vendor_id",
  as: "vendor",
});

// join table foto

module.exports = db;
