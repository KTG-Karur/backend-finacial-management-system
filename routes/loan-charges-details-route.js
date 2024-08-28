"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const loanChargesDetailsServices = require("../service/loan-charges-details-service");

const schema = {
    loanId: "number|required|integer|positive",
    loanChargeId: "number|required|integer|positive",
    chargeAmount: { type: "string", optional: false, min:1, max: 100 },
}

async function getLoanChargesDetails(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await loanChargesDetailsServices.getLoanChargesDetails(req.query);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = responseCode.BAD_REQUEST;
  } finally {
    res.send(responseEntries);
  }
}

async function createLoanChargesDetails(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = await v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
    responseEntries.data = await loanChargesDetailsServices.createLoanChargesDetails(req.body);
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

async function updateLoanChargesDetails(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
      responseEntries.data = await loanChargesDetailsServices.updateLoanChargesDetails(req.params.loanChargesDetailsId, req.body);
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

module.exports = async function (fastify) {
  fastify.route({
    method: 'GET',
    url: '/loan-charges-details',
    preHandler: verifyToken,
    handler: getLoanChargesDetails
  });

  fastify.route({
    method: 'POST',
    url: '/loan-charges-details',
    preHandler: verifyToken,
    handler: createLoanChargesDetails
  });

  fastify.route({
    method: 'PUT',
    url: '/loan-charges-details/:loanChargesDetailsId',
    preHandler: verifyToken,
    handler: updateLoanChargesDetails
  });

};