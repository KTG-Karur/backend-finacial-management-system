'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('status_category', [
      {
        status_category_name: "Loan Status"
      },
      {
        status_category_name: "Loan Due Status"
      },
      {
        status_category_name: "Payment Status"
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('status_category', {}, null)
  }
};
