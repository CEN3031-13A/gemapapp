'use strict';

var should = require('should'),
    mocha = require('mocha'),
    expect = require('chai').expect,
    request = require('supertest'),
    mongoose = require('mongoose'),
    express = require('express'),
    Customer = require('../../server/models/customer.server.model.js'),
    Schema = mongoose.Schema;

/* Global Variables */
var app, agent, id;

/**
 * Customer routes tests
 */
describe('Customer CRUD tests', function () {

  this.timeout(10000);

  before(function (done) {
    // Get application
    app = express();//.init(mongoose);
    agent = request.agent(app);

    done();
  });

  it('should it able to retrieve all customers', function(done) {
    agent.get('/api/customers')
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res);
        res.body.should.have.length(11);
        done();
      });
  });

  it('should be able to save a customer', function(done) {
    var newcustomer = {
      index: 11, 
      isActive: true
    };
    agent.post('/api/customers')
      .send(newcustomer)
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res.body._id);
        res.body.index.should.equal(11);
        res.body.isActive.should.equal(true);
        id = customer._id;
        done();
      });
  });

  it('should be able to update a customer', function(done) {
    var updatedCustomer = {
      index: 11, 
      isActive: false
    };

    agent.put('/api/customers/' + id)
      .send(updatedCustomer)
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        should.exist(res.body._id);
        res.body.index.should.equal(11);
        res.body.isActive.should.equal(false);
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

  // it('should not be able to save an Customer if no id is provided', function (done) {
  //   //Invalidate id field
  //   // var customer = {
  //   //   _id: ''
  //   // };

  //   // agent.post('/api/map')
  //   //   .send(customer)
  //   //   .expect(404)
  //   //   .end(function(err, res) {
  //   //     should.not.exist(null);
  //   //     should.exist(customer);
  //   //     done();
  //   //   });
  //   done();
  // });

  // it('should be able to retrieve a single listing', function(done) {
  //   // Customer.findOne({name: 'Library West'}, function(err, listing) {
  //   //   if(err) {
  //   //     console.log(err);
  //   //   } else {
  //   //     agent.get('/api/listings/' + listing._id)
  //   //       .expect(200)
  //   //       .end(function(err, res) {
  //   //         should.not.exist(err);
  //   //         should.exist(res);
  //   //         res.body.name.should.equal('Library West');
  //   //         res.body.code.should.equal('LBW');
  //   //         res.body.address.should.equal('1545 W University Ave, Gainesville, FL 32603, United States');
  //   //         res.body._id.should.equal(listing._id.toString());
  //   //         done();
  //   //       });
  //   //   }
  //   // });
  //   done();
  // });
});
