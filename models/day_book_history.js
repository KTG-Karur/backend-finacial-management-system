'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class day_book_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  day_book_history.init({
    day_book_history_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    db_category_id: DataTypes.INTEGER,
    db_sub_category_id: DataTypes.INTEGER,
    amount: DataTypes.STRING,
    day_book_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'day_book_history',
  });
  return day_book_history;
};