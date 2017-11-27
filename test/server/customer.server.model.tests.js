'use strict';

/**
 * Module dependencies.
 */
var chai = require('chai'),
    should = require('should'),
    mongoose = require('mongoose'),
    mocha = require('mocha'),
    Schema = mongoose.Schema;
    //Customer = mongoose.model('../../modules/customers/server/models/customer.server.model');


  //config = require('../../../../config'),
  //model = require('../../server/models/model'),
  //User = mongoose.model('User'),
  //Customer = mongoose.model('Customer');
  //Customer = mongoose.model(customerSchema);

/**
 * Globals
 */
var user,
  customer;

/**
 * Unit tests
 */
describe('Customer Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function () {
      customer = new Customer({
        name: 'Customer Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return customer.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function (done) {
      customer.name = '';

      return customer.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Customer.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
