"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const applicantServices = require("../service/applicant-service");
const _ = require('lodash');

const schema = {
  firstName: { type: "string", optional: false, min:1, max: 100 },
  lastName: { type: "string", optional: false, min:1, max: 100 },
  // qualification: { type: "string", optional: false, min:1, max: 100 },
  // dob: { type: "string", optional: false, format: "date", },
  contactNo: { type: "string", optional: false, min:10, max: 10 },
  // alternativeContactNo: { type: "string", optional: false, min:10, max: 10 },
  // email: { type: "email", optional: true, min:1, max: 100 },
  genderId : "number|required|integer|positive",
  // martialStatusId : "number|required|integer|positive",
}

async function getApplicant(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await applicantServices.getApplicant(req.query);
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

async function createApplicant(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = await v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
    responseEntries.data = await applicantServices.createApplicant(req.body);
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

async function updateApplicant(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const filteredSchema = _.pick(schema, Object.keys(req.body));
    const validationResponse = v.validate(req.body, filteredSchema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
      responseEntries.data = await applicantServices.updateApplicant(req.params.applicantId, req.body);
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
    url: '/applicant',
    preHandler: verifyToken,
    handler: getApplicant
  });

  fastify.route({
    method: 'POST',
    url: '/applicant',
    preHandler: verifyToken,
    handler: createApplicant
  });

  fastify.route({
    method: 'PUT',
    url: '/applicant/:applicantId',
    preHandler: verifyToken,
    handler: updateApplicant
  });
};