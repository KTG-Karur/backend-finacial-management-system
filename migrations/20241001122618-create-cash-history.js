'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cash_histories', {
      cash_history_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      contra_id: {
        type: Sequelize.INTEGER
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
      amount: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cash_histories');
  }
};