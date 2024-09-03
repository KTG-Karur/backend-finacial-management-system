"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');

async function getLoanStatus(query) {
  try {
    let iql = {};
    if (query && Object.keys(query).length) {
      if (query.loanStatusId) {
        iql.loan_status_id = query.loanStatusId;
      }
      if (query.isActive) {
        iql.is_active = query.isActive;
      }
    }
    const result = await sequelize.models.loan_status.findAll({
      attributes: [['loan_status_id', 'loanStatusId'], ['loan_status_name', 'loanStatusName'],
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

async function createLoanStatus(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const loanStatusResult = await sequelize.models.loan_status.create(excuteMethod);
    const req = {
      loanStatusId: loanStatusResult.loan_status_id
    }
    return await getLoanStatus(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateLoanStatus(loanStatusId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const loanStatusResult = await sequelize.models.loan_status.update(excuteMethod, { where: { loan_status_id: loanStatusId } });
    const req = {
      loanStatusId: loanStatusId
    }
    return await getLoanStatus(req);
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

async function deleteLoanStatus(loanStatusId) {
  try {
    const loanStatusResult = await sequelize.models.loan_status.destroy({ where: { loan_status_id: loanStatusId } });
    if(loanStatusResult == 1){
      return "Deleted Successfully...!";
    }else{
      return "Data Not Founded...!";
    }
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

module.exports = {
  getLoanStatus,
  updateLoanStatus,
  createLoanStatus,
  deleteLoanStatus
};