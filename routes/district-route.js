"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const districtServices = require("../service/district-service");
const _ = require('lodash');

const schema = {
  districtName: { type: "string", optional: false, min:1, max: 100 },
  stateId : "number|required|integer|positive",
}

async function getDistrict(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await districtServices.getDistrict(req.query);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = responseCode.BAD_REQUEST;
  } finally {
    res.send(responseEntries);
  }
}

async function createDistrict(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = await v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
    responseEntries.data = await districtServices.createDistrict(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
    }
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = responseCode.BAD_REQUEST;
  } finally {
    res.send(responseEntries);
  }
}

async function updateDistrict(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const filteredSchema = _.pick(schema, Object.keys(req.body));
    const validationResponse = v.validate(req.body, filteredSchema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
      responseEntries.data = await districtServices.updateDistrict(req.params.districtId, req.body);
      if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
    }
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = error.code ? error.code : responseCode.BAD_REQUEST;
  } finally {
    res.send(responseEntries);
  }
}

async function deleteDistrict(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await districtServices.deleteDistrict(req.params.districtId);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = error.code ? error.code : responseCode.BAD_REQUEST;
  } finally {
    res.send(responseEntries);
  }
}

module.exports = async function (fastify) {
  fastify.route({
    method: 'GET',
    url: '/district',
    preHandler: verifyToken,
    handler: getDistrict
  });

  fastify.route({
    method: 'POST',
    url: '/district',
    preHandler: verifyToken,
    handler: createDistrict
  });

  fastify.route({
    method: 'PUT',
    url: '/district/:districtId',
    preHandler: verifyToken,
    handler: updateDistrict
  });

  fastify.route({
    method: 'DELETE',
    url: '/district/:districtId',
    preHandler: verifyToken,
    handler: deleteDistrict
  });
};