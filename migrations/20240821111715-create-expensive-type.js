'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('expensive_types', {
      expensive_type_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      expensive_type_name: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      description: {
        type: Sequelize.STRING,
      },
      expensive_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      created_by: {
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
    await queryInterface.dropTable('expensive_types');
  }
};