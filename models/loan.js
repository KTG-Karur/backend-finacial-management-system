'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class loan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  loan.init({
    loan_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    applicant_id: DataTypes.INTEGER,
    co_applicant_id: DataTypes.INTEGER,
    guarantor_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    sub_category_id: DataTypes.INTEGER,
    interest_rate: DataTypes.INTEGER,
    application_no: DataTypes.STRING,
    due_type_id: DataTypes.INTEGER,
    loan_amount: DataTypes.STRING,
    due_amount: DataTypes.STRING,
    due_date: DataTypes.DATE,
    last_date: DataTypes.DATE,
    disbursed_date: DataTypes.DATE,
    disbursed_amount: DataTypes.STRING,
    tenure_period: DataTypes.INTEGER,
    disbursed_method_id: DataTypes.INTEGER,
    bank_account_id: DataTypes.INTEGER,
    created_by: DataTypes.INTEGER,
    approved_by: DataTypes.INTEGER,
    approved_date: DataTypes.DATE,
    loan_status_id: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'loan',
  });
  return loan;
};