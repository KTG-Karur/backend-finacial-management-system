'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('district', [
      {
        district_name: "Karur",
        state_id : 1
      },
      {
        district_name: "Chennai",
        state_id : 1
      },
      {
        district_name: "Coimbatore",
        state_id : 1
      },
      {
        district_name: "Erode",
        state_id : 1
      },
      {
        district_name: "Namakal",
        state_id : 1
      },
      {
        district_name: "Salem",
        state_id : 1
      },
      {
        district_name: "Vellore",
        state_id : 1
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('district', {}, null)
  }
};
