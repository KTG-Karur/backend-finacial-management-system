'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class expense_entry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      expense_entry.belongsTo(models.expensive_type, {
        foreignKey: 'expensive_type_id',
        onDelete: 'CASCADE'
      });
    }
  }
  expense_entry.init({
    expense_entry_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    expensive_type_id: DataTypes.INTEGER,
    description: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
    expense_date: DataTypes.DATE,
    is_active: DataTypes.BOOLEAN,
    expense_amount: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'expense_entry',
  });
  return expense_entry;
};