"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const moment = require('moment');
const { QueryTypes } = require('sequelize');
const { createDuePayment } = require('./due-payment-service');
const { createLoanChargesDetails, updateLoanChargesDetails, getLoanChargesDetails } = require('./loan-charges-details-service');
const { generateSerialNumber } = require('../utils/utility');
const { createContra, updateContra } = require('./contra-service');
const { createContraHistory } = require('./contra-history-service');
const { createCashHistory } = require('./cash-history-service');

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
        i.category_id "categoryId", c.category_name "categoryName",i.sub_category_id "subCategoryId",i.loan_date "loanDate",
        sc.sub_category_name "subCategoryName",i.interest_rate "interestRate",
        i.investment_amount "investmentAmount", i.disbursed_date "disbursedDate", i.lock_period "lockPeriod",
        i.due_date "dueDate", i.due_amount "dueAmount",i.disbursed_method_id "disbursedMethodId",sl2.status_name "disbursedMethodName",
        i.created_by "createdById",CONCAT(e.first_name,'',e.last_name) as createdBy,i.reason,
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
        i.category_id "categoryId", c.category_name "categoryName",i.sub_category_id "subCategoryId",i.lock_period "lockPeriod",
        sc.sub_category_name "subCategoryName",i.interest_rate "interestRate",i.disbursed_method_id "disbursedMethodId",
        i.investment_amount "investmentAmount", i.disbursed_date "disbursedDate",i.reason, i.lock_period "lockPeriod",i.loan_date "loanDate",
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
      const contraId = putData.contraId
      if(contraId === 1){
        const perviousCashCount = await sequelize.query(
          `SELECT two_thous_count "twoThousCount", five_hund_count "fiveHundCount", hund_count "hundCount",
          five_coin_count "fiveCoinCount", two_coin_count "twoCoinCount", one_coin_count "oneCoinCount", 
          fivty_count "fivtyCount", twenty_count "twentyCount", ten_count "tenCount", total_amount "totalAmount" FROM contras
          WHERE contra_id='${contraId}'`,
          {
            type: QueryTypes.SELECT,
            raw: true,
            nest: false
          });
          const resData = perviousCashCount[0]
          const cashHistoryData = putData.cashHistory
          const tenCount = parseInt(resData?.tenCount || 0) + parseInt(cashHistoryData.tenCount)
          const twentyCount = parseInt(resData?.twentyCount || 0) + parseInt(cashHistoryData.twentyCount)
          const fivtyCount = parseInt(resData?.fivtyCount || 0) + parseInt(cashHistoryData.fivtyCount)
          const oneCoinCount = parseInt(resData?.oneCoinCount || 0) + parseInt(cashHistoryData.oneCoinCount)
          const twoCoinCount = parseInt(resData?.twoCoinCount || 0) + parseInt(cashHistoryData.twoCoinCount)
          const twoThousCount = parseInt(resData?.twoThousCount || 0) + parseInt(cashHistoryData.twoThousCount)
          const fiveHundCount = parseInt(resData?.fiveHundCount || 0) + parseInt(cashHistoryData.fiveHundCount)
          const hundCount = parseInt(resData?.hundCount || 0) + parseInt(cashHistoryData.hundCount)
          const fiveCoinCount = parseInt(resData?.fiveCoinCount || 0) + parseInt(cashHistoryData.fiveCoinCount)
          const totalAmount = parseInt(resData?.totalAmount || 0) + parseInt(putData.contraTotalAmount)
        const contraReq={
          totalAmount : totalAmount,
          tenCount : tenCount,
          twentyCount : twentyCount,
          fivtyCount : fivtyCount,
          oneCoinCount : oneCoinCount,
          twoCoinCount : twoCoinCount,
          twoThousCount : twoThousCount,
          fiveHundCount : fiveHundCount,
          hundCount : hundCount,
          fiveCoinCount : fiveCoinCount,
        }
        const contraRes = await updateContra(contraId, contraReq)

        const cashHistory = await createCashHistory(cashHistoryData)

        const contraHistoryReq = {
          contraId : contraId,
          cashHistoryId : cashHistory[0].cashHistoryId,
          amount : cashHistoryData.amount
        }
        const contraHistoryRes = await createContraHistory(contraHistoryReq)
      }else{
        console.log("enter--->Bank Accounts")
        const perviousCashAmount = await sequelize.query(
          `SELECT total_amount "totalAmount" FROM contras
          WHERE contra_id=${contraId}`,
          {
            type: QueryTypes.SELECT,
            raw: true,
            nest: false
          });
          console.log("perviousCashAmount----->")
          console.log(perviousCashAmount)
          const totalAmount = parseInt(perviousCashAmount[0]?.totalAmount || 0) + parseInt(putData.contraTotalAmount)
          const contraReq={
            totalAmount : totalAmount,
          }
          console.log(contraReq)
          const contraRes = await updateContra(contraId, contraReq)

          const contraHistoryReq = {
            contraId : contraId,
            transactionId : putData.transactionId,
            amount : putData.contraTotalAmount
          }
          const contraHistoryRes = await createContraHistory(contraHistoryReq)
      }
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
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

module.exports = {
  getInvestment,
  getInvestmentDetails,
  updateInvestment,
  createInvestment,
};