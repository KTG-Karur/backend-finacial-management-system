'use strict';

const fastify = require('fastify')();

module.exports = function routesPlugin(fastify, opts, next) {
  fastify.register(require('./login-route'));
  fastify.register(require('./department-route'));
  fastify.register(require('./designation-route'));
  fastify.register(require('./role-route'));
  fastify.register(require('./user-route'));
  fastify.register(require('./employee-route'));
  fastify.register(require('./gender-route'));
  fastify.register(require('./applicant-type-route'));
  fastify.register(require('./category-route'));
  fastify.register(require('./sub-category-route'));
  fastify.register(require('./state-route'));
  fastify.register(require('./country-route'));
  fastify.register(require('./district-route'));
  fastify.register(require('./disbursed-method-route'));
  fastify.register(require('./loan-status-route'));
  fastify.register(require('./income-type-route'));
  fastify.register(require('./expensive-type-route'));
  fastify.register(require('./martial-status-route'));
  fastify.register(require('./applicant-proof-type-route'));
  fastify.register(require('./address-type-route'));
  fastify.register(require('./applicant-route'));
  fastify.register(require('./applicant-details-route'));
  fastify.register(require('./applicant-address-info-route'));
  fastify.register(require('./applicant-income-route'));
  fastify.register(require('./applicant-proof-route'));
  fastify.register(require('./bank-account-route'));
  fastify.register(require('./loan-route'));
  fastify.register(require('./loan-charges-details-route'));
  fastify.register(require('./income-entry-route'));
  fastify.register(require('./expense-entry-route'));
  fastify.register(require('./loan-charges-type-route'));
  next();
};