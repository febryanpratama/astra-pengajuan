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
    departemen: {
      type: Sequelize.STRING,
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
    tanggal_penyelesaian: {
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
      type: Sequelize.ENUM("high", "normal", "low"),
      allowNull: false,
    },

    file_bph: {
      type: Sequelize.TEXT("long"),
      allowNull: true,
    },
    komentar_selesai: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    status: {
      type: Sequelize.ENUM(
        "selesai",
        "proses_admin",
        "proses_vendor",
        "Ditolak",
        "Verifikasi Admin"
      ),
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
