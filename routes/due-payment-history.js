"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const duePaymentHistoryServices = require("../service/due-payment-history-service");
const _ = require('lodash');

const schema = {
  duePaymentHistoryName: { type: "string", optional: false, min:1, max: 100 }
}

async function getDuePaymentHistory(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await duePaymentHistoryServices.getDuePaymentHistory(req.query);
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

async function createDuePaymentHistory(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = await v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
    responseEntries.data = await duePaymentHistoryServices.createDuePaymentHistory(req.body);
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

async function updateDuePaymentHistory(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const filteredSchema = _.pick(schema, Object.keys(req.body));
    const validationResponse = v.validate(req.body, filteredSchema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
      responseEntries.data = await duePaymentHistoryServices.updateDuePaymentHistory(req.params.duePaymentHistoryId, req.body);
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

module.exports = async function (fastify) {
  fastify.route({
    method: 'GET',
    url: '/due-payment-history',
    preHandler: verifyToken,
    handler: getDuePaymentHistory
  });

  fastify.route({
    method: 'POST',
    url: '/due-payment-history',
    preHandler: verifyToken,
    handler: createDuePaymentHistory
  });

  fastify.route({
    method: 'PUT',
    url: '/due-payment-history/:duePaymentHistoryId',
    preHandler: verifyToken,
    handler: updateDuePaymentHistory
  });
};