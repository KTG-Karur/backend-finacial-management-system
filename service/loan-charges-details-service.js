"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');

async function getLoanChargesDetails(query) {
  try {
    let iql = {};
    if (query && Object.keys(query).length) {
      if (query.loanChargesDetailsId) {
        iql.loan_charges_details_id = query.loanChargesDetailsId;
      }
      if (query.isActive) {
        iql.is_active = query.isActive;
      }
    }
    const result = await sequelize.models.loan_charges_details.findAll({
      attributes: [['loan_charges_details_id', 'loanChargesDetailsId'],
      ['loan_id', 'loan_id'],
      ['loan_charge_id', 'loanChargeId'],
      ['charge_amount', 'chargeAmount'],
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

async function createLoanChargesDetails(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const loanChargesDetailsResult = await sequelize.models.loan_charges_details.create(excuteMethod);
    const req = {
      loanChargesDetailsId: loanChargesDetailsResult.loan_charges_details_id
    }
    return await getLoanChargesDetails(req);
  } catch (error) {
    console.error(error);
    throw new Error(messages.OPERATION_ERROR);
  }
}

async function updateLoanChargesDetails(loanChargesDetailsId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const loanChargesDetailsResult = await sequelize.models.loan_charges_details.update(excuteMethod, { where: { loan_charges_details_id: loanChargesDetailsId } });
    const req = {
      loanChargesDetailsId: loanChargesDetailsId
    }
    return await getLoanChargesDetails(req);
} catch (error) {
    throw error;
}
}


module.exports = {
  getLoanChargesDetails,
  updateLoanChargesDetails,
  createLoanChargesDetails
};