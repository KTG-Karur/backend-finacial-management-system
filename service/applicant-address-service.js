"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');

async function getApplicantAddress(query) {
    try {
        let iql = "";
        let count = 0;
        if (query && Object.keys(query).length) {
            iql += `WHERE`;
            if (query.applicantAddressInfoId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` applicant_address_info_id = ${query.applicantAddressInfoId}`;
            }
            if (query.isActive) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` is_active = ${query.isActive}`;
            }
        }
        const result = await sequelize.query(`SELECT * FROM applicant_address_infos ${iql != "" ? iql : ""}`, {
            type: QueryTypes.SELECT,
            raw: true,
            nest: false
        });
        return result;
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function createApplicantAddress(postData, externalCall = false) {
    try {
        const excuteMethod = _.map(postData, (item) => _.mapKeys(item, (value, key) => _.snakeCase(key)));
        const applicantAddressResult = await sequelize.models.applicant_address_info.bulkCreate(excuteMethod);
        if(externalCall){
            return true;
          }
        const req = {
            applicantAddressInfoId: applicantAddressResult[applicantAddressResult.length - 1].applicant_address_info_id
        }

        return await getApplicantAddress(req);
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function updateApplicantAddress(applicantAddressInfoId, putData) {
    try {
        let applicantAddressResult = "";
        _.forEach(putData, async function (item, index) {
            const excuteMethod = _.mapKeys(item, (value, key) => _.snakeCase(key))
            const updateId = item?.applicantAddressInfoId || null
            if (updateId != null) {
                delete item.applicant_address_info_id;
                applicantAddressResult = await sequelize.models.applicant_address_info.update(excuteMethod, { where: { applicant_address_info_id: updateId } });
            } else {
                applicantAddressResult = await sequelize.models.applicant_address_info.create(excuteMethod);
            }
        });
        const req = {
            applicantAddressInfoId: applicantAddressResult.applicant_id
        }
        return await getApplicantAddress(req);
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

module.exports = {
    getApplicantAddress,
    updateApplicantAddress,
    createApplicantAddress
};