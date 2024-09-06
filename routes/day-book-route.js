"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const dayBookServices = require("../service/day-book-service");
const _ = require('lodash');

const schema = {
    openingAmount: { type: "string", optional: false, min:1, max: 100 },
    closingAmount: { type: "string", optional: false, min:1, max: 100 },
    closingDate: { type: "string", format: "date", },
    createdBy: "number|required|integer|positive",
}

async function getDayBook(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await dayBookServices.getDayBook(req.query);
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

async function createDayBook(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    responseEntries.data = await dayBookServices.createDayBook(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
    // const validationResponse = await v.validate(req.body, schema)
    // if (validationResponse != true) {
    //   throw new Error(messages.VALIDATION_FAILED);
    // }else{
    // responseEntries.data = await dayBookServices.createDayBook(req.body);
    // if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
    // }
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = responseCode.BAD_REQUEST;
    res.status(responseCode.BAD_REQUEST);
  } finally {
    res.send(responseEntries);
  }
}

async function updateDayBook(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    responseEntries.data = await dayBookServices.updateDayBook(req.params.dayBookId, req.body);
      if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
    // const filteredSchema = _.pick(schema, Object.keys(req.body));
    // const validationResponse = v.validate(req.body, filteredSchema)
    // if (validationResponse != true) {
    //   throw new Error(messages.VALIDATION_FAILED);
    // }else{
    //   responseEntries.data = await dayBookServices.updateDayBook(req.params.dayBookId, req.body);
    //   if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
    // }
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = error.code ? error.code : responseCode.BAD_REQUEST;
    res.status(responseCode.BAD_REQUEST);
  } finally {
    res.send(responseEntries);
  }
}

async function deleteDayBook(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await dayBookServices.deleteDayBook(req.params.dayBookId);
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
    url: '/day-book',
    preHandler: verifyToken,
    handler: getDayBook
  });

  fastify.route({
    method: 'POST',
    url: '/day-book',
    preHandler: verifyToken,
    handler: createDayBook
  });

  fastify.route({
    method: 'PUT',
    url: '/day-book/:dayBookId',
    preHandler: verifyToken,
    handler: updateDayBook
  });

  fastify.route({
    method: 'DELETE',
    url: '/day-book/:dayBookId',
    preHandler: verifyToken,
    handler: deleteDayBook
  });
};