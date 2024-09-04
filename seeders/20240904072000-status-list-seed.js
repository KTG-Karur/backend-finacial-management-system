'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('status_list', [
      {
        status_category_id : 1,
        status_name: "Requested"
      },
      {
        status_category_id : 1,
        status_name: "Approved"
      },
      {
        status_category_id : 1,
        status_name: "Cancelled"
      },
      {
        status_category_id : 1,
        status_name: "Disbursed"
      },
      {
        status_category_id : 2,
        status_name: "Active"
      },
      {
        status_category_id : 2,
        status_name: "Closed"
      },
      {
        status_category_id : 3,
        status_name: "Paid"
      },
      {
        status_category_id : 3,
        status_name: "Un-Paid"
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
