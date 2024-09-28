"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');

async function getLedgerEmployee(query) {
    try {
        let iql = `WHERE loan_status_id = 4`;
        let count = 1;
        if (query && Object.keys(query).length) {
            // iql += `WHERE loan_status_id = 4`;
            if (query.employeeId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` emp.employee_id = ${query.employeeId}`;
            }
            if (query.isActive) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` emp.is_active = ${query.isActive}`;
            }
        }
        console.log(iql)
        const result = await sequelize.query(`SELECT l.loan_id "loanId", l.applicant_id "applicantId", CONCAT(a.first_name,' ',a.last_name) as "customerName",
            a.contact_no "contactNo",a.applicant_code "applicantCode",
            l.category_id "categoryId",c.category_name "categoryName",
            l.interest_rate "interestRate", l.application_no "applicationNo",
            l.loan_amount "loanAmount", l.due_amount "dueAmount", l.due_date "dueDate",
            l.disbursed_date "disbursedDate", l.created_by "createdBy",
            l.loan_status_id "loanStatusId",sl.status_name "statusName",
            loan_date "loanDate", transaction_id
            FROM loans l
            left join applicants a on a.applicant_id = l.applicant_id 
            left join categories c on c.category_id = l.category_id 
            left join status_lists sl on sl.status_list_id = l.loan_status_id ${iql}`, {
            type: QueryTypes.SELECT,
            raw: true,
            nest: false
        });
        return result;
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function getLedgerCustomer(query) {
    try {
        let iql = "";
        let count = 0;
        if (query && Object.keys(query).length) {
            iql += `WHERE`;
            if (query.applicantId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` a.applicant_id = ${query.applicantId}`;
            }
            if (query.isBorrower) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` a.is_borrower = ${query.isBorrower}`;
            }
            if (query.isActive) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` a.is_active = ${query.isActive}`;
            }
        }
        const result = await sequelize.query(`SELECT a.applicant_id "applicantId", a.applicant_code "applicantCode", 
            CONCAT(a.first_name,' ' ,a.last_name) as applicantName,a.contact_no "contactNo",a.createdAt, a.is_active "isActive"
            FROM applicants a ${iql}`, {
            type: QueryTypes.SELECT,
            raw: true,
            nest: false,
        });
        return result;
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function getLedgerDetails(query) {
    try {
        let iql = "";
        let count = 0;
        if (query && Object.keys(query).length) {
            iql += `WHERE`;
            if (query.employeeId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` dbh.created_by = ${query.employeeId}`;
            }
            if (query.customerId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` dbh.created_by = ${query.customerId}`;
            }
            if (query.investorId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` dbh.created_by = ${query.investorId}`;
            }
            if (query.fromDate && query.toDate) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` dbh.createdAt BETWEEN '${query.fromDate}' AND '${query.toDate}'`;
            }
        }
        console.log(iql)
        const result = await sequelize.query(`SELECT dbh.day_book_history_id "dayBookHistoryId",
            dbh.db_category_id "dbCategoryId",sl2.status_name "categoryName", sl.status_name "particular",
            dbh.db_sub_category_id "dbSubCategoryId", dbh.amount, dbh.day_book_id "dayBookId", dbh.createdAt, dbh.updatedAt,
            dbh.created_by "createdById", CONCAT(e.first_name,' ',e.last_name) as createdBy, dbh.is_closed "isClosed"
            FROM day_book_histories dbh
            left join status_lists sl on sl.status_list_id = dbh.db_sub_category_id 
            left join status_lists sl2 on sl2.status_list_id = dbh.db_category_id 
            left join employee e on e.employee_id = dbh.created_by  ${iql}`, {
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

module.exports = {
    getLedgerEmployee,
    getLedgerCustomer,
    getLedgerDetails
};