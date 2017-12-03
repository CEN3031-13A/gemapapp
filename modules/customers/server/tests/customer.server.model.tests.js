'use strict';

/**
 * Module dependencies.
 */

var should = require('should'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    express = require('../../../../config/lib/express'), 
    config = require('../../../../config/config'),
    Customer = require('../models/customers.server.model.js');

/* Globals */
var user, customer;

  /* Unit tests */
  describe('Customer Schema Unit Tests:', function () {
    before(function(done) {
    mongoose.connect(config.db.uri);
    done();
  });

  describe('Saving to database', function() {
    /*
      Mocha's default timeout for tests is 2000ms. Saving to MongoDB is an asynchronous task 
      that may take longer thatn 2000ms. To ensure that the tests do not fail prematurely, 
      we can increase the timeout setting with the method this.timeout()
     */
    this.timeout(10000);

  it('throws an error when id not provided', function(done){
      new Customer({
        isActive: true
      }).save(function(err){
        should.exist(err);
        done();
      })
    });
  });

  afterEach(function(done) {
    if(id) {
      Customer.remove({_id: id}, function(err){
        id = null;
        done();
      });
    } else {
      done();
    }
  });
});
