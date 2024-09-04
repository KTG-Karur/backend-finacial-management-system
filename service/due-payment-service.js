"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');

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
        console.log(error)
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function updateDuePayment(duePaymentId, putData) {
    try {
        const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
        const duePaymentResult = await sequelize.models.due_payment.update(excuteMethod, { where: { due_payment_id: duePaymentId } });
        const req = {
            duePaymentId: duePaymentId
        }
        return await getDuePayment(req);
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

module.exports = {
    getDuePayment,
    updateDuePayment,
    createDuePayment
};