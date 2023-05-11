"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.createTable("pengajuans", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
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
      tanggal_penyelesaian: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      departemen: {
        type: Sequelize.STRING,
        allowNull: false,
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
        type: Sequelize.ENUM("Low", "Normal", "High"),
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
      rating: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM(
          "Verifikasi Admin",
          "Proses Admin",
          "Proses Vendor",
          "Selesai",
          "Ditolak"
        ),
        allowNull: false,
      },
      estimasi_harga: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true,
      },
      harga: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable("pengajuans");
  },
};
