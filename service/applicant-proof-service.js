"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');

async function getApplicantProof(query) {
    try {
        let iql = "";
        let count = 0;
        if (query && Object.keys(query).length) {
            iql += `WHERE`;
            if (query.applicantProofId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` applicant_proof_id = ${query.applicantProofId}`;
            }
            if (query.applicantId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` applicant_id = ${query.applicantId}`;
            }
            if (query.isActive) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` is_active = ${query.isActive}`;
            }
        }
        const result = sequelize.query(`SELECT ap.applicant_proof_id 'applicantProofId', ap.proof_type_id "proofTypeId", apt.proof_type_name "proofTypeName", 
            ap.proof_no "proofNo", ap.image_name "imageName", ap.is_active "isActive", ap.createdAt, ap.updatedAt
            FROM applicant_proof ap
            left join applicant_proof_type apt on apt.applicant_proof_type_id = ap.proof_type_id ${iql}`, {
            type: QueryTypes.SELECT,
            raw: true,
            nest: false
        });
        return result;
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function createApplicantProof(postData,  externalCall = false) {
    try {
        const excuteMethod = _.map(postData, (item) => _.mapKeys(item, (value, key) => _.snakeCase(key)));
        const applicantProofResult = await sequelize.models.applicant_proof.bulkCreate(excuteMethod);
        if(externalCall){
            return true;
          }
        const req = {
            applicantProofId: applicantProofResult[applicantProofResult.length - 1].applicant_proof_id
        }
        return await getApplicantProof(req);
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function updateApplicantProof(applicantId, putData, externalCall=false) {
    try {
        let applicantProofResult = "";
        _.forEach(putData, async function (item, index) {
            const excuteMethod = _.mapKeys(item, (value, key) => _.snakeCase(key))
            const updateId = item?.applicantProofId || null
            if (updateId != null) {
                delete item.applicant_address_info_id;
                applicantProofResult = await sequelize.models.applicant_proof.update(excuteMethod, { where: { applicant_proof_id: updateId } });
            } else {
                excuteMethod.applicant_id = applicantId
                applicantProofResult = await sequelize.models.applicant_proof.create(excuteMethod);
            }
        })
        if(externalCall){
            return true;
          }else{
        const req = {
            applicantProofId: applicantProofResult.applicant_proof_id
        }
        return await getApplicantProof(req);
    }
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function deleteApplicantProof(applicantProofId) {
    try {
      const applicantProofResult = await sequelize.models.applicant_proof.destroy({ where: { applicant_proof_id: applicantProofId } });
      if(applicantProofResult == 1){
        return "Deleted Successfully...!";
      }else{
        return "Data Not Founded...!";
      }
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
  }

module.exports = {
    getApplicantProof,
    updateApplicantProof,
    createApplicantProof,
    deleteApplicantProof
};