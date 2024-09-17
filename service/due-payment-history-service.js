"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');
const { dateConversion } = require('../utils/utility');

async function getDuePaymentHistory(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.duePaymentId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` dp.due_payment_id = ${query.duePaymentId}`;
      }
      if (query.categoryId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` l.category_id = ${query.categoryId}`;
      }
      if (query.createdAt) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` MONTH(dph.createdAt) = ${query.createdAt}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` dp.is_active = ${query.isActive}`;
      }
    }
    // const result = await sequelize.query(`SELECT dp.due_payment_id "duePaymentId", dp.loan_id "loanId",l.application_no "applicationNo",
    // l.loan_amount "loanAmount",dp.total_amount "totalAmount",dp.paid_amount "paidAmount", dp.balance_amount "balanceAmount", dp.due_amount "dueAmount",
    // dp.due_start_date "dueStartDate", dp.due_end_date "dueEndDate", dp.is_force_close "isForceClose",
    // dp.force_close_date "forceCloseDate", dp.loan_due_status_id "loanDueStatusId", dp.createdAt, dp.updatedAt
    // FROM due_payments dp
    // left join loans l on l.loan_id = dp.loan_id ${iql}`, {
    //     type: QueryTypes.SELECT,
    //     raw: true,
    //     nest: false
    // });
    console.log(iql)
    const result = await sequelize.query(`SELECT dph.due_payment_history_id "duePaymentHistoryId",
        dph.due_payment_id "duePaymentId",l.application_no "applicationNo",dp.due_amount "dueAmount",
        dph.paid_amount "totalPaidAmount",dph.paid_date "paidDate", dp.total_amount "totalAmount",l.category_id "categoryId",
        a.applicant_code "applicantCode",CONCAT(a.first_name,' ',a.last_name) as applicantName,dph.due_date "dueDate",
        a.contact_no "contactNo",dph.payment_status_id "paymentStatusId", sl.status_name "paymentStatusName"
        FROM due_payment_histories dph
        left join due_payments dp on dp.due_payment_id = dph.due_payment_id
        left join loans l on l.loan_id = dp.loan_id
        left join applicants a on a.applicant_id = l.applicant_id
        left join status_lists sl on sl.status_list_id = dph.payment_status_id ${iql}`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    throw new Error(error?.errors[0]?.message ? error.errors[0].message : error.TypeError || messages.OPERATION_ERROR);
  }
}

async function createDuePaymentHistory(postData) {
  try {
    const monthdata = await dateConversion(postData[0].dueDate, "MM")
    const reqChecker = {
      categoryId: postData[0].categoryId,
      createdAt: monthdata
    }
    console.log(reqChecker)
    const duplicateMonthChecker = await getDuePaymentHistory(reqChecker)
    console.log(duplicateMonthChecker)
    if (duplicateMonthChecker.length > 0) {
      throw new Error(messages.ALREADY_CREATED);
    } else {
      const excuteMethod = _.map(postData, (item) => _.mapKeys(item, (value, key) => _.snakeCase(key)));
      const duePaymentHistoryResult = await sequelize.models.due_payment_history.bulkCreate(excuteMethod);
      const req = {
        categoryId: postData[0].categoryId
      }
      return await getDuePaymentHistory(req);
    }
  } catch (error) {
    throw new Error(messages.OPERATION_ERROR);
  }
}

async function updateDuePaymentHistory(duePaymentHistoryId, putData, externalCall = false) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const duePaymentHistoryResult = await sequelize.models.due_payment_history.update(excuteMethod, { where: { due_payment_history_id: duePaymentHistoryId } });
    if (externalCall) {
      return true;
    } else {
      const req = {
        duePaymentHistoryId: duePaymentHistoryId
      }
      return await getDuePaymentHistory(req);
    }
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}


module.exports = {
  getDuePaymentHistory,
  updateDuePaymentHistory,
  createDuePaymentHistory,
};