'use strict';

/**
 * Module dependencies
 */
var customersPolicy = require('../policies/customers.server.policy'),
  customers = require('../controllers/customers.server.controller');

module.exports = function (app) {
  // Customers Routes
  app.route('/api/customers')
    .get(customers.list)
    .put(customers.update);
    .post(customers.create);

  app.route('/api/customers/update')
    .get(customers.read)
    

  // Finish by binding the Customer middleware
  app.param('customerId', customers.customerByID);
};
