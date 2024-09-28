"use strict";

const { verifyToken } = require("../middleware/auth");
const { ResponseEntry } = require("../helpers/construct-response");
const responseCode = require("../helpers/status-code");
const messages = require("../helpers/message");
const uploadService = require("../helpers/upload-images");
const _ = require('lodash');
const fastifyMultipart = require('@fastify/multipart');

async function UploadApplicantProof(req, res) {
    const responseEntries = new ResponseEntry();
    try {
        console.log(req.parts)
        const parts = req.parts();
        const files = []; // To hold uploaded files
        const otherFields = {}; // To hold other form fields

        for await (const part of parts) {
            if (part.file) {
                // If the part is a file
                const buffer = await part.toBuffer(); // Get the file as buffer
                const fileName = part.filename; // Get the file name

                // Store file information
                files.push({ fileName, buffer });
                console.log('File received:', fileName);
            } else {
                // If the part is a regular field
                otherFields[part.fieldname] = part.value; // Save other field data
                console.log(`Field received: ${part.fieldname} = ${part.value}`);
            }
        }
        // responseEntries.data = await uploadService.upload(req.formData);
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
    fastify.register(fastifyMultipart, {
        limits: {
            fileSize: 1024 * 1024 * 5, 
        }
    });

    fastify.route({
        method: 'POST',
        url: '/upload-proof',
        preHandler: verifyToken,
        handler: UploadApplicantProof
    });

};