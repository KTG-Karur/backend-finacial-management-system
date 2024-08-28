"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const stateServices = require("../service/state-service");

const schema = {
  stateName: { type: "string", optional: false, min:1, max: 100 },
  countryId : "number|required|integer|positive",
}

async function getState(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await stateServices.getState(req.query);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = responseCode.BAD_REQUEST;
  } finally {
    res.send(responseEntries);
  }
}

async function createState(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = await v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
    responseEntries.data = await stateServices.createState(req.body);
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

async function updateState(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
      responseEntries.data = await stateServices.updateState(req.params.stateId, req.body);
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

async function deleteState(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await stateServices.deleteState(req.params.stateId);
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
    url: '/state',
    preHandler: verifyToken,
    handler: getState
  });

  fastify.route({
    method: 'POST',
    url: '/state',
    preHandler: verifyToken,
    handler: createState
  });

  fastify.route({
    method: 'PUT',
    url: '/state/:stateId',
    preHandler: verifyToken,
    handler: updateState
  });

  fastify.route({
    method: 'DELETE',
    url: '/state/:stateId',
    preHandler: verifyToken,
    handler: deleteState
  });
};