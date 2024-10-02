"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');

async function getContra(query) {
    try {
        let iql = "";
        let count = 0;
        if (query && Object.keys(query).length) {
            iql += `WHERE`;
            if (query.contraId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` c.contra_id = ${query.contraId}`;
            }
            if (query.isActive) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` c.is_active = ${query.isActive}`;
            }
        }
        const result = await sequelize.query(`SELECT c.contra_id "contraId", c.disbursed_method_id "disbursedMethodId", 
            sl.status_name "statusName", c.bank_id "bankId",ba.bank_name "bankName",
            c.total_amount "totalAmount", c.createdAt, CASE WHEN c.disbursed_method_id = 5 THEN sl.status_name   
            ELSE ba.bank_name END AS contraName
            FROM contras c
            left join status_lists sl on sl.status_list_id = c.disbursed_method_id 
            left join bank_accounts ba on ba.bank_account_id = c.bank_id ${iql}`, {
            type: QueryTypes.SELECT,
            raw: true,
            nest: false
        });
        return result;
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function createContra(postData) {
    try {
        const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
        const contraResult = await sequelize.models.contra.create(excuteMethod);
        const req = {
            contraId: contraResult.contra_id
        }
        return await getContra(req);
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function updateContra(contraId, putData) {
    try {
        const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
        const contraResult = await sequelize.models.contra.update(excuteMethod, { where: { contra_id: contraId } });
        const req = {
            contraId: contraId
        }
        return await getContra(req);
    } catch (error) {
        console.log(error)
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}


module.exports = {
    getContra,
    updateContra,
    createContra,
};