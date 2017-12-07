'use strict';
// var should = require('should'),
//     mocha = require('mocha'),
//     //request = require('supertest'),
//     mongoose = require('mongoose'),
//     //express = require('../../../../config/lib/express'),
//     
//     //Schema = mongoose.Schema;

var http = require('http'),
  should = require('should'),
  request = require('request'),
  mongoose = require('mongoose'),
  config = require('../../../../config/config'),
  Customer = require('../../server/models/customer.server.model.js'),
  Schema = mongoose.Schema,
  controller = require('../../server/controllers/customers.server.controller.js');

/* Global Variables */
var app, agent, id, savedId, customerLength, bodyData;

var newcustomer = ({
  _id: 'testCustomer',
  name: 'Test Customer',
  index: 11, 
  isActive: true
});

/**
 * Customer routes tests
 */
describe('Customer CRUD tests', function () {

  this.timeout(10000);

  before(function(done){
    mongoose.connect(config.db.uri);
    done();
  });

  it('should retrieve and list all customers', function(done){
    request.get('https://gemapapp.herokuapp.com/api/customers', function(err, res, body){
      res.statusCode.should.be.exactly(200);
      should.not.exist(err);
      should.exist(res);
      bodyData = JSON.parse(body);
      bodyData.should.have.length(11);
      id = bodyData[0]._id;
      customerLength = bodyData.length;
      //console.log(id);
      done();
    });
  });

  it('should be able to retrieve data for each individual customer', function(done){
    for(var i = 0; i < customerLength; i++){
      id = bodyData[i]._id;
      request.get('https://gemapapp.herokuapp.com/api/customers/' + id, function(err, res, body){
        res.statusCode.should.be.exactly(200);
        should.not.exist(err);
        should.exist(res);
      });
    }
    done();
  });

  it('should be able to save a customer', function(done) {
    new Customer({
      _id: newcustomer._id,
      name: newcustomer.name,
      index: newcustomer.index, 
      isActive: newcustomer.isActive
    }).save(function(err, newcustomer){
      should.not.exist(err);
      savedId = newcustomer._id;
      done();
    });
  });

  // it('should be able to update a customer', function(done) {
  //   Customer.
  // });
  it('should be able to retrieve a single customer', function(done) {
    Customer.findOne({name: 'Test Customer'}, function(err, customer) {
      if(err) {
        console.log(err);
      } else {
        request.get('https://gemapapp.herokuapp.com/api/customers/' + customer._id, function(err, res, body){
          res.statusCode.should.be.exactly(200);
          should.not.exist(err);
          should.exist(res);
          done();
        });
      }
    });
  });

  it('should be retrieve saved customer', function(done) {
    request.get('https://gemapapp.herokuapp.com/api/customers/' + savedId, function(err, res, body){
      res.statusCode.should.be.exactly(200);
      should.not.exist(err);
      done();
    });
  });

  it('should be able to delete a customer', function(done) {
    request.delete('https://gemapapp.herokuapp.com/api/customers/' + savedId, function(err, res, body){
        res.statusCode.should.be.exactly(200);
        should.not.exist(err);
        done();
    });      
  });

  it('should not be able to retrieve deleted customer', function(done) {
    request.get('https://gemapapp.herokuapp.com/api/customers/' + savedId, function(err, res, body){
      res.statusCode.should.be.exactly(404);
      done();
    });
  });

  after(function(done){
      mongoose.connection.close();
     done();
  });
});
