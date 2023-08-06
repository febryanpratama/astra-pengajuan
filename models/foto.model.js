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
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    is_in: {
      type: Sequelize.ENUM,
      values: ['in', 'out'],
      allowNull: true
    }
  });
  return Foto;
};
