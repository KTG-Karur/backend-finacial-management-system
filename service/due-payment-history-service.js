"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');

async function getDuePaymentHistory(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.duePaymentHistoryId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` due_payment_history_id = ${query.duePaymentHistoryId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` is_active = ${query.isActive}`;
      }
    }
    const result = await sequelize.query(`SELECT due_payment_history_id "duePaymentHistoryId", due_payment_id "duePaymentId",
          paid_amount "paidAmount", balance_amount "balanceAmount", created_by "createdBy",
          paid_date "paidDate", fine_amount "fineAmount", createdAt, updatedAt
          FROM due_payment_histories ${iql}`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createDuePaymentHistory(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const duePaymentHistoryResult = await sequelize.models.due_payment_history.create(excuteMethod);
    const req = {
      duePaymentHistoryId: duePaymentHistoryResult.due_payment_history_id
    }
    return await getDuePaymentHistory(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateDuePaymentHistory(duePaymentHistoryId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    console.log(excuteMethod)
    const duePaymentHistoryResult = await sequelize.models.due_payment_history.update(excuteMethod, { where: { due_payment_history_id: duePaymentHistoryId } });
    const req = {
      duePaymentHistoryId: duePaymentHistoryId
    }
    return await getDuePaymentHistory(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}


module.exports = {
  getDuePaymentHistory,
  updateDuePaymentHistory,
  createDuePaymentHistory,
};