"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const applicantIncomeServices = require("../service/applicant-income-service");

const schema = {
    applicantTypeId: "number|required|integer|positive",
    companyName: { type: "string", optional: false, min:1, max: 100 },
    address: { type: "string", optional: false, min:1, max: 100 },
    officeContactNo: { type: "string", optional: false, min:10, max: 10 },
    monthlyIncome: { type: "string", optional: false, min:1, max: 100 },
}

async function getApplicantIncome(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await applicantIncomeServices.getApplicantIncome(req.query);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = responseCode.BAD_REQUEST;
  } finally {
    res.send(responseEntries);
  }
}

async function createApplicantIncome(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = await v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
    responseEntries.data = await applicantIncomeServices.createApplicantIncome(req.body);
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

async function updateApplicantIncome(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
      responseEntries.data = await applicantIncomeServices.updateApplicantIncome(req.params.applicantIncomeId, req.body);
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
    url: '/applicant-income',
    preHandler: verifyToken,
    handler: getApplicantIncome
  });

  fastify.route({
    method: 'POST',
    url: '/applicant-income',
    preHandler: verifyToken,
    handler: createApplicantIncome
  });

  fastify.route({
    method: 'PUT',
    url: '/applicant-income/:applicantIncomeId',
    preHandler: verifyToken,
    handler: updateApplicantIncome
  });
};