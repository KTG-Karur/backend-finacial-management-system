'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('investments', {
      investment_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      investor_id: {
        type: Sequelize.INTEGER
      },
      refered_by: {
        type: Sequelize.STRING
      },
      category_id: {
        type: Sequelize.INTEGER
      },
      sub_category_id: {
        type: Sequelize.INTEGER
      },
      interest_rate: {
        type: Sequelize.INTEGER
      },
      investment_amount: {
        type: Sequelize.STRING
      },
      disbursed_date: {
        type: Sequelize.DATE
      },
      lock_period: {
        type: Sequelize.STRING
      },
      due_date: {
        type: Sequelize.DATE
      },
      application_no: {
        type: Sequelize.STRING
      },
      transaction_id: {
        type: Sequelize.STRING
      },
      due_amount: {
        type: Sequelize.STRING
      },
      reason: {
        type: Sequelize.STRING
      },
      disbursed_method_id: {
        type: Sequelize.INTEGER
      },
      bank_account_id: {
        type: Sequelize.INTEGER
      },
      created_by: {
        type: Sequelize.INTEGER
      },
      approved_by: {
        type: Sequelize.INTEGER
      },
      investment_status_id: {
        type: Sequelize.INTEGER
      },
      loan_date: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('investments');
  }
};