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
      deskripsi: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      komentaradmin: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      komentaratasan: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      prioritas: {
        type: Sequelize.ENUM("Low", "Normal", "High"),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          "Verifikasi Admin",
          "Proses Admin",
          "Proses Vendor",
          "Selesai"
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
