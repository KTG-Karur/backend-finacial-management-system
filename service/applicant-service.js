"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');
const moment = require('moment');
const { generateSerialNumber } = require('../utils/utility');
const { createApplicantDetails, updateApplicantDetails } = require('./applicant-details-service');
const { createApplicantProof, getApplicantProof, updateApplicantProof } = require('./applicant-proof-service');
const { createApplicantAddress, getApplicantAddress, updateApplicantAddress } = require('./applicant-address-service');
const { createApplicantIncome, updateApplicantIncome } = require('./applicant-income-service');
const { createUser } = require('./user-service');

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
            if (query.isBorrower) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` a.is_borrower = ${query.isBorrower}`;
            }
            if (query.isActive) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` a.is_active = ${query.isActive}`;
            }
        }
        const result = await sequelize.query(`SELECT a.applicant_id "applicantId", a.applicant_code "applicantCode", 
            CONCAT(a.first_name,' ' ,a.last_name) as applicantName,CONCAT(a.first_name,' ',a.last_name,'-',a.applicant_code) as applicantNameCode,at2.applicant_type_name "applicantTypeName",
            a.contact_no "contactNo" , g.gender_name "genderName", a.createdAt, a.updatedAt, a.is_active "isActive"
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
            JSON_OBJECT(
                'applicantCode', a.applicant_code, 
                'firstName', a.first_name,
                'lastName', a.last_name, 
                'dob', IFNULL(a.dob, ''), 
                'contactNo', a.contact_no, 
                'alternativeContactNo', IFNULL(a.alternative_contact_no, ''),
                'email', IFNULL(a.email, ''),
                'genderId', a.gender_id, 
                'qualification', IFNULL(a.qualification, ''),
                'martialStatusId', IFNULL(a.martial_status_id, '')
            ) AS personalInfo,
            
            JSON_OBJECT(
                'applicantIncomeInfoId', aii.applicant_income_info_id, 
                'applicantTypeId', aii.applicant_type_id,
                'companyName', aii.company_name,
                'address', aii.address,
                'officeContactNo', aii.office_contact_no,
                'monthlyIncome', aii.monthly_income,
                'startDate', aii.start_date
            ) AS incomeInfo,
            
            JSON_OBJECT(
                'applicantDetailsId', ad.applicant_details_id, 
                'fatherName', IFNULL(ad.father_name, ''),
                'motherName', IFNULL(ad.mother_name, ''),
                'fatherOccupation', IFNULL(ad.father_occupation, ''),
                'fatherIncome', IFNULL(ad.father_income, ''),
                'motherOccupation', IFNULL(ad.mother_occupation, ''),
                'motherIncome', IFNULL(ad.mother_income, ''),
                'fatherContactNo', IFNULL(ad.father_contact_no, ''),
                'motherContactNo', IFNULL(ad.mother_contact_no, '')
            ) AS additionalInfo
        FROM 
            applicants a
        LEFT JOIN 
            applicant_income_info aii ON aii.applicant_id = a.applicant_id
        LEFT JOIN 
            applicant_details ad ON ad.applicant_id = a.applicant_id ${iql}
        GROUP BY 
            a.applicant_id, 
            a.applicant_code;
        ;`, {
            type: QueryTypes.SELECT,
            raw: true,
            nest: false,
        });
        const req = {
            applicantId: query.applicantId
        }
        const idProof = await getApplicantProof(req)
        const addressInfo = await getApplicantAddress(req)
        result[0].idProof = idProof;
        result[0].addressInfo = addressInfo;
        return result;
    } catch (error) {
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

        const applicantCodeFormat = `HFC-${moment().format('YY')}-${postData.personalInfo[0].isBorrower === 1 ? 'INV' : 'CUS'}-`
        const personalInfoData = postData.personalInfo[0]
        const count = countResult.length > 0 ? parseInt(countResult[0].applicantCode.split("-").pop()) : `00000`
        personalInfoData.applicantCode = await generateSerialNumber(applicantCodeFormat, count)

        const userInfo = {
            userName: personalInfoData.applicantCode,
            password: personalInfoData.contactNo
        }
        const userDetails = await createUser(userInfo)
        personalInfoData.userId = userDetails[0].userId || ""
        const excuteMethod = _.mapKeys(personalInfoData, (value, key) => _.snakeCase(key))
        const applicantResult = await sequelize.models.applicant.create(excuteMethod);
        const additionalInfoArr = postData?.additionalInfo || []
        if (additionalInfoArr.length > 0) {
            const additionalInfoData = postData.additionalInfo[0]
            additionalInfoData.applicantId = applicantResult.applicant_id
            const applicantDetailsRes = await createApplicantDetails(additionalInfoData, true)
        }
        const incomeInfoArr = postData?.incomeInfo || []
        if (incomeInfoArr.length > 0) {
            const incomeInfoData = postData.incomeInfo[0]
            incomeInfoData.applicantId = applicantResult.applicant_id
            const incomeInfoRes = await createApplicantIncome(incomeInfoData, true)
        }
        const proofInfoArr = postData?.proofInfo || []
        if (proofInfoArr.length > 0) {
            const proofInfoData = postData.proofInfo.map(v => ({ ...v, applicantId: applicantResult.applicant_id, imageName: `${applicantResult.applicant_code}-${v.imageName}` }))
            const proofInfoRes = await createApplicantProof(proofInfoData, true)
        }
        const addressInfoArr = postData?.addressInfo || []
        if (addressInfoArr.length > 0) {
            const addressInfoData = postData.addressInfo.map(v => ({ ...v, applicantId: applicantResult.applicant_id }))
            const addressInfoRes = await createApplicantAddress(addressInfoData, true)
        }


        const req = {
            applicantId: applicantResult.applicant_id
        }
        return await getApplicant(req);
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function updateApplicant(applicantId, putData) {
    try {
        const excuteMethod = _.mapKeys(putData.personalInfo[0], (value, key) => _.snakeCase(key))
        const applicantResult = await sequelize.models.applicant.update(excuteMethod, { where: { applicant_id: applicantId } });
        const additionalInfoArr = putData.additionalInfo || []
        if (additionalInfoArr.length > 0) {
            const additionalInfoData = additionalInfoArr[0]
            const updateId = additionalInfoData.applicantDetailsId
            delete additionalInfoData.applicantDetailsId
            const applicantDetailsRes = await updateApplicantDetails(updateId, additionalInfoData, true)
        }

        const incomeInfoArr = putData.incomeInfo || []
        if (incomeInfoArr.length > 0) {
            const incomeInfoData = incomeInfoArr[0]
            const updateId = incomeInfoData.applicantIncomeInfoId
            delete incomeInfoData.applicantIncomeId
            const applicanIncomeRes = await updateApplicantIncome(updateId, incomeInfoData, true)
        }
        const proofInfoArr = putData.proofInfo || []
        if (proofInfoArr.length > 0) {
            const proofInfoRes = await updateApplicantProof(applicantId, proofInfoArr, true)
        }
        const addressInfoArr = putData.addressInfo || []
        if (addressInfoArr.length > 0) {
            const addressInfoRes = await updateApplicantAddress(applicantId, addressInfoArr, true)
        }
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