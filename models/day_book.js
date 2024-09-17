'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class day_book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  day_book.init({
    day_book_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    opening_amount: DataTypes.STRING,
    closing_amount: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
    shortage: DataTypes.STRING,
    reason: DataTypes.STRING,
    income_amount: DataTypes.STRING,
    expense_amount: DataTypes.STRING,
    closing_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'day_book',
  });
  return day_book;
};