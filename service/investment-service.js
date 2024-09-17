"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const moment = require('moment');
const { QueryTypes } = require('sequelize');
const { createDuePayment } = require('./due-payment-service');
const { createLoanChargesDetails, updateLoanChargesDetails, getLoanChargesDetails } = require('./loan-charges-details-service');
const { generateSerialNumber } = require('../utils/utility');

async function getInvestment(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.investmentId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` i.investment_id = ${query.investmentId}`;
      }
      if (query.investmentStatusId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` i.investment_status_id = ${query.investmentStatusId}`;
      }
      if (query.investmentStatusId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` i.investment_status_id = ${query.investmentStatusId}`;
      }
    }
    const result = await sequelize.query(
      `SELECT i.investment_id "investmentId", i.investor_id "investorId",CONCAT(a.first_name,' ',a.last_name) as investorName,
        a.applicant_code "investorCode",a.contact_no "contactNo",i.refered_by "referedBy",i.application_no "applicantNo",
        i.category_id "categoryId", c.category_name "categoryName",i.sub_category_id "subCategoryId",
        sc.sub_category_name "subCategoryName",i.interest_rate "interestRate",
        i.investment_amount "investmentAmount", i.disbursed_date "disbursedDate", i.lock_period "lockPeriod",
        i.due_date "dueDate", i.due_amount "dueAmount",i.disbursed_method_id "disbursedMethodId",sl2.status_name "disbursedMethodName",
        i.created_by "createdById",CONCAT(e.first_name,'',e.last_name) as createdBy,
        i.approved_by "approvedById",CONCAT(e2.first_name,'',e2.last_name) as approvedBy,
        i.investment_status_id "investmentStatusId",sl.status_name "investmentStatusName",
        i.createdAt, i.updatedAt
        FROM investments i
        left join applicants a on a.applicant_id = i.investor_id 
        left join categories c on c.category_id = i.category_id 
        left join sub_categories sc on sc.sub_category_id = i.sub_category_id 
        left join employee e on e.employee_id = i.created_by 
        left join employee e2 on e2.employee_id = i.approved_by  
        left join status_lists sl on sl.status_list_id = i.investment_status_id 
        left join status_lists sl2 on sl2.status_list_id = i.disbursed_method_id ${iql} `,
      {
        type: QueryTypes.SELECT,
        raw: true,
        nest: false
      });
    return result;
  } catch (error) {
    throw new Error(error?.errors[0]?.message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function getInvestmentDetails(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE `;
      if (query.investmentId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` i.investment_id = ${query.investmentId}`;
      }
      if (query.investmentStatusId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` i.investment_status_id = ${query.investmentStatusId}`;
      }
    }
    const result = await sequelize.query(
      `SELECT i.investment_id "investmentId", i.investor_id "investorId",CONCAT(a.first_name,' ',a.last_name) as investorName,
        a.applicant_code "investorCode",a.contact_no "contactNo",i.refered_by "referedBy",i.application_no "applicantNo",
        i.category_id "categoryId", c.category_name "categoryName",i.sub_category_id "subCategoryId",
        sc.sub_category_name "subCategoryName",i.interest_rate "interestRate",i.disbursed_method_id "disbursedMethodId",
        i.investment_amount "investmentAmount", i.disbursed_date "disbursedDate", i.lock_period "lockPeriod",
        i.due_date "dueDate", i.due_amount "dueAmount",i.bank_account_id "bankAccountId", ba.account_holder_name "accountHolderName",
        ba.bank_name "bankName", ba.branch_name "branchName",ba.account_no "accountNo", ba.ifsc_code "ifscCode",
        i.created_by "createdById",CONCAT(e.first_name,'',e.last_name) as createdBy,i.transaction_id "transactionId",
        i.approved_by "approvedById",CONCAT(e2.first_name,'',e2.last_name) as approvedBy,
        i.investment_status_id "investmentStatusId",sl.status_name "investmentStatusName",
        i.createdAt, i.updatedAt
        FROM investments i
        left join applicants a on a.applicant_id = i.investor_id 
        left join categories c on c.category_id = i.category_id 
        left join sub_categories sc on sc.sub_category_id = i.sub_category_id 
        left join employee e on e.employee_id = i.created_by 
        left join employee e2 on e2.employee_id = i.approved_by  
        left join status_lists sl on sl.status_list_id = i.investment_status_id
        left join bank_accounts ba on ba.bank_account_id = i.bank_account_id  ${iql}`,
      {
        type: QueryTypes.SELECT,
        raw: true,
        nest: false
      });
      const loanChargesReq ={
        loanId : result[0].investmentId,
        isInvestment : 1
      }
      const loanChargeDetails =  await getLoanChargesDetails(loanChargesReq)
      result[0].investmentChargesInfo = loanChargeDetails
    return result;
  } catch (error) {
    console.log(error)
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createInvestment(postData) {
  try {
    const countResult = await sequelize.query(
      `SELECT application_no "applicantNo" FROM investments
      ORDER BY investment_id DESC LIMIT 1`,
      {
        type: QueryTypes.SELECT,
        raw: true,
        nest: false
      });
    const applicationCodeFormat = `HFC-INVEST-${moment().format('YY')}${moment().add(1, 'y').format('YY')}-FL-`
    const count = countResult.length > 0 ? parseInt(countResult[0].applicantNo.split("-").pop()) : `00000`
    postData.applicationNo = await generateSerialNumber(applicationCodeFormat, count)

    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const investmentResult = await sequelize.models.investments.create(excuteMethod);
    const investmentChargesData = postData.investmentChargesInfo.map(v => ({ ...v, loanId: investmentResult.investment_id, isInvestment: 1 }))
    const investmentCharges = await createLoanChargesDetails(investmentChargesData, true)
    const req = {
      investmentId: investmentResult.investment_id
    }
    return await getInvestment(req);
  } catch (error) {
    console.log(error);
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateInvestment(investmentId, putData) {
  try {
    if (putData.investmentStatusId === 4) {
      const duePaymentRes = await createDuePayment(putData.duePaymentInfo)
    }
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const investmentResult = await sequelize.models.investments.update(excuteMethod, { where: { investment_id: investmentId } });
    const investmentChargesInfo = putData?.investmentChargesInfo || []
    if(investmentChargesInfo.length > 0){
      const investmentChargesData = putData.investmentChargesInfo.map(v => ({ ...v, loanId: investmentId, isInvestment: 1 }))
      const investmentCharges = await updateLoanChargesDetails(null, investmentChargesData)
    }
    const req = {
      investmentId: investmentId
    }
    return await getInvestment(req);
  } catch (error) {
    console.log(error)
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

module.exports = {
  getInvestment,
  getInvestmentDetails,
  updateInvestment,
  createInvestment,
};