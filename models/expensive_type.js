'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class expensive_type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      expensive_type.belongsTo(models.employee, {
        foreignKey: 'created_by',
        onDelete: 'CASCADE'
      });
    }
  }
  expensive_type.init({
    expensive_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    expensive_type_name: DataTypes.STRING,
    expensive_date : DataTypes.DATE,
    created_by : DataTypes.INTEGER,
    description: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'expensive_type',
  });
  return expensive_type;
};