"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const duePaymentServices = require("../service/due-payment-service");
const _ = require('lodash');

const schema = {
  loanId: { type: "string", optional: false, min:1, max: 100 }
}

async function getDuePayment(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await duePaymentServices.getDuePayment(req.query);
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

async function getDuePaymentDetails(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await duePaymentServices.getDuePaymentDetails(req.query);
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

async function createDuePayment(req, res) {
  const responseEntries = new ResponseEntry();
  // const v = new Validator()
  try {
    responseEntries.data = await duePaymentServices.createDuePayment(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
    // const validationResponse = await v.validate(req.body, schema)
    // if (validationResponse != true) {
    //   throw new Error(messages.VALIDATION_FAILED);
    // }else{
    // responseEntries.data = await duePaymentServices.createDuePayment(req.body);
    // if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
    // }
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = responseCode.BAD_REQUEST;
    res.status(responseCode.BAD_REQUEST);
  } finally {
    res.send(responseEntries);
  }
}

async function updateDuePayment(req, res) {
  const responseEntries = new ResponseEntry();
  // const v = new Validator()
  try {
    responseEntries.data = await duePaymentServices.updateDuePayment(req.params.duePaymentId, req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
    // const filteredSchema = _.pick(schema, Object.keys(req.body));
    // const validationResponse = v.validate(req.body, filteredSchema)
    // if (validationResponse != true) {
    //   throw new Error(messages.VALIDATION_FAILED);
    // }else{
    //   responseEntries.data = await duePaymentServices.updateDuePayment(req.params.duePaymentId, req.body);
    //   if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
    // }
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
    url: '/due-payment',
    preHandler: verifyToken,
    handler: getDuePayment
  });

  fastify.route({
    method: 'GET',
    url: '/due-payment-details',
    preHandler: verifyToken,
    handler: getDuePaymentDetails
  });

  fastify.route({
    method: 'POST',
    url: '/due-payment',
    preHandler: verifyToken,
    handler: createDuePayment
  });

  fastify.route({
    method: 'PUT',
    url: '/due-payment/:duePaymentId',
    preHandler: verifyToken,
    handler: updateDuePayment
  });

};