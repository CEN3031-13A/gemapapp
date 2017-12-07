'use strict';

module.exports = {
  tests: {
    client: ['modules/customers/tests/client/list-customers.client.controller.tests.js'],
    server: ['modules/*/tests/server/**/*.js'],
    e2e: ['modules/*/tests/e2e/**/*.js']
  }
};
