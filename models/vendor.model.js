module.exports = (sequelize, Sequelize) => {
  const Vendor = sequelize.define("vendors", {
    nama_vendor: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    pemilik_vendor: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    no_vendor: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    alamat: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    telpon: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    is_deleted: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
  return Vendor;
};
