"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');
const moment = require('moment');
const { generateSerialNumber } = require('../utils/utility');

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
        const result = await sequelize.query(`SELECT * FROM applicants ${iql != "" && iql}`, {
            type: QueryTypes.SELECT,
            raw: true,
            nest: false
        });
        return result;
    } catch (error) {
        throw new Error(messages.OPERATION_ERROR);
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
        console.log(postData)
        const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
        const applicantResult = await sequelize.models.applicant.create(excuteMethod);
        const req = {
            applicantId: applicantResult.applicant_id
        }
        console.log(req)
        return await getApplicant(req);
    } catch (error) {
        console.error(error);
        throw new Error(messages.OPERATION_ERROR);
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
        throw error;
    }
}

module.exports = {
    getApplicant,
    updateApplicant,
    createApplicant
};