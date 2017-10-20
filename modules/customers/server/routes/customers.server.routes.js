'use strict';

/**
 * Module dependencies
 */

var customers = require('../controllers/customers.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/customers')
    .get(customers.list)
    .post(customers.create);

  // Single article routes
  app.route('/api/customers/:customersId')
    .get(customers.read)
    .put(customers.update)
    .delete(customers.delete);

  // Finish by binding the article middleware
  app.param('customerId', customers.customerByID);
};
