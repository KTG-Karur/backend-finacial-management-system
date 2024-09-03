"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');

async function getLoanChargesType(query) {
  try {
    let iql = {};
    if (query && Object.keys(query).length) {
      if (query.loanChargesId) {
        iql.loan_charges_id = query.loanChargesId;
      }
      if (query.isActive) {
        iql.is_active = query.isActive;
      }
    }
    const result = await sequelize.models.loan_charges.findAll({
      attributes: [['loan_charges_id', 'loanChargesId'], 
      ['loan_charges_name', 'loanChargesName'],
      ['is_percentage', 'isPercentage'],
      ['charges_amount', 'chargesAmount'],
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

async function createLoanChargesType(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const loanChargesResult = await sequelize.models.loan_charges.create(excuteMethod);
    const req = {
      loanChargesId: loanChargesResult.loan_charges_id
    }
    return await getLoanChargesType(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateLoanChargesType(loanChargesId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const loanChargesResult = await sequelize.models.loan_charges.update(excuteMethod, { where: { loan_charges_id: loanChargesId } });
    const req = {
      loanChargesId: loanChargesId
    }
    return await getLoanChargesType(req);
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

async function deleteLoanChargesType(loanChargesId) {
  try {
    const loanChargesResult = await sequelize.models.loan_charges.destroy({ where: { loan_charges_id: loanChargesId } });
    if(loanChargesResult == 1){
      return "Deleted Successfully...!";
    }else{
      return "Data Not Founded...!";
    }
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

module.exports = {
  getLoanChargesType,
  updateLoanChargesType,
  createLoanChargesType,
  deleteLoanChargesType
};