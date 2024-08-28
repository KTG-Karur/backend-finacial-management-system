"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');

async function getAddressType(query) {
  try {
    let iql = {};
    if (query && Object.keys(query).length) {
      if (query.addressTypeId) {
        iql.address_type_id = query.addressTypeId;
      }
      if (query.isActive) {
        iql.is_active = query.isActive;
      }
    }
    const result = await sequelize.models.address_type.findAll({
      attributes: [['address_type_id', 'addressTypeId'], ['address_type_name', 'addressTypeName'],
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

async function createAddressType(postData) {
  try {
    const excuteMethod = _.mapKeys(postData, (value, key) => _.snakeCase(key))
    const addressTypeResult = await sequelize.models.address_type.create(excuteMethod);
    const req = {
      addressTypeId: addressTypeResult.address_type_id
    }
    return await getAddressType(req);
  } catch (error) {
    console.error(error);
    throw new Error(messages.OPERATION_ERROR);
  }
}

async function updateAddressType(addressTypeId, putData) {
  try {
    const excuteMethod = _.mapKeys(putData, (value, key) => _.snakeCase(key))
    const addressTypeResult = await sequelize.models.address_type.update(excuteMethod, { where: { address_type_id: addressTypeId } });
    const req = {
      addressTypeId: addressTypeId
    }
    return await getAddressType(req);
} catch (error) {
    throw error;
}
}

async function deleteAddressType(addressTypeId) {
  try {
    const addressTypeResult = await sequelize.models.address_type.destroy({ where: { address_type_id: addressTypeId } });
    if(addressTypeResult == 1){
      return "Deleted Successfully...!";
    }else{
      return "Data Not Founded...!";
    }
} catch (error) {
    throw error;
}
}

module.exports = {
  getAddressType,
  updateAddressType,
  createAddressType,
  deleteAddressType
};