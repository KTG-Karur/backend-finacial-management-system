"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');

async function getDayBook(query) {
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
                iql += ` db.category_id = ${query.categoryId}`;
            }
            if (query.closingDate) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` DATE(db.closing_date) = '${query.closingDate}'`;
            }
        }
        const result = await sequelize.query(`SELECT db.day_book_id "dayBookId", db.opening_amount "openingAmount",
            db.closing_amount "closingAmount", db.created_by "createdBy",CONCAT(e.first_name,' ',e.last_name) as employeeName,
            db.closing_date "closingDate",db.createdAt, db.updatedAt, db.shortage, db.reason
            FROM day_books db
            left join employee e on e.employee_id = db.created_by ${iql}`, {
            type: QueryTypes.SELECT,
            raw: true,
            nest: false
        });
        if(result.length > 0){
            return result;
        }else{
            const alternativeResult = await sequelize.query(`SELECT db.day_book_id "dayBookId", db.opening_amount "openingAmount",
                db.closing_amount "closingAmount", db.created_by "createdBy",CONCAT(e.first_name,' ',e.last_name) as employeeName,
                db.closing_date "closingDate",db.createdAt, db.updatedAt, db.shortage, db.reason
                FROM day_books db
                left join employee e on e.employee_id = db.created_by ORDER BY db.day_book_id DESC LIMIT 1`, {
                type: QueryTypes.SELECT,
                raw: true,
                nest: false
            });
            return alternativeResult;
        }
        
    } catch (error) {
        console.log(error)
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function createDayBook(postData) {
    try {
        console.log(postData)
        const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
        const dayBookResult = await sequelize.models.day_book.create(excuteMethod);
        const req = {
            dayBookId: dayBookResult.day_book_id
        }
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
    updateDayBook,
    createDayBook,
    deleteDayBook
};