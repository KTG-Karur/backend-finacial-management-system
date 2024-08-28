'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sub_categories', {
      sub_category_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sub_category_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      category_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      interest_rate: {
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
    await queryInterface.dropTable('sub_categories');
  }
};