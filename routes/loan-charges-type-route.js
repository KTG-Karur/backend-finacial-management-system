"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const loanChargesTypeServices = require("../service/loan-charges-type-service");
const _ = require('lodash');

const schema = {
  loanChargesName: { type: "string", optional: false, min:1, max: 100 },
  chargesAmount: { type: "string", optional: false, min:1, max: 100 },
  isPercentage: "number|required|integer",
}

async function getLoanChargesType(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await loanChargesTypeServices.getLoanChargesType(req.query);
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

async function createLoanChargesType(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = await v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
    responseEntries.data = await loanChargesTypeServices.createLoanChargesType(req.body);
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

async function updateLoanChargesType(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const filteredSchema = _.pick(schema, Object.keys(req.body));
    const validationResponse = v.validate(req.body, filteredSchema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
      responseEntries.data = await loanChargesTypeServices.updateLoanChargesType(req.params.loanChargesTypeId, req.body);
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

async function deleteLoanChargesType(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await loanChargesTypeServices.deleteLoanChargesType(req.params.loanChargesTypeId);
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
    url: '/loan-charges-type',
    preHandler: verifyToken,
    handler: getLoanChargesType
  });

  fastify.route({
    method: 'POST',
    url: '/loan-charges-type',
    preHandler: verifyToken,
    handler: createLoanChargesType
  });

  fastify.route({
    method: 'PUT',
    url: '/loan-charges-type/:loanChargesTypeId',
    preHandler: verifyToken,
    handler: updateLoanChargesType
  });

  fastify.route({
    method: 'DELETE',
    url: '/loan-charges-type/:loanChargesTypeId',
    preHandler: verifyToken,
    handler: deleteLoanChargesType
  });
};