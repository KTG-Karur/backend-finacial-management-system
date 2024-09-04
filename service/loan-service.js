"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');

async function getLoan(query) {
  try {
    let iql = "";
        let count = 0;
        if (query && Object.keys(query).length) {
            iql += `WHERE`;
            if (query.loanId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` l.loan_id = ${query.loanId}`;
            }
            if (query.loanStatusId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` l.loan_status_id = ${query.loanStatusId}`;
            }
            if (query.isActive) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` l.is_active = ${query.isActive}`;
            }
        }
    const result = await sequelize.query(
      `SELECT l.loan_id "loanId",
        l.applicant_id "applicantId",CONCAT(a.first_name,' ',a.last_name) as "applicantName" ,
        l.guarantor_id "guarantorId", CONCAT(a3.first_name,' ',a3.last_name) as "guarantorName" ,
        l.application_no "applicationNo",
        l.loan_amount "loanAmount",
        l.created_by "createdById",CONCAT(e.first_name,' ',e.last_name) as createdBy,
        l.loan_status_id "loanStatusId",ls.loan_status_name "loanStatusName",
        l.is_active "isActive", l.createdAt
        FROM loans l
        left join applicants a on a.applicant_id = l.applicant_id 
        left join applicants a3 on a3.applicant_id = l.guarantor_id  
        left join employee e on e.employee_id = l.created_by 
        left join loan_status ls on ls.loan_status_id = l.loan_status_id ${iql} `,
      {
        type: QueryTypes.SELECT,
        raw: true,
        nest: false
      });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function getLoanDetails(query) {
  try {
    let iql = "";
        let count = 0;
        if (query && Object.keys(query).length) {
            iql += `WHERE`;
            if (query.loanId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` l.loan_id = ${query.loanId}`;
            }
            if (query.loanStatusId) {
              iql += count >= 1 ? ` AND` : ``;
              count++;
              iql += ` l.loan_status_id = ${query.loanStatusId}`;
          }
            if (query.isActive) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` l.is_active = ${query.isActive}`;
            }
        }
    const result = await sequelize.query(
      `SELECT l.loan_id "loanId",
      l.applicant_id "applicantId",CONCAT(a.first_name,' ',a.last_name) as "applicantName" ,
      l.co_applicant_id "coApplicantId",CONCAT(a2.first_name,' ',a2.last_name) as "coApplicantName" ,
      l.guarantor_id "guarantorId", CONCAT(a3.first_name,' ',a3.last_name) as "guarantorName" ,
      l.category_id "categoryId", c.category_name "categoryName",
      l.sub_category_id "subCategoryId", sc.sub_category_name "subCategoryName",
      l.interest_rate "interestRate", l.application_no "applicationNo",
      l.loan_amount "loanAmount", l.due_amount "dueAmount", l.due_date "dueDate", l.last_date "lastDate",
      l.disbursed_date "disbursedDate", l.disbursed_amount "disbursedAmount", l.tenure_period "tenurePeriod",
      l.disbursed_method_id "disbursedMethodId",dm.disbursed_method_name "disbursedMethodName",
      l.bank_account_id "bankAccountId",ba.account_holder_name "accountHolderName",ba.bank_name "bankName",
      ba.branch_name "branchName",ba.account_no "accountNo",ba.ifsc_code "ifscCode",
      l.created_by "createdById",CONCAT(e.first_name,' ',e.last_name) as createdBy,
      l.approved_by "approvedById", CONCAT(e2.first_name,' ',e2.last_name) as approvedBy,
      l.approved_date "approvedDate",
      l.loan_status_id "loanStatusId",ls.loan_status_name "loanStatusName",
      l.is_active "isActive", l.createdAt, l.updatedAt
      FROM loans l
      left join applicants a on a.applicant_id = l.applicant_id 
      left join applicants a2 on a2.applicant_id = l.co_applicant_id
      left join applicants a3 on a3.applicant_id = l.guarantor_id 
      left join categories c on c.category_id = l.category_id 
      left join sub_categories sc on sc.sub_category_id = l.sub_category_id 
      left join disbursed_method dm on dm.disbursed_method_id = l.disbursed_method_id 
      left join bank_accounts ba on ba.bank_account_id = l.bank_account_id 
      left join employee e on e.employee_id = l.created_by 
      left join employee e2 on e2.employee_id = l.approved_by 
      left join loan_status ls on ls.loan_status_id = l.loan_status_id  ${iql} `,
      {
        type: QueryTypes.SELECT,
        raw: true,
        nest: false
      });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createLoan(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const loanResult = await sequelize.models.loan.create(excuteMethod);
    const req = {
      loanId: loanResult.loan_id
    }
    return await getLoan(req);
  } catch (error) {
    console.error(error);
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateLoan(loanId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const loanResult = await sequelize.models.loan.update(excuteMethod, { where: { loan_id: loanId } });
    const req = {
      loanId: loanId
    }
    return await getLoan(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

module.exports = {
  getLoan,
  getLoanDetails,
  updateLoan,
  createLoan,
};