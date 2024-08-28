'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class state extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      state.belongsTo(models.country, {
        foreignKey: 'country_id',
        onDelete: 'CASCADE'
      });

      state.hasMany(models.district, {
        foreignKey: 'state_id'
      });
      
    }
  }
  state.init({
    state_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    country_id: DataTypes.INTEGER,
    state_name: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'state',
  });
  return state;
};