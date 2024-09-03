"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const loanServices = require("../service/loan-service");
const _ = require('lodash');

const schema = {
    applicantId: "number|required|integer|positive",
    coApplicantId: "number|required|integer|positive",
    guarantorId: "number|required|integer|positive",
    categoryId: "number|required|integer|positive",
    subCategoryId: "number|required|integer|positive",
    interestRate: { type: "string", optional: false, min:1, max: 100 },
    // dueTypeId: "number|required|integer|positive",
    loanAmount: { type: "string", optional: false, min:1, max: 100 },
    dueAmount: { type: "string", optional: false, min:1, max: 100 },
    dueDate: { type: "string", format: "date", optional: false, },
    disbursedDate: { type: "string", format: "date", optional: false, },
    disbursedAmount: { type: "string", optional: false, min:1, max: 100 },
    disbursedMethodId: "number|required|integer|positive",
    bankAccountId: "number|required|integer|positive",
    createdBy: "number|required|integer|positive",
}

async function getLoan(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await loanServices.getLoan(req.query);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = responseCode.BAD_REQUEST;
  } finally {
    res.send(responseEntries);
  }
}

async function createLoan(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = await v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
    responseEntries.data = await loanServices.createLoan(req.body);
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

async function updateLoan(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const filteredSchema = _.pick(schema, Object.keys(req.body));
    const validationResponse = v.validate(req.body, filteredSchema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
      responseEntries.data = await loanServices.updateLoan(req.params.loanId, req.body);
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
    url: '/loan',
    preHandler: verifyToken,
    handler: getLoan
  });

  fastify.route({
    method: 'POST',
    url: '/loan',
    preHandler: verifyToken,
    handler: createLoan
  });

  fastify.route({
    method: 'PUT',
    url: '/loan/:loanId',
    preHandler: verifyToken,
    handler: updateLoan
  });
};