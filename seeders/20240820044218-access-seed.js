'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('access',[
      {
        access_name : "Create"
      },
      {
        access_name : "Edit"
      },
      {
        access_name : "Delete"
      },
      {
        access_name : "View"
      },
     ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('access', {}, null)
  }
};
