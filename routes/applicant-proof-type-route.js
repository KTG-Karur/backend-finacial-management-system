"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const applicantProofTypeServices = require("../service/applicant-proof-type-service");

const schema = {
  proofTypeName: { type: "string", optional: false, min:1, max: 100 }
}

async function getApplicantProofType(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await applicantProofTypeServices.getApplicantProofType(req.query);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = responseCode.BAD_REQUEST;
  } finally {
    res.send(responseEntries);
  }
}

async function createApplicantProofType(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = await v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
    responseEntries.data = await applicantProofTypeServices.createApplicantProofType(req.body);
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

async function updateApplicantProofType(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
      responseEntries.data = await applicantProofTypeServices.updateApplicantProofType(req.params.applicantProofTypeId, req.body);
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

async function deleteApplicantProofType(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await applicantProofTypeServices.deleteApplicantProofType(req.params.applicantProofTypeId);
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
    url: '/applicant-proof-type',
    preHandler: verifyToken,
    handler: getApplicantProofType
  });

  fastify.route({
    method: 'POST',
    url: '/applicant-proof-type',
    preHandler: verifyToken,
    handler: createApplicantProofType
  });

  fastify.route({
    method: 'PUT',
    url: '/applicant-proof-type/:applicantProofTypeId',
    preHandler: verifyToken,
    handler: updateApplicantProofType
  });

  fastify.route({
    method: 'DELETE',
    url: '/applicant-proof-type/:applicantProofTypeId',
    preHandler: verifyToken,
    handler: deleteApplicantProofType
  });
};