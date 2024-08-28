"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { Op } = require('sequelize');

async function getState(query) {
  try {
    let iql = {};
    if (query && Object.keys(query).length) {
      if (query.stateId) {
        iql.state_id = query.stateId;
      }
      if (query.isActive) {
        iql.is_active = query.isActive;
      }
    }
    const result = await sequelize.models.state.findAll({
      attributes: [['state_id', 'stateId'], ['state_name', 'stateName'],[sequelize.col('country.country_name'), 'countryName'],
      ['is_active', 'isActive'], ['createdAt', 'createdAt']],
      where: iql,
      include: [
        {
            model: sequelize.models.country,
            as: 'country',
            required: false,
            on: {
              country_id: {
                    [Op.eq]: sequelize.col('state.country_id')
                }
            },
            attributes: []
        }],
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    console.log(error)
    throw new Error(messages.OPERATION_ERROR);
  }
}

async function createState(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const stateResult = await sequelize.models.state.create(excuteMethod);
    const req = {
      stateId: stateResult.state_id
    }
    return await getState(req);
  } catch (error) {
    throw new Error(error?.errors[0]?.type ? (error.errors[0].type).toUpperCase() : messages.OPERATION_ERROR);
  }
}

async function updateState(stateId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const stateResult = await sequelize.models.state.update(excuteMethod, { where: { state_id: stateId } });
    const req = {
      stateId: stateId
    }
    return await getState(req);
} catch (error) {
    throw error;
}
}

async function deleteState(stateId) {
  try {
    const stateResult = await sequelize.models.state.destroy({ where: { state_id: stateId } });
    if(stateResult == 1){
      return "Deleted Successfully...!";
    }else{
      return "Data Not Founded...!";
    }
} catch (error) {
    throw error;
}
}

module.exports = {
  getState,
  updateState,
  createState,
  deleteState
};