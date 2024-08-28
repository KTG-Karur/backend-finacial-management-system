"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const subCategoryServices = require("../service/sub-category-service");

const schema = {
  subCategoryName: { type: "string", optional: false, min:1, max: 100 },
  categoryId : "number|required|integer|positive",
  interestRate : "number|required|integer|positive",
}

async function getSubCategory(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await subCategoryServices.getSubCategory(req.query);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
  } catch (error) {
    responseEntries.error = true;
    responseEntries.message = error.message ? error.message : error;
    responseEntries.code = responseCode.BAD_REQUEST;
  } finally {
    res.send(responseEntries);
  }
}

async function createSubCategory(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = await v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
    responseEntries.data = await subCategoryServices.createSubCategory(req.body);
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

async function updateSubCategory(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
      responseEntries.data = await subCategoryServices.updateSubCategory(req.params.subCategoryId, req.body);
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

async function deleteSubCategory(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await subCategoryServices.deleteSubCategory(req.params.subCategoryId);
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
    url: '/sub-category',
    preHandler: verifyToken,
    handler: getSubCategory
  });

  fastify.route({
    method: 'POST',
    url: '/sub-category',
    preHandler: verifyToken,
    handler: createSubCategory
  });

  fastify.route({
    method: 'PUT',
    url: '/sub-category/:subCategoryId',
    preHandler: verifyToken,
    handler: updateSubCategory
  });

  fastify.route({
    method: 'DELETE',
    url: '/sub-category/:subCategoryId',
    preHandler: verifyToken,
    handler: deleteSubCategory
  });
};