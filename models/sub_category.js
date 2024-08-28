'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sub_category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      sub_category.belongsTo(models.category, {
        foreignKey: 'category_id',
        onDelete: 'CASCADE'
      });
    }
  }
  sub_category.init({
    sub_category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sub_category_name: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
    interest_rate: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'sub_category',
  });
  return sub_category;
};