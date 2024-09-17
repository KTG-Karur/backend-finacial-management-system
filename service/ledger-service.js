"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');

async function getLedgerEmployee(query) {
    try {
        let iql = "";
        let count = 0;
        if (query && Object.keys(query).length) {
            iql += `WHERE`;
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
        const result = await sequelize.query(`SELECT emp.employee_id "employeeId",CONCAT(emp.first_name,' ',emp.last_name) AS employeeName,
            emp.contact_no "contactNo", emp.date_of_joining "dateOfJoining", emp.role_id "roleId", r.role_name "roleName",emp.gender_id "genderId",
            emp.department_id "departmentId",d.department_name "departmentName",emp.employee_code "employeeCode", emp.is_active "isActive"
            FROM employee emp
            left join role r on r.role_id = emp.role_id
            left join department d on d.department_id = emp.department_id ${iql}`, {
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