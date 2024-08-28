"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');

async function getApplicantProofType(query) {
  try {
    let iql = {};
    if (query && Object.keys(query).length) {
      if (query.applicantProofTypeId) {
        iql.applicant_proof_type_id = query.applicantProofTypeId;
      }
      if (query.isActive) {
        iql.is_active = query.isActive;
      }
    }
    const result = await sequelize.models.applicant_proof_type.findAll({
      attributes: [['applicant_proof_type_id', 'applicantProofTypeId'], ['proof_type_name', 'proofTypeName'],
      ['is_active', 'isActive'], ['createdAt', 'createdAt']],
      where: iql,
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    console.log(error)
    throw new Error(messages.OPERATION_ERROR);
  }
}

async function createApplicantProofType(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const applicantProofTypeResult = await sequelize.models.applicant_proof_type.create(excuteMethod);
    const req = {
      applicantProofTypeId: applicantProofTypeResult.applicant_proof_type_id
    }
    return await getApplicantProofType(req);
  } catch (error) {
    console.error(error);
    throw new Error(messages.OPERATION_ERROR);
  }
}

async function updateApplicantProofType(applicantProofTypeId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const applicantProofTypeResult = await sequelize.models.applicant_proof_type.update(excuteMethod, { where: { applicant_proof_type_id: applicantProofTypeId } });
    const req = {
      applicantProofTypeId: applicantProofTypeId
    }
    return await getApplicantProofType(req);
} catch (error) {
    throw error;
}
}

async function deleteApplicantProofType(applicantProofTypeId) {
  try {
    const applicantProofTypeResult = await sequelize.models.applicant_proof_type.destroy({ where: { applicant_proof_type_id: applicantProofTypeId } });
    if(applicantProofTypeResult == 1){
      return "Deleted Successfully...!";
    }else{
      return "Data Not Founded...!";
    }
} catch (error) {
    throw error;
}
}

module.exports = {
  getApplicantProofType,
  updateApplicantProofType,
  createApplicantProofType,
  deleteApplicantProofType
};