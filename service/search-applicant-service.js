"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');
const { getDuePaymentHistory } = require('./due-payment-history-service');

async function getSearchApplicant(query) {
    try {
        let iql = "";
        let count = 1;
        if (query && Object.keys(query).length) {
            iql += `WHERE is_borrower = 0`;
            if (query.applicantCode) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` a.applicant_code = ${query.applicantCode}`;
            }
            if (query.customerName) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                
                iql += ` LOWER(REPLACE(CONCAT(a.first_name, ' ', a.last_name), ' ', '')) LIKE LOWER(REPLACE('%${query.customerName}%', ' ', ''));`;
            }
            if (query.applicationNo) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` l.application_no = '${query.applicationNo}'`;
            }
            if (query.contactNo) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` a.contact_no = '${query.contactNo}'`;
            }
            if (query.fromDate && query.toDate) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` DATE(l.createdAt) BETWEEN '${query.fromDate}' AND '${query.toDate}'`;
            }
            if (query.loanStatusId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` l.loan_status_id = '${query.loanStatusId}'`;
            }
            if (query.categoryId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` l.category_id = '${query.categoryId}'`;
            }
            if (query.isActive) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` a.is_active = ${query.isActive}`;
            }
        }
        const result = await sequelize.query(`SELECT a.applicant_id "applicantId", a.applicant_code "applicantCode", 
            CONCAT(a.first_name,' ' ,a.last_name) as applicantName,l.application_no "applicationNo",
            a.contact_no "contactNo" , l.loan_id "loanId", l.category_id "categoryId", c.category_name "categoryName",
            l.interest_rate "interestRate",l.loan_date "loanDate",l.loan_amount "loanAmount", l.due_amount "dueAmount"
            FROM applicants a
            left join loans l on l.applicant_id = a.applicant_id 
            left join categories c on c.category_id = l.category_id ${iql}`, {
            type: QueryTypes.SELECT,
            raw: true,
            nest: false,
        });
        if(result.length > 0){
            return result;
        }else{
            throw new Error(messages.DATA_NOT_FOUND);
        }
    } catch (error) {
        throw new Error(messages.DATA_NOT_FOUND);
    }
}

async function getSearchLoanDetails(query) {
    try {
        let iql = "";
        let count = 1;
        if (query && Object.keys(query).length) {
            iql += `WHERE a.is_borrower = 0`;
            if (query.loanId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` l.loan_id = ${query.loanId}`;
            }
        }
        let result = await sequelize.query(`select l.loan_id "loanId",l.application_no "applicationNo",l.loan_date "loanDate",
            l.disbursed_date "disbursedDate",l.interest_rate "interestRate",l.loan_amount "loanAmount",
            l.tenure_period "tenurePeriod",l.due_date "dueDate", l.disbursed_method_id "disbursedMethodId",
            l.applicant_id "applicantId",a.contact_no "contactNo",
            CONCAT(a.first_name,' ',a.last_name) as customerName,
            a.applicant_code "applicantCode",
            CONCAT(a2.first_name,' ',a2.last_name) as coApplicant,
            CONCAT(a3.first_name,' ',a3.last_name) as guarantor
            from loans l
            left join applicants a on a.applicant_id = l.applicant_id
            left join applicants a2 on a2.applicant_id = l.co_applicant_id 
            left join applicants a3 on a3.applicant_id = l.guarantor_id  ${iql}`, {
            type: QueryTypes.SELECT,
            raw: true,
            nest: false,
        });
        const paymentDetails = await getDuePaymentHistory(query)
        if(result.length > 0){
            result[0].paymentDetails = paymentDetails
        //    const resultData = result
            return result;
        }else{
            console.log(error)
            throw new Error(messages.DATA_NOT_FOUND);
        }
    } catch (error) {
        console.log(error)
        throw new Error(messages.DATA_NOT_FOUND);
    }
}

module.exports = {
    getSearchApplicant,
    getSearchLoanDetails
};