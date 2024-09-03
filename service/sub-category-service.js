"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { Op } = require('sequelize');

async function getSubCategory(query) {
  try {
    let iql = {};
    if (query && Object.keys(query).length) {
      if (query.subCategoryId) {
        iql.sub_category_id = query.subCategoryId;
      }
      if (query.isActive) {
        iql.is_active = query.isActive;
      }
    }
    const result = await sequelize.models.sub_category.findAll({
      attributes: [['sub_category_id', 'subCategoryId'], 
      ['sub_category_name', 'subCategoryName'],
      ['interest_rate', 'interestRate'],
      ['category_id', 'categoryId'],[sequelize.col('category.category_name'), 'categoryName'],
      ['is_active', 'isActive'], ['createdAt', 'createdAt']],
      where: iql,
      include: [
        {
            model: sequelize.models.category,
            as: 'category',
            required: false,
            on: {
                category_id: {
                    [Op.eq]: sequelize.col('sub_category.category_id')
                }
            },
            attributes: []
        }],
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createSubCategory(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const subCategoryResult = await sequelize.models.sub_category.create(excuteMethod);
    const req = {
      subCategoryId: subCategoryResult.sub_category_id
    }
    return await getSubCategory(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateSubCategory(subCategoryId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const subCategoryResult = await sequelize.models.sub_category.update(excuteMethod, { where: { sub_category_id: subCategoryId } });
    const req = {
      subCategoryId: subCategoryId
    }
    return await getSubCategory(req);
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

async function deleteSubCategory(subCategoryId) {
  try {
    const subCategoryResult = await sequelize.models.sub_category.destroy({ where: { sub_category_id: subCategoryId } });
    if(subCategoryResult == 1){
      return "Deleted Successfully...!";
    }else{
      return "Data Not Founded...!";
    }
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

module.exports = {
  getSubCategory,
  updateSubCategory,
  createSubCategory,
  deleteSubCategory
};