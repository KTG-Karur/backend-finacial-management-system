"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');

async function getCashHistory(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
        iql += `WHERE `;
        if (query.cashHistoryId) {
            iql += count >= 1 ? ` AND` : ``;
            count++;
            iql += ` cash_history_id = ${query.cashHistoryId}`;
        }
        if (query.isActive) {
            iql += count >= 1 ? ` AND` : ``;
            count++;
            iql += ` is_active = ${query.isActive}`;
        }
    }
    const result = await sequelize.query(`SELECT cash_history_id "cashHistoryId", contra_id "contraId",
        two_thous_count "twoThousCount", five_hund_count "fiveHundCount", hund_count "hundCount",
        five_coin_count "fiveCoinCount", two_coin_count "twoCoinCount",
        one_coin_count "oneCoinCount", amount, createdAt, updatedAt
        FROM cash_histories ${iql}`, {
        type: QueryTypes.SELECT,
        raw: true,
        nest: false
    });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createCashHistory(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const cashHistoryResult = await sequelize.models.cash_history.create(excuteMethod);
    const req = {
      cashHistoryId: cashHistoryResult.cash_history_id
    }
    return await getCashHistory(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateCashHistory(cashHistoryId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const cashHistoryResult = await sequelize.models.cash_history.update(excuteMethod, { where: { cash_history_id: cashHistoryId } });
    const req = {
      cashHistoryId: cashHistoryId
    }
    return await getCashHistory(req);
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

module.exports = {
  getCashHistory,
  updateCashHistory,
  createCashHistory
};