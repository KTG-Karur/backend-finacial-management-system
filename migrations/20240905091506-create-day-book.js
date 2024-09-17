'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('day_books', {
      day_book_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      opening_amount: {
        type: Sequelize.STRING
      },
      closing_amount: {
        type: Sequelize.STRING
      },
      shortage: {
        type: Sequelize.STRING
      },
      income_amount: {
        type: Sequelize.STRING
      },
      expense_amount: {
        type: Sequelize.STRING
      },
      reason: {
        type: Sequelize.STRING
      },
      created_by: {
        type: Sequelize.INTEGER
      },
      closing_date: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('day_books');
  }
};