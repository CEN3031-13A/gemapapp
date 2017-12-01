'use strict';

/**
 * Module dependencies.
 */

var should = require('should'),
  request = require('supertest'),
  mongoose = require('mongoose'),
  express = require('express'),
  Customer = require('../../server/models/customer.server.model.js'),
  Schema = mongoose.Schema;

/* Globals */
var user;
var customer;

  /* Unit tests */
describe('Customer Schema Unit Tests:', function () {
  before(function (done) {
    mongoose.connect(Customer.db.uri);
    done();
  });

  describe('Saving to database', function () {
    /*
      Mocha's default timeout for tests is 2000ms. Saving to MongoDB is an asynchronous task
      that may take longer thatn 2000ms. To ensure that the tests do not fail prematurely,
      we can increase the timeout setting with the method this.timeout()
     */
    this.timeout(10000);

    it('throws an error when id not provided', function (done) {
      new Customer({
        isActive: true
      }).save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    if (Customer.id) {
      Customer.remove({ _id: Customer.id }, function (err) {
        Customer.id = null;
        done();
      });
    } else {
      done();
    }
  });
});
