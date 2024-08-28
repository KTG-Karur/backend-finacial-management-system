"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const addressTypeServices = require("../service/address-type-service");

const schema = {
  addressTypeName: { type: "string", optional: false, min:1, max: 100 }
}

async function getAddressType(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await addressTypeServices.getAddressType(req.query);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = responseCode.BAD_REQUEST;
  } finally {
    res.send(responseEntries);
  }
}

async function createAddressType(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = await v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
    responseEntries.data = await addressTypeServices.createAddressType(req.body);
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

async function updateAddressType(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
      responseEntries.data = await addressTypeServices.updateAddressType(req.params.addressTypeId, req.body);
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

async function deleteAddressType(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await addressTypeServices.deleteAddressType(req.params.addressTypeId);
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
    url: '/address-type',
    preHandler: verifyToken,
    handler: getAddressType
  });

  fastify.route({
    method: 'POST',
    url: '/address-type',
    preHandler: verifyToken,
    handler: createAddressType
  });

  fastify.route({
    method: 'PUT',
    url: '/address-type/:addressTypeId',
    preHandler: verifyToken,
    handler: updateAddressType
  });

  fastify.route({
    method: 'DELETE',
    url: '/address-type/:addressTypeId',
    preHandler: verifyToken,
    handler: deleteAddressType
  });
};