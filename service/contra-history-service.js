"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');

async function getContraHistory(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
        iql += `WHERE `;
        if (query.contraHistoryId) {
            iql += count >= 1 ? ` AND` : ``;
            count++;
            iql += ` ch.contra_history_id = ${query.contraHistoryId}`;
        }
        if (query.isActive) {
            iql += count >= 1 ? ` AND` : ``;
            count++;
            iql += ` ch.is_active = ${query.isActive}`;
        }
    }
    const result = await sequelize.query(`SELECT ch.contra_history_id "contraHistoryId", ch.contra_id "contraId",
        ch.transaction_id "transactionId",c.disbursed_method_id "disbursedMethodId",
        sl.status_name "methodName",
        ch.cash_history_id "cashHistoryId", ch.amount, ch.createdAt, ch.updatedAt
        FROM contra_histories ch
        left join contras c on c.contra_id = ch.contra_id 
        left join status_lists sl on sl.status_list_id = c.disbursed_method_id ${iql}`, {
        type: QueryTypes.SELECT,
        raw: true,
        nest: false
    });
    return result;
  } catch (error) {
    console.log(error)
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createContraHistory(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const contraHistoryResult = await sequelize.models.contra_history.create(excuteMethod);
    const req = {
      contraHistoryId: contraHistoryResult.contra_history_id
    }
    return await getContraHistory(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateContraHistory(contraHistoryId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const contraHistoryResult = await sequelize.models.contra_history.update(excuteMethod, { where: { contra_history_id: contraHistoryId } });
    const req = {
      contraHistoryId: contraHistoryId
    }
    return await getContraHistory(req);
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

module.exports = {
  getContraHistory,
  updateContraHistory,
  createContraHistory
};