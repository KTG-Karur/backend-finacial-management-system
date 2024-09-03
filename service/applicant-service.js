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
                iql += ` a.applicant_id = ${query.applicantId}`;
            }
            if (query.isActive) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` a.is_active = ${query.isActive}`;
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
            nest: false,
        });
        return result;
    } catch (error) {
        console.log(error)
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function getApplicantInfoDetails(query) {
    try {
        let iql = "";
        let count = 0;
        if (query && Object.keys(query).length) {
            iql += `WHERE`;
            if (query.applicantId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` a.applicant_id = ${query.applicantId}`;
            }
            if (query.isActive) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` a.is_active = ${query.isActive}`;
            }
        }
        const result = await sequelize.query(`SELECT 
        a.applicant_id AS "applicantId",
        JSON_OBJECT('applicantCode', a.applicant_code, 'firstName', a.first_name,
        'lastName', a.last_name, 'dob' , a.dob, 'contactNo', a.contact_no, 'alternativeContactNo',
        a.alternative_contact_no, 'email', a.email,'genderId', a.gender_id, 'qualification', a.qualification,
        'martialStatusId', a.martial_status_id) as personalInfo,
        JSON_OBJECT('applicantIncomeInfoId', aii.applicant_income_info_id, 'applicantTypeId', aii.applicant_type_id,
        'companyName', aii.company_name,'address', aii.address,
        'officeContactNo', aii.office_contact_no,'monthlyIncome', aii.monthly_income) as incomeInfo,
        JSON_OBJECT('applicantDetailsId', ad.applicant_details_id, 'fatherName', ad.father_name,
        'motherName', ad.mother_name,'fatherOccupation', ad.father_occupation,
        'fatherIncome', ad.father_income,'motherOccupation', ad.mother_occupation, 'motherIncome', ad.mother_income,
        'fatherContactNo', ad.father_contact_no, 'motherContactNo', ad.mother_contact_no
        ) as additionalInfo,
        CONCAT('[', GROUP_CONCAT(JSON_OBJECT('applicantProofId',ap.applicant_proof_id, 'proofNo', ap.proof_no,'proofTypeId', ap.proof_type_id,'imageName', ap.image_name ) SEPARATOR ','), ']') AS "idProof",
        CONCAT('[', GROUP_CONCAT(JSON_OBJECT('applicantAddressInfoId',aai.applicant_address_info_id, 'addressTypeId', aai.address_type_id,
        'address', aai.address,'landmark',aai.landmark, 'districtId', aai.district_id, 'stateId', aai.state_id,
        'pincode', pincode) SEPARATOR ','), ']') AS "addressInfo"
        FROM 
            applicants a
        LEFT JOIN 
            applicant_proof ap ON ap.applicant_id = a.applicant_id
        LEFT JOIN 
            applicant_address_infos aai ON aai.applicant_id = a.applicant_id
        LEFT JOIN 
            applicant_income_info aii ON aii.applicant_id = a.applicant_id
        LEFT JOIN 
            applicant_details ad ON ad.applicant_id = a.applicant_id
        GROUP BY 
            a.applicant_id, 
            a.applicant_code; ${iql}`, {
            type: QueryTypes.SELECT,
            raw: true,
            nest: false,
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
        const personalInfoData = postData.personalInfo[0]
        const count = countResult.length > 0 ? parseInt(countResult[0].applicantCode.split("-").pop()) : `00000`
        personalInfoData.applicantCode = await generateSerialNumber(applicantCodeFormat, count)
        const excuteMethod = _.mapKeys(personalInfoData, (value, key) => _.snakeCase(key))
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
    createApplicant,
    getApplicantInfoDetails
};