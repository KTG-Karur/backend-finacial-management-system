"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');

async function getCategory(query) {
  try {
    let iql = {};
    if (query && Object.keys(query).length) {
      if (query.categoryId) {
        iql.category_id = query.categoryId;
      }
      if (query.isActive) {
        iql.is_active = query.isActive;
      }
    }
    const result = await sequelize.models.category.findAll({
      attributes: [['category_id', 'categoryId'], ['category_name', 'categoryName'],
      ['is_active', 'isActive'], ['createdAt', 'createdAt']],
      where: iql,
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    throw new Error(messages.OPERATION_ERROR);
  }
}

async function createCategory(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const categoryResult = await sequelize.models.category.create(excuteMethod);
    const req = {
      categoryId: categoryResult.category_id
    }
    return await getCategory(req);
  } catch (error) {
    console.error(error);
    throw new Error(messages.OPERATION_ERROR);
  }
}

async function updateCategory(categoryId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const categoryResult = await sequelize.models.category.update(excuteMethod, { where: { category_id: categoryId } });
    const req = {
      categoryId: categoryId
    }
    return await getCategory(req);
} catch (error) {
    throw error;
}}

module.exports = {
  getCategory,
  updateCategory,
  createCategory
};