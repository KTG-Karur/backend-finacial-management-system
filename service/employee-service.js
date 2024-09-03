"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { Op } = require('sequelize');
const { QueryTypes } = require('sequelize');

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
    const result = await sequelize.query(`SELECT emp.employee_id "employeeId", emp.first_name "firstName", emp.last_name "lastName", emp.dob, 
    emp.contact_no "contactNo", emp.email_id "emailId", emp.date_of_joining "dateOfJoining",
    emp.date_of_reliving "dateOfReliving", emp.role_id "roleId", r.role_name "roleName",emp.gender_id "genderId",
    emp.department_id "departmentId",d.department_name "departmentName",g.gender_name "genderName",
    emp.designation_id "designationId",d2.designation_name "designationName", 
    emp.is_active "isActive", emp.createdAt, emp.updatedAt, emp.employee_code "employeeCode",
    refered_by "referedBy"
    FROM employee emp
    left join role r on r.role_id = emp.role_id 
    left join department d on d.department_id = emp.department_id 
    left join designation d2 on d2.designation_id = emp.designation_id 
    left join gender g on g.gender_id = emp.gender_id ${iql != "" && iql}`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
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
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
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
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}


module.exports = {
  getEmployee,
  updateEmployee,
  createEmployee,
};