'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class contra extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  contra.init({
    contra_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    disbursed_method_id: DataTypes.INTEGER,
    bank_id: DataTypes.INTEGER,
    total_amount: DataTypes.STRING,
    two_thous_count: DataTypes.STRING,
    five_hund_count: DataTypes.STRING,
    hund_count: DataTypes.STRING,
    five_coin_count: DataTypes.STRING,
    two_coin_count: DataTypes.STRING,
    one_coin_count: DataTypes.STRING,
    fivty_count: DataTypes.STRING,
    twenty_count: DataTypes.STRING,
    ten_count: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'contra',
  });
  return contra;
};