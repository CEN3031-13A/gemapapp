'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Customer Schema
 */
var CustomerSchema = new Schema({
  _id: {type: String, required: true, unique:true},
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
      delivery_state: String,
      late_penalties: String,
      comments: [{
        comment_date: String,
        comment: String
      }],
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
      contents: [String],
    }],
  }]
  
});

/* 'pre' function that adds the updated_at (and created_at if not already there) property */
CustomerSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at){
    this.created_at = currentDate;
  }
  next();
});

mongoose.model('Customer', CustomerSchema);
