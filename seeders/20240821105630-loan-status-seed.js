'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('loan_status', [
      {
        loan_status_name: "Active Loan"
      },
      {
        loan_status_name: "Closed Loan"
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('loan_status', {}, null)
  }
};
