"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { Op } = require('sequelize');

async function getEmployee(query) {
  try {
    let iql = {};
    if (query && Object.keys(query).length) {
      if (query.employeeId) {
        iql.employee_id = query.employeeId;
      }
      if (query.isActive) {
        iql.is_active = query.isActive;
      }
    }
    const result = await sequelize.models.employee.findAll({
      attributes: [['employee_id', 'employeeId'],
       ['first_name', 'firstName'],
       ['last_name', 'lastName'],
       ['dob', 'dob'],
       ['contact_no', 'contactNo'],
       ['email_id', 'emailId'],
       ['department_id', 'departmentId'],[sequelize.col('department.department_name'), 'departmentName'],
      ['is_active', 'isActive'], ['createdAt', 'createdAt']],
      where: iql,
      include: [
        {
            model: sequelize.models.department,
            as: 'department',
            required: false,
            on: {
                department_id: {
                    [Op.eq]: sequelize.col('employee.department_id')
                }
            },
            attributes: []
        }],
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    throw new Error(messages.OPERATION_ERROR);
  }
}

async function createEmployee(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const employeeResult = await sequelize.models.employee.create(excuteMethod);
    const req = {
      employeeId: employeeResult.employee_id
    }
    return await getEmployee(req);
  } catch (error) {
    console.error(error);
    throw new Error(messages.OPERATION_ERROR);
  }
}

async function updateEmployee(employeeId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const employeeResult = await sequelize.models.employee.update(excuteMethod, { where: { employee_id: employeeId } });
    const req = {
      employeeId: employeeId
    }
    return await getEmployee(req);
} catch (error) {
    throw error;
}
}


module.exports = {
  getEmployee,
  updateEmployee,
  createEmployee,
};