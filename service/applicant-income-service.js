"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');

async function getApplicantIncome(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.applicantIncomeId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` applicant_income_info_id = ${query.applicantIncomeId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` is_active = ${query.isActive}`;
      }
    }
    const result = sequelize.query(`SELECT * FROM applicant_income_info ${iql != "" ? iql : ""}`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createApplicantIncome(postData, externalCall = false) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const applicantIncomeResult = await sequelize.models.applicant_income_info.create(excuteMethod);
    if(externalCall){
      return true;
    }else{
      const req = {
        applicantIncomeId: applicantIncomeResult.applicant_income_info_id
      }
      return await getApplicantIncome(req);
    }
    
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateApplicantIncome(applicantIncomeId, putData, externalCall= false) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const applicantIncomeResult = await sequelize.models.applicant_income_info.update(excuteMethod, { where: { applicant_income_info_id: applicantIncomeId } });
    if(externalCall){
      return true;
    }else{
    const req = {
      applicantIncomeId: applicantIncomeId
    }
    return await getApplicantIncome(req);
  }
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

module.exports = {
  getApplicantIncome,
  updateApplicantIncome,
  createApplicantIncome
};