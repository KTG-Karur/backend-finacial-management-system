"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const duePaymentServices = require("../service/due-payment-service");
const _ = require('lodash');

const schema = {
  loanId: { type: "string", optional: false, min:1, max: 100 }
}

async function getDuePayment(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await duePaymentServices.getDuePayment(req.query);
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

async function getDuePaymentDetails(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await duePaymentServices.getDuePaymentDetails(req.query);
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

async function getDuePaymentInvestor(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await duePaymentServices.getDuePaymentInvestor(req.query);
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

async function getDuePaymentInvestorDetails(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await duePaymentServices.getDuePaymentInvestorDetails(req.query);
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

async function createDuePayment(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await duePaymentServices.createDuePayment(req.body);
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

async function updateDuePayment(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await duePaymentServices.updateDuePayment(req.params.duePaymentId, req.body);
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
    url: '/due-payment',
    preHandler: verifyToken,
    handler: getDuePayment
  });

  fastify.route({
    method: 'GET',
    url: '/due-payment-details',
    preHandler: verifyToken,
    handler: getDuePaymentDetails
  });

  fastify.route({
    method: 'GET',
    url: '/investment-receipt',
    preHandler: verifyToken,
    handler: getDuePaymentInvestor
  });

  fastify.route({
    method: 'GET',
    url: '/investment-receipt-details',
    preHandler: verifyToken,
    handler: getDuePaymentInvestorDetails
  });

  fastify.route({
    method: 'POST',
    url: '/due-payment',
    preHandler: verifyToken,
    handler: createDuePayment
  });

  fastify.route({
    method: 'PUT',
    url: '/due-payment/:duePaymentId',
    preHandler: verifyToken,
    handler: updateDuePayment
  });

};