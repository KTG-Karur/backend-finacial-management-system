"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const investmentServices = require("../service/investment-service");
const _ = require('lodash');

const schema = {
  investorId: "number|required|integer|positive",
  interestRate: "number|required|integer|positive",
  investmentAmount: { type: "string", optional: false, min: 1, max: 100 },
  disbursedMethodId: "number|required|integer|positive",
  createdBy: "number|required|integer|positive",
}

async function getInvestment(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await investmentServices.getInvestment(req.query);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = responseCode.BAD_REQUEST;
  } finally {
    res.send(responseEntries);
  }
}

async function getInvestmentDetails(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await investmentServices.getInvestmentDetails(req.query);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = responseCode.BAD_REQUEST;
  } finally {
    res.send(responseEntries);
  }
}

async function createInvestment(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = await v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    } else {
      responseEntries.data = await investmentServices.createInvestment(req.body);
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

async function updateInvestment(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const filteredSchema = _.pick(schema, Object.keys(req.body));
    const validationResponse = v.validate(req.body, filteredSchema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    } else {
      responseEntries.data = await investmentServices.updateInvestment(req.params.investmentId, req.body);
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


module.exports = async function (fastify) {
  fastify.route({
    method: 'GET',
    url: '/investment',
    preHandler: verifyToken,
    handler: getInvestment
  });

  fastify.route({
    method: 'GET',
    url: '/investment-details',
    preHandler: verifyToken,
    handler: getInvestmentDetails
  });

  fastify.route({
    method: 'POST',
    url: '/investment',
    preHandler: verifyToken,
    handler: createInvestment
  });

  fastify.route({
    method: 'PUT',
    url: '/investment/:investmentId',
    preHandler: verifyToken,
    handler: updateInvestment
  });
};