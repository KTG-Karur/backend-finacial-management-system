'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contras', {
      contra_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      disbursed_method_id: {
        type: Sequelize.INTEGER
      },
      bank_id: {
        type: Sequelize.INTEGER
      },
      total_amount: {
        type: Sequelize.STRING
      },
      two_thous_count: {
        type: Sequelize.STRING
      },
      five_hund_count: {
        type: Sequelize.STRING
      },
      hund_count: {
        type: Sequelize.STRING
      },
      five_coin_count: {
        type: Sequelize.STRING
      },
      two_coin_count: {
        type: Sequelize.STRING
      },
      one_coin_count: {
        type: Sequelize.STRING
      },
      fivty_count: {
        type: Sequelize.STRING
      },
      twenty_count: {
        type: Sequelize.STRING
      },
      ten_count: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('contras');
  }
};