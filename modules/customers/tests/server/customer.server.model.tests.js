'use strict';

/**
 * Module dependencies.
 */

var should = require('should'),
  request = require('supertest'),
  mongoose = require('mongoose'),
  config = require('../../../../config/config'),
  express = require('express'),
  Customer = require('../../server/models/customer.server.model.js'),
  Schema = mongoose.Schema;

/* Globals */
var user;
var customer;
var id;

var newcustomer = ({
  _id: 'testCustomer',
  name: 'Test Customer',
  index: 11, 
  isActive: true
});

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

    it('saves properly when _id and name provided', function(done){
      new Customer({
        name: newcustomer.name, 
        _id: newcustomer._id
      }).save(function(err, doc){
        should.not.exist(err);
        id = doc._id;
        done();
      });
    });

    it('throws an error when _id is duplicated', function(done){
      new Customer(newcustomer).save(function(err, doc){
        should.exist(err);
        done();
      });
    });

    after(function (done) {
      Customer.remove({ _id: id }, function (err) {
        Customer.id = null;
        done();
      });
    });

    after(function(done){
      mongoose.connection.close();
      done();

    });
  });
});
