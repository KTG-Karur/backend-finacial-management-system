'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class applicant_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  applicant_details.init({
    applicant_details_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    applicant_id: DataTypes.INTEGER,
    father_name: DataTypes.STRING,
    mother_name: DataTypes.STRING,
    guardian_name: DataTypes.STRING,
    father_occupation: DataTypes.STRING,
    father_income: DataTypes.STRING,
    mother_occupation: DataTypes.STRING,
    mother_income: DataTypes.STRING,
    father_contact_no: DataTypes.STRING,
    mother_contact_no: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'applicant_details',
  });
  return applicant_details;
};