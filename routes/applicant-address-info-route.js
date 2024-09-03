"use strict";

const Validator = require('fastest-validator')
const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const applicantAddressServices = require("../service/applicant-address-service");
const _ = require('lodash');

const schema = {
    $$root: true,
    type: "array",
    items: {
        type: "object",
        props: {
            addressTypeId: "number|required|integer|positive",
            address: { type: "string", optional: false, min: 1, max: 500 },
            landmark: { type: "string", optional: false, min: 1, max: 100 },
            districtId: "number|required|integer|positive",
            stateId: "number|required|integer|positive",
            countryId: "number|required|integer|positive",
            pincode: { type: "string", optional: false, min: 3, max: 6 },
        }
    }
}

async function getApplicantAddress(req, res) {
    const responseEntries = new ResponseEntry();
    try {
        responseEntries.data = await applicantAddressServices.getApplicantAddress(req.query);
        if (!responseEntries.data) responseEntries.message = messages.DATA_NOT_FOUND;
    } catch (error) {
        responseEntries.error = true;
        responseEntries.message = error.message ? error.message : error;
        responseEntries.code = responseCode.BAD_REQUEST;
    } finally {
        res.send(responseEntries);
    }
}

async function createApplicantAddress(req, res) {
    const responseEntries = new ResponseEntry();
    const v = new Validator()
    try {
        let validationResponse = await v.validate(req.body, schema)
        console.log(validationResponse)
        if (validationResponse != true) {
            throw new Error(messages.VALIDATION_FAILED);
        } else {
            responseEntries.data = await applicantAddressServices.createApplicantAddress(req.body);
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

async function updateApplicantAddress(req, res) {
    const responseEntries = new ResponseEntry();
    const v = new Validator()
    try {
        const filteredSchema = _.pick(schema, Object.keys(req.body));
        const validationResponse = v.validate(req.body, filteredSchema)
        if (validationResponse != true) {
          throw new Error(messages.VALIDATION_FAILED);
        }else{
            responseEntries.data = await applicantAddressServices.updateApplicantAddress(req.params.applicantAddressInfoId, req.body);
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
        url: '/applicant-address',
        preHandler: verifyToken,
        handler: getApplicantAddress
    });

    fastify.route({
        method: 'POST',
        url: '/applicant-address',
        preHandler: verifyToken,
        handler: createApplicantAddress
    });

    fastify.route({
        method: 'PUT',
        url: '/applicant-address/:applicantAddressInfoId',
        preHandler: verifyToken,
        handler: updateApplicantAddress
    });
};