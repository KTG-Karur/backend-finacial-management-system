"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const applicantProofServices = require("../service/applicant-proof-service");
const _ = require('lodash');

const schema = {
    $$root: true,
    type: "array",
    items: {
        type: "object",
        proofTypeId: "number|required|integer|positive",
        proofNo: { type: "string", optional: false, min: 1, max: 100 },
    }
}

async function getApplicantProof(req, res) {
    const responseEntries = new ResponseEntry();
    try {
        responseEntries.data = await applicantProofServices.getApplicantProof(req.query);
        if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
    } catch (error) {
        responseEntries.error = true;
        responseEntries.message = error.message ? error.message : error;
        responseEntries.code = responseCode.BAD_REQUEST;
    } finally {
        res.send(responseEntries);
    }
}

async function createApplicantProof(req, res) {
    const responseEntries = new ResponseEntry();
    const v = new Validator()
    try {
        const validationResponse = await v.validate(req.body, schema)
        if (validationResponse != true) {
            throw new Error(messages.VALIDATION_FAILED);
        } else {
            responseEntries.data = await applicantProofServices.createApplicantProof(req.body);
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

async function updateApplicantProof(req, res) {
    const responseEntries = new ResponseEntry();
    const v = new Validator()
    try {
        const filteredSchema = _.pick(schema, Object.keys(req.body));
        const validationResponse = v.validate(req.body, filteredSchema)
        if (validationResponse != true) {
            throw new Error(messages.VALIDATION_FAILED);
        } else {
            responseEntries.data = await applicantProofServices.updateApplicantProof(req.params.applicantProofId, req.body);
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

async function deleteApplicantProof(req, res) {
    const responseEntries = new ResponseEntry();
    try {
      responseEntries.data = await applicantProofServices.deleteApplicantProof(req.params.applicantProofId);
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
        url: '/applicant-proof',
        preHandler: verifyToken,
        handler: getApplicantProof
    });

    fastify.route({
        method: 'POST',
        url: '/applicant-proof',
        preHandler: verifyToken,
        handler: createApplicantProof
    });

    fastify.route({
        method: 'PUT',
        url: '/applicant-proof/:applicantProofId',
        preHandler: verifyToken,
        handler: updateApplicantProof
    });

    fastify.route({
        method: 'DELETE',
        url: '/applicant-proof/:applicantProofId',
        preHandler: verifyToken,
        handler: deleteApplicantProof
      });
};