"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');

async function getLoanCharges(query) {
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
    const result = await sequelize.models.loanCharges.findAll({
      attributes: [['loan_charges_id', 'loanChargesId'], ['loanCharges_name', 'loanChargesName'],
      ['is_active', 'isActive'], ['createdAt', 'createdAt']],
      where: iql,
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    throw new Error(messages.OPERATION_ERROR);
  }
}

async function createLoanCharges(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const loanChargesResult = await sequelize.models.loanCharges.create(excuteMethod);
    const req = {
      loanChargesId: loanChargesResult.loanCharges_id
    }
    return await getLoanCharges(req);
  } catch (error) {
    console.error(error);
    throw new Error(messages.OPERATION_ERROR);
  }
}

async function updateLoanCharges(loanChargesId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const loanChargesResult = await sequelize.models.loanCharges.update(excuteMethod, { where: { loanCharges_id: loanChargesId } });
    const req = {
      loanChargesId: loanChargesId
    }
    return await getLoanCharges(req);
} catch (error) {
    throw error;
}
}

async function deleteLoanCharges(loanChargesId) {
  try {
    const loanChargesResult = await sequelize.models.loanCharges.destroy({ where: { loanCharges_id: loanChargesId } });
    if(loanChargesResult == 1){
      return "Deleted Successfully...!";
    }else{
      return "Data Not Founded...!";
    }
} catch (error) {
    throw error;
}
}

module.exports = {
  getLoanCharges,
  updateLoanCharges,
  createLoanCharges,
  deleteLoanCharges
};