"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');

async function getLoan(query) {
  try {
    let iql = {};
    if (query && Object.keys(query).length) {
      if (query.loanId) {
        iql.loan_id = query.loanId;
      }
      if (query.isActive) {
        iql.is_active = query.isActive;
      }
    }
    const result = await sequelize.models.loan.findAll({
      attributes: [['loan_id', 'loanId'], ['loan_name', 'loanName'],
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

async function createLoan(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const loanResult = await sequelize.models.loan.create(excuteMethod);
    const req = {
      loanId: loanResult.loan_id
    }
    return await getLoan(req);
  } catch (error) {
    console.error(error);
    throw new Error(messages.OPERATION_ERROR);
  }
}

async function updateLoan(loanId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const loanResult = await sequelize.models.loan.update(excuteMethod, { where: { loan_id: loanId } });
    const req = {
      loanId: loanId
    }
    return await getLoan(req);
} catch (error) {
    throw error;
}}

module.exports = {
  getLoan,
  updateLoan,
  createLoan,
};