"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');

async function getGender(query) {
  try {
    let iql = {};
    if (query && Object.keys(query).length) {
      if (query.genderId) {
        iql.gender_id = query.genderId;
      }
      if (query.isActive) {
        iql.is_active = query.isActive;
      }
    }
    const result = await sequelize.models.gender.findAll({
      attributes: [['gender_id', 'genderId'], ['gender_name', 'genderName'],
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

async function createGender(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const genderResult = await sequelize.models.gender.create(excuteMethod);
    const req = {
      genderId: genderResult.gender_id
    }
    return await getGender(req);
  } catch (error) {
    console.error(error);
    throw new Error(messages.OPERATION_ERROR);
  }
}

async function updateGender(genderId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const genderResult = await sequelize.models.gender.update(excuteMethod, { where: { gender_id: genderId } });
    const req = {
      genderId: genderId
    }
    return await getGender(req);
} catch (error) {
    throw error;
}
}

async function deleteGender(genderId) {
    try {
      const genderResult = await sequelize.models.gender.destroy({ where: { gender_id: genderId } });
      if(genderResult == 1){
        return "Deleted Successfully...!";
      }else{
        return "Data Not Founded...!";
      }
  } catch (error) {
      throw error;
  }
  }

module.exports = {
  getGender,
  updateGender,
  createGender,
  deleteGender
};