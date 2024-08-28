'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class applicant_proof extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  applicant_proof.init({
    applicant_proof_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    applicant_id: DataTypes.INTEGER,
    applicant_type_id: DataTypes.INTEGER,
    proof_type_id: DataTypes.INTEGER,
    proof_no: DataTypes.STRING,
    image_name: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'applicant_proof',
    tableName: 'applicant_proof',
  });
  return applicant_proof;
};