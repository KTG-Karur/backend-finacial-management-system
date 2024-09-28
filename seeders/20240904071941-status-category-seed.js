'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('status_categories', [
      {
        status_category_name: "Loan Status"
      },
      {
        status_category_name: "Disbursed Method"
      },
      {
        status_category_name: "Loan Due Status"
      },
      {
        status_category_name: "Payment Status"
      },
      {
        status_category_name: "Day Book Category"
      },
      {
        status_category_name: "Day Book Sub-Category"
      },
      {
        status_category_name: "Attendance Status"
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('status_categories', {}, null)
  }
};
