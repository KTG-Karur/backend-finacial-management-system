"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');

async function getFaq(query) {
    try {
        let iql = "";
        let count = 0;
        if (query && Object.keys(query).length) {
            iql += `WHERE `;
            if (query.faqId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` faq_id = ${query.faqId}`;
            }
        }
        const result = await sequelize.query(`SELECT faq_id "faqId", question, answer, createdAt
            FROM faq_tbls ${iql} ORDER BY faq_id DESC LIMIT 5`, {
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

async function createFaq(postData) {
    try {
        const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
        const faqResult = await sequelize.models.faq_tbl.create(excuteMethod);
        const req = {
            faqId: faqResult.faq_id
        }
        return await getFaq(req);
    } catch (error) {
        console.log(error)
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function updateFaq(faqId, putData) {
    try {
        const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
        const faqResult = await sequelize.models.faq_tbl.update(excuteMethod, { where: { faq_id: faqId } });
        const req = {
            faqId: faqId
        }
        return await getFaq(req);
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function deleteFaq(faqId) {
    try {
        const faqResult = await sequelize.models.faq_tbl.destroy({ where: { faq_id: faqId } });
        if (faqResult == 1) {
            return "Deleted Successfully...!";
        } else {
            return "Data Not Founded...!";
        }
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

module.exports = {
    getFaq,
    updateFaq,
    createFaq,
    deleteFaq
};