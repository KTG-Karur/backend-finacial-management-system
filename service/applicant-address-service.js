"use strict";

const sequelize = require('../models/index').sequelize;
const messages = require("../helpers/message");
const _ = require('lodash');
const { QueryTypes } = require('sequelize');

async function getApplicantAddress(query) {
    try {
        let iql = "";
        let count = 0;
        if (query && Object.keys(query).length) {
            iql += `WHERE`;
            if (query.applicantAddressInfoId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` applicant_address_info_id = ${query.applicantAddressInfoId}`;
            }
            if (query.applicantId) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` applicant_id = ${query.applicantId}`;
            }
            if (query.isActive) {
                iql += count >= 1 ? ` AND` : ``;
                count++;
                iql += ` is_active = ${query.isActive}`;
            }
        }
        const result = await sequelize.query(`SELECT aa.applicant_address_info_id "applicantAddressInfoId",
            aa.address_type_id "addressTypeId",at2.address_type_name "addressTypeName",
            aa.address, aa.landmark, aa.district_id "districtId",d.district_name "districtName",
            aa.state_id "stateId",s.state_name "stateName",
            aa.pincode,
            aa.is_active, aa.createdAt, aa.updatedAt
            FROM applicant_address_infos aa
            left join address_types at2 on at2.address_type_id = aa.address_type_id
            left join district d on d.district_id = aa.district_id 
            left join states s on s.state_id = aa.state_id  ${iql}`, {
            type: QueryTypes.SELECT,
            raw: true,
            nest: false
        });
        return result;
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function createApplicantAddress(postData, externalCall = false) {
    try {
        const excuteMethod = _.map(postData, (item) => _.mapKeys(item, (value, key) => _.snakeCase(key)));
        const applicantAddressResult = await sequelize.models.applicant_address_info.bulkCreate(excuteMethod);
        if(externalCall){
            return true;
          }
        const req = {
            applicantAddressInfoId: applicantAddressResult[applicantAddressResult.length - 1].applicant_address_info_id
        }

        return await getApplicantAddress(req);
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function updateApplicantAddress(applicantId, putData, externalCall=false) {
    try {
        let applicantAddressResult = "";
        _.forEach(putData, async function (item, index) {
            const excuteMethod = _.mapKeys(item, (value, key) => _.snakeCase(key))
            const updateId = item?.applicantAddressInfoId || null
            if (updateId != null) {
                delete item.applicantAddressInfoId;
                applicantAddressResult = await sequelize.models.applicant_address_info.update(excuteMethod, { where: { applicant_address_info_id: updateId } });
            } else {
                excuteMethod.applicant_id = applicantId
                applicantAddressResult = await sequelize.models.applicant_address_info.create(excuteMethod);
            }
        });
        if(externalCall){
            return true;
          }else{
        const req = {
            applicantAddressInfoId: applicantAddressResult.applicant_id
        }
        return await getApplicantAddress(req);
    }
    } catch (error) {
        throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
    }
}

async function deleteApplicantAddress(applicantAddressInfoId) {
    try {
      const applicantAddressResult = await sequelize.models.applicant_address_info.destroy({ where: { applicant_address_info_id: applicantAddressInfoId } });
      if(applicantAddressResult == 1){
        return "Deleted Successfully...!";
      }else{
        return "Data Not Founded...!";
      }
  } catch (error) {
    throw new Error(error.errors[0].message ? error.errors[0].message : messages.OPERATION_ERROR);
  }
  }

module.exports = {
    getApplicantAddress,
    updateApplicantAddress,
    createApplicantAddress,
    deleteApplicantAddress
};