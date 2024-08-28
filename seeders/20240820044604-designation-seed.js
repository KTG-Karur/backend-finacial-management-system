'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('designation',[
      {
        designation_name : "Manager"
      },
      {
        designation_name : "Staff"
      },
     ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('designation', {}, null)
  }
};
