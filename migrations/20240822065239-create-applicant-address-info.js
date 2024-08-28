'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('applicant_address_infos', {
      applicant_address_info_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      applicant_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      address_type_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING
      },
      landmark: {
        allowNull: false,
        type: Sequelize.STRING
      },
      district_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      state_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      country_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      pincode: {
        allowNull: false,
        type: Sequelize.STRING
      },
      latitude: {
        type: Sequelize.STRING
      },
      longitude: {
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
    await queryInterface.dropTable('applicant_address_infos');
  }
};