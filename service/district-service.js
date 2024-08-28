"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { Op } = require('sequelize');

async function getDistrict(query) {
  try {
    let iql = {};
    if (query && Object.keys(query).length) {
      if (query.districtId) {
        iql.district_id = query.districtId;
      }
      if (query.isActive) {
        iql.is_active = query.isActive;
      }
    }
    const result = await sequelize.models.district.findAll({
      attributes: [['district_id', 'districtId'], 
      ['district_name', 'districtName'],
      ['state_id', 'stateId'],
      [sequelize.col('state.state_name'), 'stateName'],
      [sequelize.col('state.country_id'), 'countryId'],
      [sequelize.col('state->country.country_name'), 'countryName'],
      ['is_active', 'isActive'], ['createdAt', 'createdAt']],
      where: iql,
      include: [
        {
            model: sequelize.models.state,
            as: 'state',
            required: false,
            on: {
                state_id: {
                    [Op.eq]: sequelize.col('district.state_id')
                }
            },
            attributes: [],
            include:[
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
            }
            ]
        },
      
    ],
      raw: true,
      nest: false
    });
    return result;
  } catch (error) {
    console.log(error)
    throw new Error(messages.OPERATION_ERROR);
  }
}

async function createDistrict(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const districtResult = await sequelize.models.district.create(excuteMethod);
    const req = {
      districtId: districtResult.district_id
    }
    return await getDistrict(req);
  } catch (error) {
    console.error(error);
    throw new Error(messages.OPERATION_ERROR);
  }
}

async function updateDistrict(districtId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const districtResult = await sequelize.models.district.update(excuteMethod, { where: { district_id: districtId } });
    const req = {
      districtId: districtId
    }
    return await getDistrict(req);
} catch (error) {
    throw error;
}
}

async function deleteDistrict(districtId) {
  try {
    const districtResult = await sequelize.models.district.destroy({ where: { district_id: districtId } });
    if(districtResult == 1){
      return "Deleted Successfully...!";
    }else{
      return "Data Not Founded...!";
    }
} catch (error) {
    throw error;
}
}

module.exports = {
  getDistrict,
  updateDistrict,
  createDistrict,
  deleteDistrict
};