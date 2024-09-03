"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const loanStatusServices = require("../service/loan-status-service");
const _ = require('lodash');

const schema = {
  loanStatusName: { type: "string", optional: false, min:1, max: 100 }
}

async function getLoanStatus(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await loanStatusServices.getLoanStatus(req.query);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = responseCode.BAD_REQUEST;
  } finally {
    res.send(responseEntries);
  }
}

async function createLoanStatus(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = await v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
    responseEntries.data = await loanStatusServices.createLoanStatus(req.body);
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

async function updateLoanStatus(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const filteredSchema = _.pick(schema, Object.keys(req.body));
    const validationResponse = v.validate(req.body, filteredSchema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
      responseEntries.data = await loanStatusServices.updateLoanStatus(req.params.loanStatusId, req.body);
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

async function deleteLoanStatus(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await loanStatusServices.deleteLoanStatus(req.params.loanStatusId);
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
    url: '/loan-status',
    preHandler: verifyToken,
    handler: getLoanStatus
  });

  fastify.route({
    method: 'POST',
    url: '/loan-status',
    preHandler: verifyToken,
    handler: createLoanStatus
  });

  fastify.route({
    method: 'PUT',
    url: '/loan-status/:loanStatusId',
    preHandler: verifyToken,
    handler: updateLoanStatus
  });

  fastify.route({
    method: 'DELETE',
    url: '/loan-status/:loanStatusId',
    preHandler: verifyToken,
    handler: deleteLoanStatus
  });
};