'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class income_type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      income_type.belongsTo(models.employee, {
        foreignKey: 'created_by',
        onDelete: 'CASCADE'
      });
    }
  }
  income_type.init({
    income_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    income_type_name: DataTypes.STRING,
    description: DataTypes.STRING,
    income_date : DataTypes.DATE,
    created_by : DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'income_type',
  });
  return income_type;
};