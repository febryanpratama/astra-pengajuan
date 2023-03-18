module.exports = (sequelize, Sequelize) => {
  const Pengajuan = sequelize.define("pengajuans", {
    user_id: {
      type: Sequelize.BIGINT,
      allowNull: false,
    },
    vendor_id: {
      type: Sequelize.BIGINT,
      allowNull: true,
    },
    pengajuan_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tanggal_pengajuan: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    tanggal_mulai: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    tanggal_selesai: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    deskripsi: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    komentar: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    prioritas: {
      type: Sequelize.ENUM("hight", "normal", "low"),
      allowNull: false,
    },
    // image: {
    //   type: Sequelize.STRING,
    // },
    status: {
      type: Sequelize.ENUM("sukses", "proses_admin", "proses_vendor"),
      allowNull: false,
    },
    harga: {
      type: Sequelize.INTEGER,
      allowNull: true,
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
  return Pengajuan;
};
