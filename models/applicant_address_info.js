'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class applicant_address_info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  applicant_address_info.init({
    applicant_address_info_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    applicant_id: DataTypes.INTEGER,
    address_type_id: DataTypes.INTEGER,
    address: DataTypes.STRING,
    landmark: DataTypes.STRING,
    district_id: DataTypes.INTEGER,
    state_id: DataTypes.INTEGER,
    country_id: DataTypes.INTEGER,
    pincode: DataTypes.STRING,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'applicant_address_info',
  });
  return applicant_address_info;
};