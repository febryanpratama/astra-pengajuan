module.exports = (sequelize, Sequelize) => {
  const History = sequelize.define("histories", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    pengajuan_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    tanggal: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    deskripsi: {
      type: Sequelize.TEXT,
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
  return History;
};
