module.exports = (sequelize, Sequelize) => {
  const Foto = sequelize.define("fotos", {
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
    file_photo: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    createAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updateAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
  return Foto;
};
