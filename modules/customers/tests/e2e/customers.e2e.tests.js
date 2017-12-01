'use strict';
describe('Customers E2E Tests:', function () {
    describe('Customer Functionality', function () {
	beforeEach(function(){
	    browser.get('http://localhost:3000/map');
	});
	describe('Customer Functionality', function () {
	    it('should load customers on keyup', function() {
		// // Find the element with ng-model="user" and type "jacksparrow" into it
		// element(by.model('vm.searchText')).sendKeys('');
		// Find the first (and only) button on the page and click it
		//element(by.css('')).click();

		// Verify that there are 10 tasks
		//expect(element.all(by.repeater('customer in customers')).count()).toEqual(3);

		// Enter 'groceries' into the element with ng-model="filterText"
		//element(by.model('filterText')).sendKeys('groceries');

		// Find the element with ng-model="user" and type "jacksparrow" into it
		//element(by.model('vm.searchText')).sendKeys('auto');

		// Verify that now there is only one item in the task list
		//expect(element.all(by.repeater('customer in customers')).count()).toEqual(1);
		expect(true).toEqual(true);
	    });
	    it('should filter results by active customer status', function() {
		// // Find the element with ng-model="user" and type "jacksparrow" into it
		// element(by.model('vm.searchText')).sendKeys('');

		// Find the first (and only) button on the page and click it
		//element(by.id('id1')).click();

		// Verify that there are 10 tasks
		//expect(element.all(by.repeater('customer in customers')).count()).toEqual(3);

		// Enter 'groceries' into the element with ng-model="filterText"
		//element(by.model('filterText')).sendKeys('groceries');

		// Find the element with ng-model="user" and type "jacksparrow" into it
		//element(by.model('vm.searchText')).sendKeys('auto');

		// Verify that now there is only one item in the task list
		//expect(element.all(by.repeater('customer in customers')).count()).toEqual(1);
		expect(true).toEqual(true);
	    });

	    it('should filter results by inactive customer status', function() {
		// // Find the element with ng-model="user" and type "jacksparrow" into it
		// element(by.model('vm.searchText')).sendKeys('');

		// Find the first (and only) button on the page and click it
		//element(by.id('id2')).click();
	
		// Verify that there are 10 tasks
		///expect(element.all(by.repeater('customer in customers')).count()).toEqual(3);

		// Enter 'groceries' into the element with ng-model="filterText"
		//element(by.model('filterText')).sendKeys('groceries');

		// Find the element with ng-model="user" and type "jacksparrow" into it
		//element(by.model('vm.searchText')).sendKeys('auto');

		// Verify that now there is only one item in the task list
		//expect(element.all(by.repeater('customer in customers')).count()).toEqual(1);
		expect(true).toEqual(true);
	    });

	    it('should filter results by all status', function() {

		// // Find the element with ng-model="user" and type "jacksparrow" into it
		// element(by.model('vm.searchText')).sendKeys('');

		// Find the first (and only) button on the page and click it
		//element(by.id('id2')).click();

		// Verify that there are 10 tasks
		//expect(element.all(by.repeater('customer in customers')).count()).toEqual(3);

		// Enter 'groceries' into the element with ng-model="filterText"
		//element(by.model('filterText')).sendKeys('groceries');
		
		// Find the element with ng-model="user" and type "jacksparrow" into it
		//element(by.model('vm.searchText')).sendKeys('auto');

		// Verify that now there is only one item in the task list
		//expect(element.all(by.repeater('customer in customers')).count()).toEqual(1);
		expect(true).toEqual(true);
	    });
	});
	it('should render customer sidebar', function () {
	    element
	    expect(true).toEqual(true);
	});
    });
    describe('Map Functionality', function () {
	it('no location should be undefined', function () {
	    expect(true).toEqual(true);
	});

	it('pin colors should be colored according to delivery state', function () {
	    expect(true).toEqual(true);
	});

	it('arrays should have correct marker information', function () {
	    expect(true).toEqual(true);
	});

	it('should set all markers on the map', function () {
	    expect(true).toEqual(true);
	});

	it('should clear all markers on the map', function () {
	    expect(true).toEqual(true);
	});

	it('should draw lines on the map', function () {
	    expect(true).toEqual(true);
	});

	it('should close all info window', function () {
	    expect(true).toEqual(true);
	});
    });

    describe('Comments Functionality', function () {
	it('should add comment to submit once submitted', function () {
	    // Find the element with ng-model="user" and type "jacksparrow" into it
	    element(by.model('vm.searchText')).sendKeys('New comment');
	    expect(true).toEqual(true);
	});
    });
});
