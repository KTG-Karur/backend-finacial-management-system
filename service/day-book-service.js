"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');
const { updateDayBookHistory } = require('./day-book-history-service');

async function getDayBook(query) {
    try {
        let iql = "";
        let count = 0;
        if (query && Object.keys(query).length) {
            iql += `WHERE`;
            if (query.dayBookId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` day_book_id = ${query.dayBookId}`;
            }
            if (query.closingDate) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` DATE(closing_date) = '${query.closingDate}'`;
            }
        }
        const result = await sequelize.query(`SELECT day_book_id "dayBookId", opening_amount "openingAmount", closing_amount "closingAmount",
            created_by "createdBy", closing_date "closingDate", createdAt, updatedAt, shortage, reason,
            income_amount "incomeAmount", expense_amount "expenseAmount"
            FROM day_books ${iql}`, {
            type: QueryTypes.SELECT,
            raw: true,
            nest: false
        });
        if (result.length > 0) {
            result[0].isCreated = true
            return result;
        } else {
            const alterRes = await getDayBookHistoryDetails(query)
            const result2 = await sequelize.query(`SELECT closing_amount "closingAmount"
                FROM day_books ORDER BY day_book_id DESC LIMIT 1`, {
                type: QueryTypes.SELECT,
                raw: true,
                nest: false
            });
            const openingAmount = result2[0]?.closingAmount || 0
            const filterRes = alterRes.map(v => ({ ...v, openingAmount: openingAmount }))
            return filterRes;
        }
    } catch (error) {
        console.log(error)
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function getDayBookHistoryDetails(query) {
    try {
        let iql = "";
        let count = 0;
        if (query && Object.keys(query).length) {
            iql += `WHERE`;
            if (query.dayBookId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` db.day_book_id = ${query.dayBookId}`;
            }
            if (query.categoryId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` dbh.db_category_id = ${query.categoryId}`;
            }
            if (query.closingDate) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` DATE(dbh.createdAt) = '${query.closingDate}'`;
            }
            if (query.isClosed) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` dbh.is_closed = '${query.isClosed}'`;
            }
        }
        const result = await sequelize.query(`SELECT dbh.day_book_history_id "dayBookHistoryId",
             dbh.db_category_id "dbCategoryId",sl.status_name "statusName",sl2.status_name "subCategoryName",
            dbh.db_sub_category_id "dbSubCategoryId",db.opening_amount "openingAmount",db.closing_amount "closingAmount",
            case when dbh.db_category_id = '11' THEN dbh.amount ELSE NULL End as creditAmount ,
            case when dbh.db_category_id = '12' THEN dbh.amount ELSE NULL End as debitAmount ,
            dbh.day_book_id "dayBookId",dbh.createdAt, dbh.respective_id "respectiveId", dbh.created_by "createdById",
            CONCAT(e.first_name,' ',e.last_name) as createdBy, dbh.is_closed "isClosed"
            FROM day_book_histories dbh
            left join day_books db on db.day_book_id = dbh.day_book_id 
            left join status_lists sl on sl.status_list_id = dbh.db_category_id
            left join status_lists sl2 on sl2.status_list_id = dbh.db_sub_category_id
            left join employee e on e.employee_id = dbh.created_by ${iql}`, {
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

async function createDayBook(postData) {
    try {
        const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
        const dayBookResult = await sequelize.models.day_book.create(excuteMethod);
        const req = {
            dayBookId: dayBookResult.day_book_id
        }
        const dayBookHistory = await updateDayBookHistory(postData.closingDate, req, true )
        return await getDayBook(req);
    } catch (error) {
        console.log(error)
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function updateDayBook(dayBookId, putData) {
    try {
        const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
        const dayBookResult = await sequelize.models.day_book.update(excuteMethod, { where: { day_book_id: dayBookId } });
        const req = {
            dayBookId: dayBookId
        }
        return await getDayBook(req);
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function deleteDayBook(dayBookId) {
    try {
        const dayBookResult = await sequelize.models.day_book.destroy({ where: { day_book_id: dayBookId } });
        if (dayBookResult == 1) {
            return "Deleted Successfully...!";
        } else {
            return "Data Not Founded...!";
        }
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

module.exports = {
    getDayBook,
    getDayBookHistoryDetails,
    updateDayBook,
    createDayBook,
    deleteDayBook
};