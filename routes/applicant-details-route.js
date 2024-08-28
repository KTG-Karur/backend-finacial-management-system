"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const applicantDetailsServices = require("../service/applicant-details-service");

const schema = {
    fatherName: { type: "string", optional: false, min:1, max: 100 },
    motherName: { type: "string", optional: false, min:1, max: 100 },
    fatherOccupation: { type: "string", optional: false, min:1, max: 100 },
    fatherIncome: { type: "string", optional: false, min:1, max: 100 },
    motherOccupation: { type: "string", optional: false, min:1, max: 100 },
    motherIncome: { type: "string", optional: false, min:1, max: 100 },
    fatherContactNo: { type: "string", optional: false, min:10, max: 10 },
}

async function getApplicantDetails(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await applicantDetailsServices.getApplicantDetails(req.query);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = responseCode.BAD_REQUEST;
  } finally {
    res.send(responseEntries);
  }
}

async function createApplicantDetails(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = await v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
    responseEntries.data = await applicantDetailsServices.createApplicantDetails(req.body);
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

async function updateApplicantDetails(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
      responseEntries.data = await applicantDetailsServices.updateApplicantDetails(req.params.applicantDetailsId, req.body);
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
    url: '/applicant-details',
    preHandler: verifyToken,
    handler: getApplicantDetails
  });

  fastify.route({
    method: 'POST',
    url: '/applicant-details',
    preHandler: verifyToken,
    handler: createApplicantDetails
  });

  fastify.route({
    method: 'PUT',
    url: '/applicant-details/:applicantDetailsId',
    preHandler: verifyToken,
    handler: updateApplicantDetails
  });
};