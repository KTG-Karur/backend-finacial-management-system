'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('applicant_proofs', {
      applicant_proof_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      applicant_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        unique : true
      },
      applicant_type_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      proof_type_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      proof_no: {
        allowNull: false,
        type: Sequelize.STRING
      },
      image_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      is_active: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: 1
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('applicant_proofs');
  }
};