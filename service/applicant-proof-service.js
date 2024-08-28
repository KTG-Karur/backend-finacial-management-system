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
            if (query.isActive) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` is_active = ${query.isActive}`;
            }
        }
        const result = sequelize.query(`SELECT * FROM applicant_proof ${iql != "" ? iql : ""}`, {
            type: QueryTypes.SELECT,
            raw: true,
            nest: false
        });
        return result;
    } catch (error) {
        throw new Error(messages.OPERATION_ERROR);
    }
}

async function createApplicantProof(postData) {
    try {
        const excuteMethod = _.map(postData, (item) => _.mapKeys(item, (value, key) => _.snakeCase(key)));
        const applicantProofResult = await sequelize.models.applicant_proof.bulkCreate(excuteMethod);
        const req = {
            applicantProofId: applicantProofResult[applicantProofResult.length - 1].applicant_proof_id
        }
        return await getApplicantProof(req);
    } catch (error) {
        console.error(error);
        throw new Error(messages.OPERATION_ERROR);
    }
}

async function updateApplicantProof(applicantProofId, putData) {
    try {
        let applicantProofResult = "";
        _.forEach(putData, async function (item, index) {
            const excuteMethod = _.mapKeys(item, (value, key) => _.snakeCase(key))
            const updateId = item?.applicantProofId || null
            if (updateId != null) {
                delete item.applicant_address_info_id;
                applicantProofResult = await sequelize.models.applicant_proof.update(excuteMethod, { where: { applicant_proof_id: updateId } });
            } else {
                applicantProofResult = await sequelize.models.applicant_proof.create(excuteMethod);
            }
        })
        const req = {
            applicantProofId: applicantProofResult.applicant_proof_id
        }
        return await getApplicantProof(req);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getApplicantProof,
    updateApplicantProof,
    createApplicantProof
};