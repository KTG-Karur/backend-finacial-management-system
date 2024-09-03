"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');
const moment = require('moment');
const { generateSerialNumber } = require('../utils/utility');
const { createApplicantDetails } = require('./applicant-details-service');
const { createApplicantProof } = require('./applicant-proof-service');
const { createApplicantAddress } = require('./applicant-address-service');
const { createApplicantIncome } = require('./applicant-income-service');

async function getApplicant(query) {
    try {
        let iql = "";
        let count = 0;
        if (query && Object.keys(query).length) {
            iql += `WHERE`;
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
        const result = await sequelize.query(`SELECT a.applicant_id "applicantId", a.applicant_code "applicantCode", 
            CONCAT(a.first_name,' ' ,a.last_name) as applicantName,at2.applicant_type_name "applicantTypeName",
            a.contact_no "contactNo" , g.gender_name "genderName", a.createdAt, a.updatedAt
            FROM applicants a
            left join gender g on g.gender_id = a.gender_id 
            left join applicant_income_info aii on aii.applicant_id =a.applicant_id 
            left join applicant_types at2 on at2.applicant_type_id = aii.applicant_type_id ${iql}`, {
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

async function createApplicant(postData) {
    try {
        const countResult = await sequelize.query(
            `SELECT applicant_code "applicantCode" FROM applicants
            ORDER BY applicant_id DESC LIMIT 1`,
            {
                type: QueryTypes.SELECT,
                raw: true,
                nest: false
            });
        const applicantCodeFormat = `HFC-${moment().format('YY')}${moment().add(1, 'y').format('YY')}-FL-`
        const count = countResult.length > 0 ? parseInt(countResult[0].applicantCode.split("-").pop()) : `00000`
        postData.applicantCode = await generateSerialNumber(applicantCodeFormat, count)
        const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
        const applicantResult = await sequelize.models.applicant.create(excuteMethod);

        if (postData.additionalInfo.length > 0) {
            const additionalInfoData = postData.additionalInfo[0]
            additionalInfoData.applicantId = applicantResult.applicant_id
            const applicantDetailsRes = await createApplicantDetails(additionalInfoData, true)
        }
        if (postData.incomeInfo.length > 0) {
            const incomeInfoData = postData.incomeInfo[0]
            incomeInfoData.applicantId = applicantResult.applicant_id
            const incomeInfoRes = await createApplicantIncome(incomeInfoData, true)
        }
        if (postData.proofInfo.length > 0) {
            const proofInfoData = postData.proofInfo.map(v => ({ ...v, applicantId: applicantResult.applicant_id }))
            const proofInfoRes = await createApplicantProof(proofInfoData, true)
        }
        if (postData.addressInfo.length > 0) {
            const addressInfoData = postData.addressInfo.map(v => ({ ...v, applicantId: applicantResult.applicant_id }))
            const addressInfoRes = await createApplicantAddress(addressInfoData, true)
        }

        const req = {
            applicantId: applicantResult.applicant_id
        }
        return await getApplicant(req);
    } catch (error) {
        console.log(error)
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function updateApplicant(applicantId, putData) {
    try {
        const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
        const applicantResult = await sequelize.models.applicant.update(excuteMethod, { where: { applicant_id: applicantId } });
        const req = {
            applicantId: applicantId
        }
        return await getApplicant(req);
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

module.exports = {
    getApplicant,
    updateApplicant,
    createApplicant
};