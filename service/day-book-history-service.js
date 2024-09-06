"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');

async function getDayBookHistory(query) {
    try {
        let iql = "";
        let count = 0;
        if (query && Object.keys(query).length) {
            iql += `WHERE`;
            if (query.dayBookHistoryId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` day_book_history_id = ${query.dayBookHistoryId}`;
            }
        }
        const result = await sequelize.query(`SELECT day_book_history_id "dayBookHistoryId", db_category_id "dbCategoryId",
            db_sub_category_id "dbSubCategoryId", amount, day_book_id "dayBookId", createdAt, updatedAt
            FROM day_book_histories; ${iql}`, {
            type: QueryTypes.SELECT,
            raw: true,
            nest: false
        });
        return result;
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function createDayBookHistory(postData) {
    try {
        const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
        const dayBookHistoryResult = await sequelize.models.dayBookHistory.create(excuteMethod);
        const req = {
            dayBookHistoryId: dayBookHistoryResult.dayBookHistory_id
        }
        return await getDayBookHistory(req);
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function updateDayBookHistory(dayBookHistoryId, putData) {
    try {
        const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
        const dayBookHistoryResult = await sequelize.models.dayBookHistory.update(excuteMethod, { where: { dayBookHistory_id: dayBookHistoryId } });
        const req = {
            dayBookHistoryId: dayBookHistoryId
        }
        return await getDayBookHistory(req);
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function deleteDayBookHistory(dayBookHistoryId) {
    try {
        const dayBookHistoryResult = await sequelize.models.dayBookHistory.destroy({ where: { dayBookHistory_id: dayBookHistoryId } });
        if (dayBookHistoryResult == 1) {
            return "Deleted Successfully...!";
        } else {
            return "Data Not Founded...!";
        }
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

module.exports = {
    getDayBookHistory,
    updateDayBookHistory,
    createDayBookHistory,
    deleteDayBookHistory
};