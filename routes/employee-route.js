"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const employeeServices = require("../service/employee-service");
const _ = require('lodash');

const schema = {
  firstName: { type: "string", optional: false, min:1, max: 100 },
  lastName: { type: "string", optional: true, min:1, max: 100 },
  emailId: { type: "email", optional: true, min:1, max: 100 },
  contactNo: { type: "string", optional: false, min:10, max: 10 },
  dob: { type: "string", format: "date", },
  dateOfJoining: { type: "string", format: "date", },
  roleId : "number|required|integer|positive",
  departmentId : "number|required|integer|positive",
  designationId : "number|required|integer|positive",
}

async function getEmployee(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await employeeServices.getEmployee(req.query);
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

async function createEmployee(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const validationResponse = await v.validate(req.body, schema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
    responseEntries.data = await employeeServices.createEmployee(req.body);
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

async function updateEmployee(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    const filteredSchema = _.pick(schema, Object.keys(req.body));
    const validationResponse = v.validate(req.body, filteredSchema)
    if (validationResponse != true) {
      throw new Error(messages.VALIDATION_FAILED);
    }else{
      responseEntries.data = await employeeServices.updateEmployee(req.params.employeeId, req.body);
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

module.exports = async function (fastify) {
  fastify.route({
    method: 'GET',
    url: '/employee',
    preHandler: verifyToken,
    handler: getEmployee
  });

  fastify.route({
    method: 'POST',
    url: '/employee',
    preHandler: verifyToken,
    handler: createEmployee
  });

  fastify.route({
    method: 'PUT',
    url: '/employee/:employeeId',
    preHandler: verifyToken,
    handler: updateEmployee
  });
};