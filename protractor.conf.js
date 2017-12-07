'use strict';

// Protractor configuration
var config = {
	framework: 'jasmine',
	seleniumAddress: 'http://localhost:4444/wd/hub',
  	specs: ['modules/customers/tests/e2e/customers.e2e.tests.js'],
  	onPrepare: function() {
  		browser.manage().window().maximize();
	}
};

exports.config = config;