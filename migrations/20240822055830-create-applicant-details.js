'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('applicant_details', {
      applicant_details_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      applicant_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        unique: true
      },
      father_name: {
        type: Sequelize.STRING
      },
      mother_name: {
        type: Sequelize.STRING
      },
      guardian_name: {
        type: Sequelize.STRING
      },
      father_occupation: {
        type: Sequelize.STRING
      },
      father_income: {
        type: Sequelize.STRING
      },
      mother_occupation: {
        type: Sequelize.STRING
      },
      mother_income: {
        type: Sequelize.STRING
      },
      father_contact_no: {
        type: Sequelize.STRING
      },
      mother_contact_no: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('applicant_details');
  }
};