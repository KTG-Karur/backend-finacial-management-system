"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');

async function getEnquiry(query) {
    try {
        let iql = "";
        let count = 0;
        if (query && Object.keys(query).length) {
            iql += `WHERE `;
            if (query.enquiryId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` enquiry_id = ${query.enquiryId}`;
            }
        }
        const result = await sequelize.query(`SELECT enquiry_id "enquiryId", name, contact_no "contactNo", message, createdAt, updatedAt
            FROM enquiry_tbls ${iql}`, {
            type: QueryTypes.SELECT,
            raw: true,
            nest: false
        });
        return result;
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function createEnquiry(postData) {
    try {
        const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
        const enquiryResult = await sequelize.models.enquiry_tbl.create(excuteMethod);
        const req = {
            enquiryId: enquiryResult.enquiry_id
        }
        return await getEnquiry(req);
    } catch (error) {
        console.log(error)
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function updateEnquiry(enquiryId, putData) {
    try {
        const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
        const enquiryResult = await sequelize.models.enquiry_tbl.update(excuteMethod, { where: { enquiry_id: enquiryId } });
        const req = {
            enquiryId: enquiryId
        }
        return await getEnquiry(req);
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function deleteEnquiry(enquiryId) {
    try {
        const enquiryResult = await sequelize.models.enquiry_tbl.destroy({ where: { enquiry_id: enquiryId } });
        if (enquiryResult == 1) {
            return "Deleted Successfully...!";
        } else {
            return "Data Not Founded...!";
        }
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

module.exports = {
    getEnquiry,
    updateEnquiry,
    createEnquiry,
    deleteEnquiry
};