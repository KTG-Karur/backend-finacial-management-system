"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');

async function getDayBookHistory(query) {
    try {
        let iql = "";
        let count = 0;
        if (query && Object.keys(query).length) {
            iql += `WHERE`;
            if (query.dayBookHistoryId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` dbh.day_book_history_id = ${query.dayBookHistoryId}`;
            }
            if (query.createdAt) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` DATE(dbh.createdAt) = '${query.createdAt}'`;
            }
        }
        console.log(iql)
        const result = await sequelize.query(`SELECT dbh.day_book_history_id "dayBookHistoryId", dbh.db_category_id "dbCategoryId", sl.status_name "subCategoryName",
            dbh.db_sub_category_id "dbSubCategoryId", dbh.amount, dbh.day_book_id "dayBookId", dbh.createdAt, dbh.updatedAt,
            dbh.created_by "createdById", CONCAT(e.first_name,' ',e.last_name) as createdBy, dbh.is_closed "isClosed"
            FROM day_book_histories dbh
            left join status_lists sl on sl.status_list_id = dbh.db_sub_category_id 
            left join employee e on e.employee_id = dbh.created_by  ${iql}`, {
            type: QueryTypes.SELECT,
            raw: true,
            nest: false
        });
        return result;
    } catch (error) {
        console.log("error---->")
        console.log(error)
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function createDayBookHistory(postData) {
    try {
        const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
        console.log(excuteMethod)
        const dayBookHistoryResult = await sequelize.models.day_book_history.create(excuteMethod);
        const req = {
            dayBookHistoryId: dayBookHistoryResult.day_book_history_id
        }
        return await getDayBookHistory(req);
    } catch (error) {
        console.log(error)
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function updateDayBookHistory(dayBookHistoryId, putData, condition = false) {
    try {
        if(condition){
            console.log("true-------->")
            const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
            // const iqlCondition = `DATE(createdAt) : ${dayBookHistoryId}`
            const dayBookHistoryResult = await sequelize.models.day_book_history.update(excuteMethod, { where: sequelize.where(sequelize.fn('DATE', sequelize.col('createdAt')), dayBookHistoryId) });
            const req = {
                dayBookHistoryId: dayBookHistoryId
            }
            return await getDayBookHistory(req);
        }else{
            const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
            const dayBookHistoryResult = await sequelize.models.day_book_history.update(excuteMethod, { where: { dayBookHistory_id: dayBookHistoryId } });
            const req = {
                dayBookHistoryId: dayBookHistoryId
            }
            return await getDayBookHistory(req);
        }
    } catch (error) {
        console.log(error)
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