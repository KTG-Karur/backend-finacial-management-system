'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('employee', {
      employee_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employee_code: {
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
        allowNull: false,
        type: Sequelize.DATE
      },
      contact_no: {
        type: Sequelize.STRING
      },
      email_id: {
        type: Sequelize.STRING
      },
      date_of_joining: {
        allowNull: false,
        type: Sequelize.DATE
      },
      date_of_reliving: {
        type: Sequelize.DATE
      },
      role_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      department_id: {
        type: Sequelize.INTEGER
      },
      designation_id: {
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
    await queryInterface.dropTable('employee');
  }
};