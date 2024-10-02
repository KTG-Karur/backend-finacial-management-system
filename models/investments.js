'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class investments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  investments.init({
    investment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    investor_id: DataTypes.INTEGER,
    refered_by: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
    sub_category_id: DataTypes.INTEGER,
    interest_rate: DataTypes.INTEGER,
    investment_amount: DataTypes.STRING,
    disbursed_date: DataTypes.DATE,
    lock_period: DataTypes.STRING,
    due_date: DataTypes.DATE,
    loan_date: DataTypes.DATE,
    due_amount: DataTypes.STRING,
    transaction_id: DataTypes.STRING,
    application_no: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
    approved_by: DataTypes.INTEGER,
    disbursed_method_id: DataTypes.INTEGER,
    bank_account_id: DataTypes.INTEGER,
    investment_status_id: DataTypes.INTEGER,
    reason: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'investments',
  });
  return investments;
};