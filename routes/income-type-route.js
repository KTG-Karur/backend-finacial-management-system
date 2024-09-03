"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const incomeTypeServices = require("../service/income-type-service");
const _ = require('lodash');

const schema = {
  incomeTypeName: { type: "string", optional: false, min:1, max: 100 },
}

async function getIncomeType(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await incomeTypeServices.getIncomeType(req.query);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = responseCode.BAD_REQUEST;
    res.status(responseCode.BAD_REQUEST);
  } finally {
    res.send(responseEntries);
  }
}

async function createIncomeType(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = await v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
    responseEntries.data = await incomeTypeServices.createIncomeType(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
    }
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = responseCode.BAD_REQUEST;
    res.status(responseCode.BAD_REQUEST);
  } finally {
    res.send(responseEntries);
  }
}

async function updateIncomeType(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const filteredSchema = _.pick(schema, Object.keys(req.body));
    const validationResponse = v.validate(req.body, filteredSchema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
      responseEntries.data = await incomeTypeServices.updateIncomeType(req.params.incomeTypeId, req.body);
      if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
    }
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = error.code ? error.code : responseCode.BAD_REQUEST;
    res.status(responseCode.BAD_REQUEST);
  } finally {
    res.send(responseEntries);
  }
}

async function deleteIncomeType(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await incomeTypeServices.deleteIncomeType(req.params.incomeTypeId);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = error.code ? error.code : responseCode.BAD_REQUEST;
    res.status(responseCode.BAD_REQUEST);
  } finally {
    res.send(responseEntries);
  }
}

module.exports = async function (fastify) {
  fastify.route({
    method: 'GET',
    url: '/income-type',
    preHandler: verifyToken,
    handler: getIncomeType
  });

  fastify.route({
    method: 'POST',
    url: '/income-type',
    preHandler: verifyToken,
    handler: createIncomeType
  });

  fastify.route({
    method: 'PUT',
    url: '/income-type/:incomeTypeId',
    preHandler: verifyToken,
    handler: updateIncomeType
  });

  fastify.route({
    method: 'DELETE',
    url: '/income-type/:incomeTypeId',
    preHandler: verifyToken,
    handler: deleteIncomeType
  });
};