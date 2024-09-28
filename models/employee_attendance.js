'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class employee_attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  employee_attendance.init({
    employee_attendance_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    attendance_date: DataTypes.DATE,
    employee_id: DataTypes.INTEGER,
    check_in: DataTypes.STRING,
    check_out: DataTypes.STRING,
    attendance_status_id: DataTypes.INTEGER,
    reason: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'employee_attendance',
    tableName: 'employee_attendance',
  });
  return employee_attendance;
};