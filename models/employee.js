'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      employee.belongsTo(models.department, {
        foreignKey: 'department_id',
        onDelete: 'CASCADE'
      });
      employee.belongsTo(models.designation, {
        foreignKey: 'designation_id',
        onDelete: 'CASCADE'
      });
      employee.belongsTo(models.role, {
        foreignKey: 'role_id',
        onDelete: 'CASCADE'
      });
      employee.hasMany(models.user, {
        foreignKey: 'employee_id'
      });
    }
  }
  employee.init({
    employee_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    employee_code: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    dob: DataTypes.DATE,
    contact_no: DataTypes.STRING,
    email_id: DataTypes.STRING,
    date_of_joining: DataTypes.DATE,
    date_of_reliving: DataTypes.DATE,
    role_id: DataTypes.INTEGER,
    department_id: DataTypes.INTEGER,
    designation_id: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'employee',
    tableName: 'employee',
  });
  return employee;
};