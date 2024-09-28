'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('loans', {
      loan_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      applicant_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      co_applicant_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      guarantor_id: {
        type: Sequelize.INTEGER
      },
      category_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      sub_category_id: {
        type: Sequelize.INTEGER
      },
      interest_rate: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      application_no: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      due_type_id: {
        type: Sequelize.INTEGER
      },
      loan_amount: {
        allowNull: false,
        type: Sequelize.STRING
      },
      due_amount: {
        allowNull: false,
        type: Sequelize.STRING
      },
      transaction_id: {
        type: Sequelize.STRING
      },
      due_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      last_date: {
        type: Sequelize.DATE
      },
      loan_date: {
        type: Sequelize.DATE
      },
      disbursed_date: {
        type: Sequelize.DATE
      },
      disbursed_amount: {
        type: Sequelize.STRING
      },
      tenure_period: {
        type: Sequelize.INTEGER
      },
      disbursed_method_id: {
        allowNull: false,
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
      approved_date: {
        type: Sequelize.DATE
      },
      loan_status_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      is_active: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: 1
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
    await queryInterface.dropTable('loans');
  }
};