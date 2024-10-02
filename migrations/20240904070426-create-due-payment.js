'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('due_payments', {
      due_payment_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      loan_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      total_amount: {
        type: Sequelize.STRING
      },
      paid_amount: {
        type: Sequelize.STRING
      },
      balance_amount: {
        type: Sequelize.STRING
      },
      due_amount: {
        type: Sequelize.STRING
      },
      due_start_date: {
        type: Sequelize.DATE
      },
      due_end_date: {
        type: Sequelize.DATE
      },
      is_force_close: {
        type: Sequelize.BOOLEAN
      },
      force_close_date: {
        type: Sequelize.DATE
      },
      loan_due_status_id: {
        type: Sequelize.INTEGER
      },
      is_investment: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('due_payments');
  }
};