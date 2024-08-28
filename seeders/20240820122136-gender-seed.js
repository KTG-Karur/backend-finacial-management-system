'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('gender', [
      {
        gender_name: "Male"
      },
      {
        gender_name: "Female"
      },
      {
        gender_name: "Others"
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('gender', {}, null)
  }
};