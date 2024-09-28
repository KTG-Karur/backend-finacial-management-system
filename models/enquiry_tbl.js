'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class enquiry_tbl extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  enquiry_tbl.init({
    enquiry_id :{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    contact_no: DataTypes.STRING,
    message: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'enquiry_tbl',
  });
  return enquiry_tbl;
};