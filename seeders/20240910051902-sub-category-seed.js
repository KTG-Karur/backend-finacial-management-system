'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('sub_categories', [
      {
        sub_category_name: "PL",
        category_id: 2,
        interest_rate : 36
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('sub_categories', {}, null)
  }
};
