"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const expenseEntryServices = require("../service/expense-entry-service");
const _ = require('lodash');

const schema = {
    expenseTypeId: "number|required|integer|positive",
    description: { type: "string", optional: false, min:1},
    createdBy: "number|required|integer|positive",
    expenseDate: { type: "string", format: "date", },
    expenseAmount: { type: "string", optional: false, min:1, max: 100 },
}

async function getExpenseEntry(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await expenseEntryServices.getExpenseEntry(req.query);
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

async function createExpenseEntry(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = await v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
    responseEntries.data = await expenseEntryServices.createExpenseEntry(req.body);
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

async function updateExpenseEntry(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const filteredSchema = _.pick(schema, Object.keys(req.body));
    const validationResponse = v.validate(req.body, filteredSchema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
      responseEntries.data = await expenseEntryServices.updateExpenseEntry(req.params.expenseEntryId, req.body);
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

async function deleteExpenseEntry(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await expenseEntryServices.deleteExpenseEntry(req.params.expenseEntryId);
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
    url: '/expense-entry',
    preHandler: verifyToken,
    handler: getExpenseEntry
  });

  fastify.route({
    method: 'POST',
    url: '/expense-entry',
    preHandler: verifyToken,
    handler: createExpenseEntry
  });

  fastify.route({
    method: 'PUT',
    url: '/expense-entry/:expenseEntryId',
    preHandler: verifyToken,
    handler: updateExpenseEntry
  });

};