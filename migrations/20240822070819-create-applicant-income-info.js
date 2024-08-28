'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('applicant_income_infos', {
      applicant_income_info_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      applicant_id: {
        type: Sequelize.INTEGER
      },
      applicant_type_id: {
        type: Sequelize.INTEGER
      },
      company_name: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      bussiness_description: {
        type: Sequelize.STRING
      },
      office_contact_no: {
        type: Sequelize.STRING
      },
      monthly_income: {
        type: Sequelize.STRING
      },
      start_date: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('applicant_income_infos');
  }
};