'use strict';

var should = require('should'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    express = require('../../../../config/lib/express'), 
    Customer = require('../../server/models/customers.server.model.js');

/* Global Variables */
var app, agent, customer, id;

/**
 * Customer routes tests
 */
describe('Customer CRUD tests', function () {

  this.timeout(10000);

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  it('should it able to retrieve all customers', function(done) {
    agent.get('/api/customers')
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.body.should.have.length(12);
        done();
      });
  });

  it('should be able to save a customer', function(done) {
    var customer = {
      _id: 'testCustomer', 
      index: 0, 
      isActive: true
    };
    agent.post('/api/customers')
      .send(customer)
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res.body._id);
        res.body._id.should.equal('testCustomer');
        res.body.index.should.equal(0);
        res.body.isActive.should.equal(true);
        id = res.body._id;
        done();
      });
  });

  it('should be able to update a customer', function(done) {
    var updatedCustomer = {
      _id: 'testCustomer', 
      index: 0, 
      isActive: true
    };

    agent.put('/api/listings/' + id)
      .send(updatedCustomer)
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res.body._id);
        res.body._id.should.equal('testCustomer');
        res.body.index.should.equal(0);
        res.body.isActive.should.equal(true);
        done();
      });
  });

  it('should be able to delete a customer', function(done) {
    agent.delete('/api/customers/' + id)
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);

        agent.get('/api/customers/' + id) 
          .expect(400)
          .end(function(err, res) {
            id = undefined;
            done();
          });
      })
  });

  it('should not be able to save an Customer if no id is provided', function (done) {
    //Invalidate name field
    customer._id = '';

    agent.post('/api/customers')
      .send(customer)
      .expect(400)
      .end(function(err, res) {
        should.not.exist(res.body._id);
        should.exist(err);
        done();
      });
  });

  
});
