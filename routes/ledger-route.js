"use strict";

const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const ledgerServices = require("../service/ledger-service");
const _ = require('lodash');

async function getLedgerCustomer(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await ledgerServices.getLedgerCustomer(req.query);
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

async function getLedgerEmployee(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await ledgerServices.getLedgerEmployee(req.query);
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

async function getLedgerDetails(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await ledgerServices.getLedgerDetails(req.query);
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

module.exports = async function (fastify) {
  fastify.route({
    method: 'GET',
    url: '/customer-ledger',
    preHandler: verifyToken,
    handler: getLedgerCustomer
  });

  fastify.route({
    method: 'GET',
    url: '/employee-ledger',
    preHandler: verifyToken,
    handler: getLedgerEmployee
  });

  fastify.route({
    method: 'GET',
    url: '/ledger-details',
    preHandler: verifyToken,
    handler: getLedgerDetails
  });
};