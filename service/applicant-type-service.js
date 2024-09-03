"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');

async function getApplicantType(query) {
  try {
    let iql = {};
    if (query && Object.keys(query).length) {
      if (query.applicantTypeId) {
        iql.applicant_type_id = query.applicantTypeId;
      }
      if (query.isActive) {
        iql.is_active = query.isActive;
      }
    }
    const result = await sequelize.models.applicant_type.findAll({
      attributes: [['applicant_type_id', 'applicantTypeId'], ['applicant_type_name', 'applicantTypeName'],
      ['is_active', 'isActive'], ['createdAt', 'createdAt']],
      where: iql,
      order: [['applicant_type_id', 'DESC']],
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createApplicantType(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const applicantTypeResult = await sequelize.models.applicant_type.create(excuteMethod);
    const req = {
      applicantTypeId: applicantTypeResult.applicant_type_id
    }
    return await getApplicantType(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateApplicantType(applicantTypeId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const applicantTypeResult = await sequelize.models.applicant_type.update(excuteMethod, { where: { applicant_type_id: applicantTypeId } });
    const req = {
      applicantTypeId: applicantTypeId
    }
    return await getApplicantType(req);
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

async function deleteApplicantType(applicantTypeId) {
  try {
    const applicantTypeResult = await sequelize.models.applicant_type.destroy({ where: { applicant_type_id: applicantTypeId } });
    if(applicantTypeResult == 1){
      return "Deleted Successfully...!";
    }else{
      return "Data Not Founded...!";
    }
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

module.exports = {
  getApplicantType,
  updateApplicantType,
  createApplicantType,
  deleteApplicantType
};