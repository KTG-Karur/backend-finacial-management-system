"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');
const { updateDuePaymentHistory } = require('./due-payment-history-service');

async function getDuePayment(query) {
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
            if (query.paymentStatusId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` dph.payment_status_id = ${query.paymentStatusId}`;
            }
            if (query.categoryId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` l.category_id = ${query.categoryId}`;
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
        const result = await sequelize.query(`SELECT dph.due_payment_history_id "duePaymentHistoryId",
            dph.due_payment_id "duePaymentId",l.application_no "applicationNo",dp.due_amount "dueAmount",
            dph.paid_amount "totalPaidAmount",dph.paid_date "paidDate", dph.fine_amount "fineAmount", dp.total_amount "totalAmount",l.category_id "categoryId",
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
        console.log(error)
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function getDuePaymentDetails(query) {
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
            if (query.dueDate) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` DATE(l.due_date) = '${query.dueDate}'`;
            }   
            if (query.isForceClose) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` dp.is_force_close = ${query.isForceClose}`;
            }
            if (query.isActive) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` dp.is_active = ${query.isActive}`;
            }
        }
        const result = await sequelize.query(`SELECT dp.due_payment_id "duePaymentId", dp.loan_id "loanId",l.application_no "applicationNo",
        l.loan_amount "loanAmount",dp.total_amount "totalAmount",dp.paid_amount "paidAmount", dp.balance_amount "balanceAmount", dp.due_amount "dueAmount",
        dp.due_start_date "dueStartDate", dp.due_end_date "dueEndDate", dp.is_force_close "isForceClose",
        dp.force_close_date "forceCloseDate", dp.loan_due_status_id "loanDueStatusId", dp.createdAt, dp.updatedAt
        FROM due_payments dp
        left join loans l on l.loan_id = dp.loan_id ${iql}`, {
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

async function createDuePayment(postData) {
    try {
        const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
        const duePaymentResult = await sequelize.models.due_payment.create(excuteMethod);
        const req = {
            duePaymentId: duePaymentResult.due_payment_id
        }
        return await getDuePayment(req);
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function updateDuePayment(duePaymentId, putData) {
    try {
        const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
        const duePaymentResult = await sequelize.models.due_payment.update(excuteMethod, { where: { due_payment_id: duePaymentId } });
        const infoData = putData.duePaymentHistoryInfo 
        const updateId = infoData.duePaymentHistoryId
        delete infoData.duePaymentHistoryId
        const duePaymentHistory = await updateDuePaymentHistory(updateId, infoData, true)
        const req = {
            duePaymentId: duePaymentId
        }
        return await getDuePayment(req);
    } catch (error) {
        console.log(error)
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

module.exports = {
    getDuePayment,
    getDuePaymentDetails,
    updateDuePayment,
    createDuePayment
};