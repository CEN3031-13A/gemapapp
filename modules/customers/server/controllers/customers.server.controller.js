'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Customer = mongoose.model('Customer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an customer
 */
exports.create = function (req, res) {
  var customer = new Customer(req.body);
  customer.user = req.user;

  customer.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(customer);
    }
  });
};

/**
 * Show the current customer
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var customer = req.customer ? req.customer.toJSON() : {};

  // Add a custom field to the Customer, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Customer model.
  customer.isCurrentUserOwner = !!(req.user && customer.user && customer.user._id.toString() === req.user._id.toString());

  res.json(customer);
};

/**
 * Update an customer
 */
exports.update = function (req, res) {
  var customer = req.customer;

  customer.title = req.body.title;
  customer.content = req.body.content;

  customer.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(customer);
    }
  });
};

/**
 * Delete an customer
 */
exports.delete = function (req, res) {
  var customer = req.customer;

  customer.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(customer);
    }
  });
};

/**
 * List of Customers
 */
exports.list = function (req, res) {
  Customer.find().sort('-created').populate('user', 'displayName').exec(function (err, customers) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(customers);
    }
  });
};

/**
 * Customer middleware
 */
exports.customerByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Customer is invalid'
    });
  }

  Customer.findById(id).populate('user', 'displayName').exec(function (err, customer) {
    if (err) {
      return next(err);
    } else if (!customer) {
      return res.status(404).send({
        message: 'No customer with that identifier has been found'
      });
    }
    req.customer = customer;
    next();
  });
};
