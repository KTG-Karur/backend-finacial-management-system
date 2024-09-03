"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');

async function getApplicantDetails(query) {
  try {
    let iql = "";
    let count = 0;
    if (query && Object.keys(query).length) {
      iql += `WHERE`;
      if (query.applicantDetailsId) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` applicant_details_id = ${query.applicantDetailsId}`;
      }
      if (query.isActive) {
        iql += count >= 1 ? ` AND` : ``;
        count++;
        iql += ` is_active = ${query.isActive}`;
      }
    }
    const result = sequelize.query(`SELECT * FROM applicant_details ${iql != "" ? iql : ""}`, {
      type: QueryTypes.SELECT,
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createApplicantDetails(postData, externalCall = false) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const applicantDetailsResult = await sequelize.models.applicant_details.create(excuteMethod);
    if(externalCall){
      return true;
    }else{
      const req = {
        applicantDetailsId: applicantDetailsResult.applicant_details_id
      }
      return await getApplicantDetails(req);
    }
    
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateApplicantDetails(applicantDetailsId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const applicantDetailsResult = await sequelize.models.applicant_details.update(excuteMethod, { where: { applicant_details_id: applicantDetailsId } });
    const req = {
      applicantDetailsId: applicantDetailsId
    }
    return await getApplicantDetails(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}


module.exports = {
  getApplicantDetails,
  updateApplicantDetails,
  createApplicantDetails
};