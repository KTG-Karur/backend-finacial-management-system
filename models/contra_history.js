'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class contra_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  contra_history.init({
    contra_history_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    contra_id: DataTypes.INTEGER,
    transaction_id: DataTypes.STRING,
    cash_history_id: DataTypes.INTEGER,
    amount: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'contra_history',
  });
  return contra_history;
};