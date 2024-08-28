"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const martialStatusServices = require("../service/martial-status-service");

const schema = {
  martialStatusName: { type: "string", optional: false, min:1, max: 100 }
}

async function getMartialStatus(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await martialStatusServices.getMartialStatus(req.query);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = responseCode.BAD_REQUEST;
  } finally {
    res.send(responseEntries);
  }
}

async function createMartialStatus(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = await v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
    responseEntries.data = await martialStatusServices.createMartialStatus(req.body);
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

async function updateMartialStatus(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
      responseEntries.data = await martialStatusServices.updateMartialStatus(req.params.martialStatusId, req.body);
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

async function deleteMartialStatus(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await martialStatusServices.deleteMartialStatus(req.params.martialStatusId);
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
    url: '/martial-status',
    preHandler: verifyToken,
    handler: getMartialStatus
  });

  fastify.route({
    method: 'POST',
    url: '/martial-status',
    preHandler: verifyToken,
    handler: createMartialStatus
  });

  fastify.route({
    method: 'PUT',
    url: '/martial-status/:martialStatusId',
    preHandler: verifyToken,
    handler: updateMartialStatus
  });

  fastify.route({
    method: 'DELETE',
    url: '/martial-status/:martialStatusId',
    preHandler: verifyToken,
    handler: deleteMartialStatus
  });
};