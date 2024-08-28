'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('loan_charges', {
      loan_charges_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      loan_charges_name: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      charges_amount: {
        allowNull: false,
        type: Sequelize.STRING
      },
      is_percentage: {
        allowNull: false,
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('loan_charges');
  }
};