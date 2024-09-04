'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class due_payment_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  due_payment_history.init({
    due_payment_history_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    due_payment_id: DataTypes.INTEGER,
    paid_amount: DataTypes.STRING,
    balance_amount: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
    paid_date: DataTypes.DATE,
    fine_amount: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'due_payment_history',
  });
  return due_payment_history;
};