"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const disbursedMethodServices = require("../service/disbursed-method-service");
const _ = require('lodash');

const schema = {
  disbursedMethodName: { type: "string", optional: false, min:1, max: 100 }
}

async function getDisbursedMethod(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await disbursedMethodServices.getDisbursedMethod(req.query);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = responseCode.BAD_REQUEST;
  } finally {
    res.send(responseEntries);
  }
}

async function createDisbursedMethod(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = await v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
    responseEntries.data = await disbursedMethodServices.createDisbursedMethod(req.body);
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

async function updateDisbursedMethod(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const filteredSchema = _.pick(schema, Object.keys(req.body));
    const validationResponse = v.validate(req.body, filteredSchema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
      responseEntries.data = await disbursedMethodServices.updateDisbursedMethod(req.params.disbursedMethodId, req.body);
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

async function deleteDisbursedMethod(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await disbursedMethodServices.deleteDisbursedMethod(req.params.disbursedMethodId);
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
    url: '/disbursed-method',
    preHandler: verifyToken,
    handler: getDisbursedMethod
  });

  fastify.route({
    method: 'POST',
    url: '/disbursed-method',
    preHandler: verifyToken,
    handler: createDisbursedMethod
  });

  fastify.route({
    method: 'PUT',
    url: '/disbursed-method/:disbursedMethodId',
    preHandler: verifyToken,
    handler: updateDisbursedMethod
  });

  fastify.route({
    method: 'DELETE',
    url: '/disbursed-method/:disbursedMethodId',
    preHandler: verifyToken,
    handler: deleteDisbursedMethod
  });
};