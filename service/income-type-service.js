"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { Op } = require('sequelize');

async function getIncomeType(query) {
  try {
    let iql = {};
    if (query && Object.keys(query).length) {
      if (query.incomeTypeId) {
        iql.income_type_id = query.incomeTypeId;
      }
      if (query.isActive) {
        iql.is_active = query.isActive;
      }
    }
    const result = await sequelize.models.income_type.findAll({
      attributes: [['income_type_id', 'incomeTypeId'], ['income_type_name', 'incomeTypeName'],
      // ['created_by', 'employeeId'],
      // [sequelize.col('employee.first_name'), 'firstName'],
      // [sequelize.col('employee.last_name'), 'lastName'],
      // ['income_date', 'incomeDate'],
      // ['description', 'description'],
      ['is_active', 'isActive'], ['createdAt', 'createdAt']],
      where: iql,
      // include: [
      //   {
      //     model: sequelize.models.employee,
      //     as: 'employee',
      //     required: false,
      //     on: {
      //       employee_id: {
      //         [Op.eq]: sequelize.col('income_type.created_by')
      //       }
      //     },
      //     attributes: []
      //   }],
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createIncomeType(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const incomeTypeResult = await sequelize.models.income_type.create(excuteMethod);
    const req = {
      incomeTypeId: incomeTypeResult.income_type_id
    }
    return await getIncomeType(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateIncomeType(incomeTypeId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const incomeTypeResult = await sequelize.models.income_type.update(excuteMethod, { where: { income_type_id: incomeTypeId } });
    const req = {
      incomeTypeId: incomeTypeId
    }
    return await getIncomeType(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function deleteIncomeType(incomeTypeId) {
  try {
    const incomeTypeResult = await sequelize.models.income_type.destroy({ where: { income_type_id: incomeTypeId } });
    if (incomeTypeResult == 1) {
      return "Deleted Successfully...!";
    } else {
      return "Data Not Founded...!";
    }
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

module.exports = {
  getIncomeType,
  updateIncomeType,
  createIncomeType,
  deleteIncomeType
};