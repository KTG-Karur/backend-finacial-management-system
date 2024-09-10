'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class applicant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  applicant.init({
    applicant_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    applicant_code: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    dob: DataTypes.DATE,
    contact_no: DataTypes.STRING,
    alternative_contact_no: DataTypes.STRING,
    email: DataTypes.STRING,
    gender_id: DataTypes.INTEGER,
    qualification: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    is_borrower: DataTypes.BOOLEAN,
    martial_status_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'applicant',
  });
  return applicant;
};