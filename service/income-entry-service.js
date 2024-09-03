"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { Op } = require('sequelize');

async function getIncomeEntry(query) {
  try {
    let iql = {};
    if (query && Object.keys(query).length) {
      if (query.incomeEntryId) {
        iql.income_entry_id = query.incomeEntryId;
      }
      if (query.isActive) {
        iql.is_active = query.isActive;
      }
    }
    const result = await sequelize.models.income_entry.findAll({
      attributes: [['income_entry_id', 'incomeEntryId'], 
      ['income_type_id', 'incomeTypeId'],
      ['description', 'description'],
      ['created_by', 'createdBy'],
      ['income_date', 'incomeDate'],
      ['income_amount', 'incomeAmount'],
      [sequelize.col('income_type.income_type_name'), 'incomeTypeName'],
      ['is_active', 'isActive'], ['createdAt', 'createdAt']],
      where: iql,
      order: [['income_entry_id', 'DESC']],
      include: [
        {
            model: sequelize.models.income_type,
            as: 'income_type',
            required: false,
            on: {
              income_type_id: {
                    [Op.eq]: sequelize.col('income_entry.income_type_id')
                }
            },
            attributes: []
        }],
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    console.log(error)
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createIncomeEntry(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const income_entryResult = await sequelize.models.income_entry.create(excuteMethod);
    const req = {
      incomeEntryId: income_entryResult.income_entry_id
    }
    return await getIncomeEntry(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateIncomeEntry(income_entryId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const income_entryResult = await sequelize.models.income_entry.update(excuteMethod, { where: { income_entry_id: income_entryId } });
    const req = {
        incomeEntryId: income_entryId
    }
    return await getIncomeEntry(req);
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

module.exports = {
  getIncomeEntry,
  updateIncomeEntry,
  createIncomeEntry
};