'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('applicants', {
      applicant_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      applicant_code: {
        allowNull: false,
        type: Sequelize.STRING
      },
      first_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      dob: {
        type: Sequelize.DATE
      },
      contact_no: {
        allowNull: false,
        type: Sequelize.STRING
      },
      alternative_contact_no: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      gender_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      qualification: {
        type: Sequelize.STRING
      },
      martial_status_id: {
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
    await queryInterface.dropTable('applicants');
  }
};