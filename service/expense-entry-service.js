"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { Op } = require('sequelize');
const { createDayBookHistory } = require('./day-book-history-service');

async function getExpenseEntry(query) {
  try {
    let iql = {};
    if (query && Object.keys(query).length) {
      if (query.expenseEntryId) {
        iql.expense_entry_id = query.expenseEntryId;
      }
      if (query.isActive) {
        iql.is_active = query.isActive;
      }
    }
    const result = await sequelize.models.expense_entry.findAll({
      attributes: [['expense_entry_id', 'expenseEntryId'],
      ['expensive_type_id', 'expenseTypeId'],
      ['description', 'description'], [sequelize.col('expensive_type.expensive_type_name'), 'expenseTypeName'],
      ['created_by', 'createdBy'],
      ['expense_date', 'expenseDate'],
      ['expense_amount', 'expenseAmount'],
      ['is_active', 'isActive'], ['createdAt', 'createdAt']],
      where: iql,
      include: [
        {
            model: sequelize.models.expensive_type,
            as: 'expensive_type',
            required: false,
            on: {
              expensive_type_id: {
                    [Op.eq]: sequelize.col('expense_entry.expensive_type_id')
                }
            },
            attributes: []
        }],
      order: [['expense_entry_id', 'DESC']],
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    console.log(error)
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createExpenseEntry(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const expenseEntryResult = await sequelize.models.expense_entry.create(excuteMethod);
    const dayBookReq={
      respectiveId : expenseEntryResult.expense_entry_id,
      dbCategoryId : 12,
      dbSubCategoryId : 15,
      amount : postData.expenseAmount,
      createdBy : postData.createdBy
    }
    const dayBookEntry = await createDayBookHistory(dayBookReq)
    const req = {
      expenseEntryId: expenseEntryResult.expense_entry_id
    }
    return await getExpenseEntry(req);
  } catch (error) {
    console.log(error)
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateExpenseEntry(expenseEntryId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const expenseEntryResult = await sequelize.models.expense_entry.update(excuteMethod, { where: { expense_entry_id: expenseEntryId } });
    const req = {
      expenseEntryId: expenseEntryId
    }
    return await getExpenseEntry(req);
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

module.exports = {
  getExpenseEntry,
  updateExpenseEntry,
  createExpenseEntry
};