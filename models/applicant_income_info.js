'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class applicant_income_info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  applicant_income_info.init({
    applicant_income_info_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    applicant_id: DataTypes.INTEGER,
    applicant_type_id: DataTypes.INTEGER,
    company_name: DataTypes.STRING,
    address: DataTypes.STRING,
    bussiness_description: DataTypes.STRING,
    office_contact_no: DataTypes.STRING,
    monthly_income: DataTypes.STRING,
    start_date: DataTypes.DATE,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'applicant_income_info',
    tableName: 'applicant_income_info',
  });
  return applicant_income_info;
};