'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class district extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      district.belongsTo(models.state, {
        foreignKey: 'state_id',
        onDelete: 'CASCADE'
      });
    }
  }
  district.init({
    district_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    district_name: DataTypes.STRING,
    state_id: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'district',
    tableName: 'district',
  });
  return district;
};