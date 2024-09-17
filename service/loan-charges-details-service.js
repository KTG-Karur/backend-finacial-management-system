"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');

async function getLoanChargesDetails(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.loanChargesDetailsId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` lcd.loan_charges_details_id = ${query.loanChargesDetailsId}`;
      }
      if (query.isInvestment) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` lcd.is_investment = ${query.isInvestment}`;
      }
      if (query.loanId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` lcd.loan_id = ${query.loanId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` lcd.is_active = ${query.isActive}`;
      }
    }
    const result = await sequelize.query(`SELECT lcd.loan_charges_details_id "loanChargesDetailsId", lcd.loan_id "investmentId",
      lcd.loan_charge_id "loanChargeId",lc.loan_charges_name "loanChargeTypeName",
      lcd.charge_amount "chargeAmount", lcd.is_active "isActive",lcd.createdAt, lcd.updatedAt,
      lcd.is_investment "isInvestment" FROM loan_charges_details lcd
      left join loan_charges lc on lc.loan_charges_id = lcd.loan_charge_id ${iql}`, {
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

async function createLoanChargesDetails(postData, externalCall=false) {
  try {
    const excuteMethod = _.map(postData, (item) => _.mapKeys(item, (value, key) => _.snakeCase(key)));
    const loanChargesDetailsResult = await sequelize.models.loan_charges_details.bulkCreate(excuteMethod);
    if(externalCall){
      return true
    }else{
      const req = {
        loanChargesDetailsId: loanChargesDetailsResult.loan_charges_details_id
      }
      return await getLoanChargesDetails(req);
    }
    
  } catch (error) {
    console.log(error)
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateLoanChargesDetails(loanChargesDetailsId, putData) {
  try {
    if(_.isArray(putData)){
      let loanChargesResult = "";
      _.forEach(putData, async function (item, index) {
          const excuteMethod = _.mapKeys(item, (value, key) => _.snakeCase(key))
          const updateId = item?.loanChargesDetailsId || null
          if (updateId != null) {
              delete item.loan_charges_details_id;
              loanChargesResult = await sequelize.models.loan_charges_details.update(excuteMethod, { where: { loan_charges_details_id: updateId } });
          } else {
            loanChargesResult = await sequelize.models.loan_charges_details.create(excuteMethod);
          }
      });
      return true;
    }else{
      const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
      const loanChargesDetailsResult = await sequelize.models.loan_charges_details.update(excuteMethod, { where: { loan_charges_details_id: loanChargesDetailsId } });
      const req = {
        loanChargesDetailsId: loanChargesDetailsId
      }
      return await getLoanChargesDetails(req);
    }
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

async function deleteLoanChargesDetails(loanChargesDetailsId) {
  try {
    const loanChargesDetailsResult = await sequelize.models.loan_charges_details.destroy({ where: { loan_charges_details_id: loanChargesDetailsId } });
    if(loanChargesDetailsResult == 1){
      return "Deleted Successfully...!";
    }else{
      return "Data Not Founded...!";
    }
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}


module.exports = {
  getLoanChargesDetails,
  updateLoanChargesDetails,
  createLoanChargesDetails,
  deleteLoanChargesDetails
};