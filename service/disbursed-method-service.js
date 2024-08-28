"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');

async function getDisbursedMethod(query) {
  try {
    let iql = {};
    if (query && Object.keys(query).length) {
      if (query.disbursedMethodId) {
        iql.disbursed_method_id = query.disbursedMethodId;
      }
      if (query.isActive) {
        iql.is_active = query.isActive;
      }
    }
    const result = await sequelize.models.disbursed_method.findAll({
      attributes: [['disbursed_method_id', 'disbursedMethodId'], ['disbursed_method_name', 'disbursedMethodName'],
      ['is_active', 'isActive'], ['createdAt', 'createdAt']],
      where: iql,
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    console.log(error)
    throw new Error(messages.OPERATION_ERROR);
  }
}

async function createDisbursedMethod(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const disbursedMethodResult = await sequelize.models.disbursed_method.create(excuteMethod);
    const req = {
      disbursedMethodId: disbursedMethodResult.disbursed_method_id
    }
    return await getDisbursedMethod(req);
  } catch (error) {
    console.error(error);
    throw new Error(messages.OPERATION_ERROR);
  }
}

async function updateDisbursedMethod(disbursedMethodId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const disbursedMethodResult = await sequelize.models.disbursed_method.update(excuteMethod, { where: { disbursed_method_id: disbursedMethodId } });
    const req = {
      disbursedMethodId: disbursedMethodId
    }
    return await getDisbursedMethod(req);
} catch (error) {
    throw error;
}
}

async function deleteDisbursedMethod(disbursedMethodId) {
  try {
    const disbursedMethodResult = await sequelize.models.disbursed_method.destroy({ where: { disbursed_method_id: disbursedMethodId } });
    if(disbursedMethodResult == 1){
      return "Deleted Successfully...!";
    }else{
      return "Data Not Founded...!";
    }
} catch (error) {
    throw error;
}
}

module.exports = {
  getDisbursedMethod,
  updateDisbursedMethod,
  createDisbursedMethod,
  deleteDisbursedMethod
};