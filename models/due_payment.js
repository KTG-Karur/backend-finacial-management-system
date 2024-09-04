'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class due_payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  due_payment.init({
    due_payment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    loan_id: DataTypes.INTEGER,
    total_amount: DataTypes.STRING,
    paid_amount: DataTypes.STRING,
    balance_amount: DataTypes.STRING,
    due_amount: DataTypes.STRING,
    due_start_date: DataTypes.DATE,
    due_end_date: DataTypes.DATE,
    is_force_close: DataTypes.BOOLEAN,
    force_close_date: DataTypes.DATE,
    loan_due_status_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'due_payment',
  });
  return due_payment;
};