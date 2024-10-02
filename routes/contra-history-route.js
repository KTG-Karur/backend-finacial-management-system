"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const contraHistoryServices = require("../service/contra-history-service");
const _ = require('lodash');

// const schema = {
//   contraHistoryName: { type: "string", optional: false, min:1, max: 100 }
// }

async function getContraHistory(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await contraHistoryServices.getContraHistory(req.query);
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

async function createContraHistory(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await contraHistoryServices.createContraHistory(req.body);
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

async function updateContraHistory(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    responseEntries.data = await contraHistoryServices.updateContraHistory(req.params.contraHistoryId, req.body);
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
    url: '/contra-history',
    preHandler: verifyToken,
    handler: getContraHistory
  });

  fastify.route({
    method: 'POST',
    url: '/contra-history',
    preHandler: verifyToken,
    handler: createContraHistory
  });

  fastify.route({
    method: 'PUT',
    url: '/contra-history/:contraHistoryId',
    preHandler: verifyToken,
    handler: updateContraHistory
  });

};