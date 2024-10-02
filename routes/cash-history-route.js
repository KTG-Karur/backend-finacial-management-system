"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const cashHistoryServices = require("../service/cash-history-service");
const _ = require('lodash');

async function getCashHistory(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await cashHistoryServices.getCashHistory(req.query);
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

async function createCashHistory(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await cashHistoryServices.createCashHistory(req.body);
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

async function updateCashHistory(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await cashHistoryServices.updateCashHistory(req.params.cashHistoryId, req.body);
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
    url: '/cash-history',
    preHandler: verifyToken,
    handler: getCashHistory
  });

  fastify.route({
    method: 'POST',
    url: '/cash-history',
    preHandler: verifyToken,
    handler: createCashHistory
  });

  fastify.route({
    method: 'PUT',
    url: '/cash-history/:cashHistoryId',
    preHandler: verifyToken,
    handler: updateCashHistory
  });
};