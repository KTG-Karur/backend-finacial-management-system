'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class income_entry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      income_entry.belongsTo(models.income_type, {
        foreignKey: 'income_type_id',
        onDelete: 'CASCADE'
      });
    }
  }
  income_entry.init({
    income_entry_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    income_type_id: DataTypes.INTEGER,
    description: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
    income_date: DataTypes.DATE,
    is_active: DataTypes.BOOLEAN,
    income_amount: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'income_entry',
  });
  return income_entry;
};