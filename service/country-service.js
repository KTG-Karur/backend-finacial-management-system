"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');

async function getCountry(query) {
  try {
    let iql = {};
    if (query && Object.keys(query).length) {
      if (query.countryId) {
        iql.country_id = query.countryId;
      }
      if (query.isActive) {
        iql.is_active = query.isActive;
      }
    }
    const result = await sequelize.models.country.findAll({
      attributes: [['country_id', 'countryId'], ['country_name', 'countryName'],
      ['is_active', 'isActive'], ['createdAt', 'createdAt']],
      where: iql,
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function createCountry(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const countryResult = await sequelize.models.country.create(excuteMethod);
    const req = {
      countryId: countryResult.country_id
    }
    return await getCountry(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateCountry(countryId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const countryResult = await sequelize.models.country.update(excuteMethod, { where: { country_id: countryId } });
    const req = {
      countryId: countryId
    }
    return await getCountry(req);
} catch (error) {
    throw error;
}
}

async function deleteCountry(countryId) {
  try {
    const countryResult = await sequelize.models.country.destroy({ where: { country_id: countryId } });
    if(countryResult == 1){
      return "Deleted Successfully...!";
    }else{
      return "Data Not Founded...!";
    }
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

module.exports = {
  getCountry,
  updateCountry,
  createCountry,
  deleteCountry
};