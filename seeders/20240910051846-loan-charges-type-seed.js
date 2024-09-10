'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('loan_charges', [
      {
        loan_charges_name: "Document Fees",
        charges_amount: "2",
        is_percentage : 1
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('loan_charges', {}, null)
  }
};
