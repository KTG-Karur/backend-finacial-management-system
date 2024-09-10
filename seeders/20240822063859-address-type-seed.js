'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('address_types', [
      {
        address_type_name: "Permanent"
      },
      {
        address_type_name: "Current"
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('address_types', {}, null)
  }
};
