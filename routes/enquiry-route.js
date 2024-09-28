"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const enquiryServices = require("../service/enquiry-service");
const _ = require('lodash');

const schema = {
  name: { type: "string", optional: false, min:1, max: 100 },
  message: { type: "string", optional: false, min:1, max: 1000 },
  contactNo: { type: "string", optional: false, min:10, max: 10 },
}

async function getEnquiry(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await enquiryServices.getEnquiry(req.query);
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

async function createEnquiry(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = await v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
    responseEntries.data = await enquiryServices.createEnquiry(req.body);
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

async function updateEnquiry(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const filteredSchema = _.pick(schema, Object.keys(req.body));
    const validationResponse = v.validate(req.body, filteredSchema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
      responseEntries.data = await enquiryServices.updateEnquiry(req.params.enquiryId, req.body);
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

async function deleteEnquiry(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await enquiryServices.deleteEnquiry(req.params.enquiryId);
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
    url: '/enquiry',
    // preHandler: verifyToken,
    handler: getEnquiry
  });

  fastify.route({
    method: 'POST',
    url: '/enquiry',
    // preHandler: verifyToken,
    handler: createEnquiry
  });

  fastify.route({
    method: 'PUT',
    url: '/enquiry/:enquiryId',
    // preHandler: verifyToken,
    handler: updateEnquiry
  });

  fastify.route({
    method: 'DELETE',
    url: '/enquiry/:enquiryId',
    preHandler: verifyToken,
    handler: deleteEnquiry
  });
};