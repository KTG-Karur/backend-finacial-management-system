"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const incomeEntryServices = require("../service/income-entry-service");
const _ = require('lodash');

const schema = {
    incomeTypeId: "number|required|integer|positive",
    description: { type: "string", optional: false, min:1},
    createdBy: "number|required|integer|positive",
    incomeDate: { type: "string", format: "date", },
    incomeAmount: { type: "string", optional: false, min:1, max: 100 },
}

async function getIncomeEntry(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await incomeEntryServices.getIncomeEntry(req.query);
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

async function createIncomeEntry(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = await v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
    responseEntries.data = await incomeEntryServices.createIncomeEntry(req.body);
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

async function updateIncomeEntry(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const filteredSchema = _.pick(schema, Object.keys(req.body));
    const validationResponse = v.validate(req.body, filteredSchema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
      responseEntries.data = await incomeEntryServices.updateIncomeEntry(req.params.incomeEntryId, req.body);
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

async function deleteIncomeEntry(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await incomeEntryServices.deleteIncomeEntry(req.params.incomeEntryId);
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
    url: '/income-entry',
    preHandler: verifyToken,
    handler: getIncomeEntry
  });

  fastify.route({
    method: 'POST',
    url: '/income-entry',
    preHandler: verifyToken,
    handler: createIncomeEntry
  });

  fastify.route({
    method: 'PUT',
    url: '/income-entry/:incomeEntryId',
    preHandler: verifyToken,
    handler: updateIncomeEntry
  });

};