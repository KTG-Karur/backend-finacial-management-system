'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class loan_charges extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  loan_charges.init({ 
    loan_charges_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    loan_charges_name: DataTypes.STRING,
    charges_amount: DataTypes.STRING,
    is_percentage: DataTypes.BOOLEAN,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'loan_charges',
  });
  return loan_charges;
};