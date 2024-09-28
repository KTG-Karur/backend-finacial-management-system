"use strict";

const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const searchApplicantServices = require("../service/search-applicant-service");
const _ = require('lodash');

async function getSearchApplicant(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await searchApplicantServices.getSearchApplicant(req.query);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = responseCode.BAD_REQUEST;
  } finally {
    res.send(responseEntries);
  }
}

async function getSearchLoanDetails(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await searchApplicantServices.getSearchLoanDetails(req.query);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = responseCode.BAD_REQUEST;
  } finally {
    res.send(responseEntries);
  }
}

module.exports = async function (fastify) {
  fastify.route({
    method: 'GET',
    url: '/search-applicant',
    preHandler: verifyToken,
    handler: getSearchApplicant
  });

  fastify.route({
    method: 'GET',
    url: '/search-applicant-details',
    preHandler: verifyToken,
    handler: getSearchLoanDetails
  });

};