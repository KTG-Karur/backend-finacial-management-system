"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { Op } = require('sequelize');

async function getExpensiveType(query) {
  try {
    let iql = {};
    if (query && Object.keys(query).length) {
      if (query.expensiveTypeId) {
        iql.expensive_type_id = query.expensiveTypeId;
      }
      if (query.isActive) {
        iql.is_active = query.isActive;
      }
    }
    const result = await sequelize.models.expensive_type.findAll({
      attributes: [['expensive_type_id', 'expensiveTypeId'], 
      ['expensive_type_name', 'expensiveTypeName'],
      ['is_active', 'isActive'], ['createdAt', 'createdAt']],
      where: iql,
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createExpensiveType(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const expensiveTypeResult = await sequelize.models.expensive_type.create(excuteMethod);
    const req = {
      expensiveTypeId: expensiveTypeResult.expensive_type_id
    }
    return await getExpensiveType(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateExpensiveType(expensiveTypeId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const expensiveTypeResult = await sequelize.models.expensive_type.update(excuteMethod, { where: { expensive_type_id: expensiveTypeId } });
    const req = {
      expensiveTypeId: expensiveTypeId
    }
    return await getExpensiveType(req);
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

async function deleteExpensiveType(expensiveTypeId) {
  try {
    const expensiveTypeResult = await sequelize.models.expensive_type.destroy({ where: { expensive_type_id: expensiveTypeId } });
    if(expensiveTypeResult == 1){
      return "Deleted Successfully...!";
    }else{
      return "Data Not Founded...!";
    }
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

module.exports = {
  getExpensiveType,
  updateExpensiveType,
  createExpensiveType,
  deleteExpensiveType
};