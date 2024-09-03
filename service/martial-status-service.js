"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');

async function getMartialStatus(query) {
  try {
    let iql = {};
    if (query && Object.keys(query).length) {
      if (query.martialStatusId) {
        iql.martial_status_id = query.martialStatusId;
      }
      if (query.isActive) {
        iql.is_active = query.isActive;
      }
    }
    const result = await sequelize.models.martial_status.findAll({
      attributes: [['martial_status_id', 'martialStatusId'], ['martial_status_name', 'martialStatusName'],
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

async function createMartialStatus(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const martialStatusResult = await sequelize.models.martial_status.create(excuteMethod);
    const req = {
      martialStatusId: martialStatusResult.martial_status_id
    }
    return await getMartialStatus(req);
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
}

async function updateMartialStatus(martialStatusId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const martialStatusResult = await sequelize.models.martial_status.update(excuteMethod, { where: { martial_status_id: martialStatusId } });
    const req = {
      martialStatusId: martialStatusId
    }
    return await getMartialStatus(req);
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

async function deleteMartialStatus(martialStatusId) {
  try {
    const martialStatusResult = await sequelize.models.martial_status.destroy({ where: { martial_status_id: martialStatusId } });
    if(martialStatusResult == 1){
      return "Deleted Successfully...!";
    }else{
      return "Data Not Founded...!";
    }
} catch (error) {
  throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
}
}

module.exports = {
  getMartialStatus,
  updateMartialStatus,
  createMartialStatus,
  deleteMartialStatus
};