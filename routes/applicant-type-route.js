"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const applicantTypeServices = require("../service/applicant-type-service");

const schema = {
  applicantTypeName: { type: "string", optional: false, min:1, max: 100 }
}

async function getApplicantType(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await applicantTypeServices.getApplicantType(req.query);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = responseCode.BAD_REQUEST;
  } finally {
    res.send(responseEntries);
  }
}

async function createApplicantType(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = await v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
    responseEntries.data = await applicantTypeServices.createApplicantType(req.body);
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

async function updateApplicantType(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
      responseEntries.data = await applicantTypeServices.updateApplicantType(req.params.applicantTypeId, req.body);
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

async function deleteApplicantType(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await applicantTypeServices.deleteApplicantType(req.params.applicantTypeId);
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
    url: '/applicant-type',
    preHandler: verifyToken,
    handler: getApplicantType
  });

  fastify.route({
    method: 'POST',
    url: '/applicant-type',
    preHandler: verifyToken,
    handler: createApplicantType
  });

  fastify.route({
    method: 'PUT',
    url: '/applicant-type/:applicantTypeId',
    preHandler: verifyToken,
    handler: updateApplicantType
  });

  fastify.route({
    method: 'DELETE',
    url: '/applicant-type/:applicantTypeId',
    preHandler: verifyToken,
    handler: deleteApplicantType
  });
};