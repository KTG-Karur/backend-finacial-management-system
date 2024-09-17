'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('day_book_histories', {
      day_book_history_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      db_category_id: {
        type: Sequelize.INTEGER
      },
      db_sub_category_id: {
        type: Sequelize.INTEGER
      },
      respective_id: {
        type: Sequelize.INTEGER
      },
      created_by: {
        type: Sequelize.INTEGER
      },
      is_closed: {
        type: Sequelize.BOOLEAN
      },
      amount: {
        type: Sequelize.STRING
      },
      day_book_id: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('day_book_histories');
  }
};