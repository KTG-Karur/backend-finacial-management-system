"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const dayBookHistoryServices = require("../service/day-book-history-service");
const _ = require('lodash');

const schema = {
  dayBookHistoryName: { type: "string", optional: false, min:1, max: 100 }
}

async function getDayBookHistory(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await dayBookHistoryServices.getDayBookHistory(req.query);
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

async function createDayBookHistory(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = await v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
    responseEntries.data = await dayBookHistoryServices.createDayBookHistory(req.body);
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

async function updateDayBookHistory(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const filteredSchema = _.pick(schema, Object.keys(req.body));
    const validationResponse = v.validate(req.body, filteredSchema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
      responseEntries.data = await dayBookHistoryServices.updateDayBookHistory(req.params.dayBookHistoryId, req.body);
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

async function deleteDayBookHistory(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await dayBookHistoryServices.deleteDayBookHistory(req.params.dayBookHistoryId);
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
    url: '/day-book-history',
    preHandler: verifyToken,
    handler: getDayBookHistory
  });

  fastify.route({
    method: 'POST',
    url: '/day-book-history',
    preHandler: verifyToken,
    handler: createDayBookHistory
  });

  fastify.route({
    method: 'PUT',
    url: '/day-book-history/:dayBookHistoryId',
    preHandler: verifyToken,
    handler: updateDayBookHistory
  });

  fastify.route({
    method: 'DELETE',
    url: '/day-book-history/:dayBookHistoryId',
    preHandler: verifyToken,
    handler: deleteDayBookHistory
  });
};