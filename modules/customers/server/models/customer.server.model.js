'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');

/**
 * Customer Schema
 */
var customerSchema = new Schema({
	_id: String,
	index: Number,
	isActive: Boolean,
	logo: String,
	age: Number,
	name: String,
	email: String,
	phone: String,
	address: String,
	about: String,
	registered: String,
	orders: [{
		id: String,
		index: Number,
		shipments: [{
			id: String,
			tracking_number: String,
			carrier: String,
			origin: {
				latitude: Number,
				longitude: Number
			},
			destination: {
				latitude: Number,
				longitude: Number
			},
			current_location: {
				latitude: Number,
				longitude: Number
			},
			ship_date: String,
			expected_date: String,
			contents:[String],
		}],
	}]
	
});



mongoose.model('Customer', customerSchema);
module.exports = Customer;
