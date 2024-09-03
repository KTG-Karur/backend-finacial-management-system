"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const expensiveTypeServices = require("../service/expensive-type-service");
const _ = require('lodash');

const schema = {
  expensiveTypeName: { type: "string", optional: false, min:1, max: 100 },
}

async function getExpensiveType(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await expensiveTypeServices.getExpensiveType(req.query);
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

async function createExpensiveType(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = await v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
    responseEntries.data = await expensiveTypeServices.createExpensiveType(req.body);
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

async function updateExpensiveType(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const filteredSchema = _.pick(schema, Object.keys(req.body));
    const validationResponse = v.validate(req.body, filteredSchema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
      responseEntries.data = await expensiveTypeServices.updateExpensiveType(req.params.expensiveTypeId, req.body);
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

async function deleteExpensiveType(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await expensiveTypeServices.deleteExpensiveType(req.params.expensiveTypeId);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
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
    url: '/expensive-type',
    preHandler: verifyToken,
    handler: getExpensiveType
  });

  fastify.route({
    method: 'POST',
    url: '/expensive-type',
    preHandler: verifyToken,
    handler: createExpensiveType
  });

  fastify.route({
    method: 'PUT',
    url: '/expensive-type/:expensiveTypeId',
    preHandler: verifyToken,
    handler: updateExpensiveType
  });

  fastify.route({
    method: 'DELETE',
    url: '/expensive-type/:expensiveTypeId',
    preHandler: verifyToken,
    handler: deleteExpensiveType
  });
};