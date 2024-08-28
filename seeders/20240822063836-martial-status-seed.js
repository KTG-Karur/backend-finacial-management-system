'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('martial_status', [
      {
        martial_status_name: "Single"
      },
      {
        martial_status_name: "Married"
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('martial_status', {}, null)
  }
};
