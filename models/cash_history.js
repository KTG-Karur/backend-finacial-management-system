'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cash_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  cash_history.init({
    cash_history_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    contra_id: DataTypes.INTEGER,
    two_thous_count: DataTypes.STRING,
    five_hund_count: DataTypes.STRING,
    hund_count: DataTypes.STRING,
    five_coin_count: DataTypes.STRING,
    two_coin_count: DataTypes.STRING,
    one_coin_count: DataTypes.STRING,
    amount: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'cash_history',
  });
  return cash_history;
};