'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('applicant_types', [
      {
        applicant_type_name: "Salaried"
      },
      {
        applicant_type_name: "Bussiness"
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('applicant_types', {}, null)
  }
};
