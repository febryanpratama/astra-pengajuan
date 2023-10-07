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

    await queryInterface.createTable("vendors", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nama_vendor: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      no_vendor: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pemilik_vendor: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      telpon: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      alamat: {
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
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("vendors");
  },
};
