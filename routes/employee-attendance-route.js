"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const employeeAttendanceServices = require("../service/employee-attendance-service");
const _ = require('lodash');

const schema = {
  employeeAttendanceName: { type: "string", optional: false, min:1, max: 100 }
}

async function getEmployeeAttendance(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await employeeAttendanceServices.getEmployeeAttendance(req.query);
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

async function getEmployeeAttendanceReport(req, res) {
  const responseEntries = new ResponseEntry();
  try {
    responseEntries.data = await employeeAttendanceServices.getEmployeeAttendanceReport(req.query);
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

async function createEmployeeAttendance(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    responseEntries.data = await employeeAttendanceServices.createEmployeeAttendance(req.body);
    if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
    // const validationResponse = await v.validate(req.body, schema)
    // if (validationResponse != true) {
    //   throw new Error(messages.VALIDATION_FAILED);
    // }else{
    // responseEntries.data = await employeeAttendanceServices.createEmployeeAttendance(req.body);
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

async function updateEmployeeAttendance(req, res) {
  const responseEntries = new ResponseEntry();
  const v = new Validator()
  try {
    responseEntries.data = await employeeAttendanceServices.updateEmployeeAttendance(req.params.employeeAttendanceId, req.body);
      if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
    // const filteredSchema = _.pick(schema, Object.keys(req.body));
    // const validationResponse = v.validate(req.body, filteredSchema)
    // if (validationResponse != true) {
    //   throw new Error(messages.VALIDATION_FAILED);
    // }else{
    //   responseEntries.data = await employeeAttendanceServices.updateEmployeeAttendance(req.params.employeeAttendanceId, req.body);
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

module.exports = async function (fastify) {
  fastify.route({
    method: 'GET',
    url: '/employee-attendance',
    preHandler: verifyToken,
    handler: getEmployeeAttendance
  });

  fastify.route({
    method: 'GET',
    url: '/employee-attendance-report',
    preHandler: verifyToken,
    handler: getEmployeeAttendanceReport
  });

  fastify.route({
    method: 'POST',
    url: '/employee-attendance',
    preHandler: verifyToken,
    handler: createEmployeeAttendance
  });

  fastify.route({
    method: 'PUT',
    url: '/employee-attendance/:employeeAttendanceId',
    preHandler: verifyToken,
    handler: updateEmployeeAttendance
  });

};