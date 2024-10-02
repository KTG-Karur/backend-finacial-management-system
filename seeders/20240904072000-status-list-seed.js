'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('status_lists', [
       //-----Loan Status Starts------//
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
      //-----Loan Status Ends------//
      //-----Disbursed Method Starts------//
      {
        status_category_id : 2,
        status_name: "Cash"
      },
      {
        status_category_id : 2,
        status_name: "Neft"
      },
      //-----Disbursed Method Ends------//
      //-----Loan Due Status------//
      {
        status_category_id : 3,
        status_name: "Active"
      },
      {
        status_category_id : 3,
        status_name: "Closed"
      },
      //-----Loan Due Status------//X
      //-----Payment Status------//
      {
        status_category_id : 4,
        status_name: "Paid"
      },
      {
        status_category_id : 4,
        status_name: "Un-Paid"
      },
        //-----Payment Status------//
        //-----Day Book Catgeory------//
      {
        status_category_id : 5,
        status_name: "Income"
      },
      {
        status_category_id : 5,
        status_name: "Expense"
      },
      //-----Day Book Catgeory------//
      //-----Day Book Sub-Catgeory------//
      {
        status_category_id : 6,
        status_name: "Due Payment"
      },
      {
        status_category_id : 6,
        status_name: "Loan Payment"
      },
      {
        status_category_id : 6,
        status_name: "Entry Payment"
      },
      //-----Day Book Sub-Catgeory------//
      {
        status_category_id : 7,
        status_name: "Present"
      },
      {
        status_category_id : 7,
        status_name: "Absent"
      },
      //-----Applicant Category------//
      {
        status_category_id : 8,
        status_name: "Customer"
      },
      {
        status_category_id : 8,
        status_name: "Partner"
      },
      {
        status_category_id : 8,
        status_name: "Investor"
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
