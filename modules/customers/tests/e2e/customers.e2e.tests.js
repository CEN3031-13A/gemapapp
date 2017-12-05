'use strict';

describe('Customers E2E Tests:', function () {
	it('should have a title', function(){
		browser.get('https://gemapapp.herokuapp.com/map');

		expect(browser.getTitle()).toEqual('GE Shipment Tracker');
	});
});

describe('should filter tree element by input', function () {
	beforeEach(function() {
		browser.get('https://gemapapp.herokuapp.com/map');

		browser.waitForAngularEnabled();
		browser.sleep(1000);
	});

	it('should show no matching customers when no customers contain the input', function() {
		var searchBar = element(by.model('vm.searchText'));
		searchBar.sendKeys('q');
		browser.sleep(1000);

		var tree = element(by.tagName('px-tree'));

		tree.getText().then(function(text) {
			browser.sleep(1000);
			
			// Verify correct filtering
	     	expect(text).toEqual('');
	    });
	});

	it('should filter customers based on input in search bar', function(){
		var searchBar = element(by.model('vm.searchText'));
		searchBar.sendKeys('a');
		browser.sleep(1000);

		var tree = element(by.tagName('px-tree'));

		tree.getText().then(function(text) {
			browser.sleep(1000);
			
			// Verify correct filtering
	     	expect(text).toEqual('Automon\nFirewax\nGorganic\nPigzart\nPrintspan\nSulfax');
	    });

		searchBar.clear();

		searchBar.sendKeys('g');
		browser.sleep(1000);

		var tree = element(by.tagName('px-tree'));

		tree.getText().then(function(text) {
			browser.sleep(1000);
			
			// Verify correct filtering
	     	expect(text).toEqual('Gorganic\nPigzart');
	    });

		searchBar.clear();

	    searchBar.sendKeys('A');
		browser.sleep(1000);

		tree.getText().then(function(text) {
			browser.sleep(1000);
			
			// Verify correct filtering
	     	expect(text).toEqual('Automon\nFirewax\nGorganic\nPigzart\nPrintspan\nSulfax');
	    });

	    searchBar.clear();

	    searchBar.sendKeys('auto');
		browser.sleep(1000);

		tree.getText().then(function(text) {
			browser.sleep(1000);
			
			// Verify correct filtering
	     	expect(text).toEqual('Automon');
	    });

		searchBar.clear();

	    searchBar.sendKeys('q');
		browser.sleep(1000);

		tree.getText().then(function(text) {
			browser.sleep(1000);
			
			// Verify correct filtering
	     	expect(text).toEqual('');
	    });
	});
});


describe('Left Side Bar Functionality:', function () {
	beforeEach(function() {
		browser.get('https://gemapapp.herokuapp.com/map');

		browser.waitForAngularEnabled();
		browser.sleep(1000);
	});

	it('should filter results active, inactive or all status when appropriate button is clicked', function(){
		//Find elements by id
		var activeButton = element(by.id('id1'));
		var inactiveButton = element(by.id('id2'));
		var allButton = element(by.id('id3'));

		//Find px-tree item
	    var tree = element(by.tagName('px-tree'));
	    
	    // Find the first (and only) button on the page and click it
	    browser.actions().mouseMove(activeButton, {x: 50, y: 10}).click().perform();
	    browser.sleep(3000);

		tree.getText().then(function(text) {
			browser.sleep(1000);
			// Verify that there are 8 active customers -- 68 characters in their names
	     	expect(text.length).toEqual(68);
	    });

	   	// Find the first (and only) button on the page and click it
 		browser.actions().mouseMove(inactiveButton, {x: 100, y: 10}).click().perform();
	    browser.sleep(3000);

		tree.getText().then(function(text) {
			browser.sleep(1000);
			// Verify that there are 3 inactive customers -- 23 characters in their names
	     	expect(text.length).toEqual(23);
	    });

	    // Find the first (and only) button on the page and click it
 		browser.actions().mouseMove(allButton, {x: 150, y: 10}).click().perform();
	    browser.sleep(3000);

		tree.getText().then(function(text) {
			browser.sleep(1000);
			// Verify that there are 11 inactive customers -- 92 characters in their names
	     	expect(text.length).toEqual(92);
	    });
	});

	it('should open orders when customer is clicked', function(){
		//Find px-tree item
	    var tree = element(by.tagName('px-tree'));
	    
	    tree.click();

	    browser.sleep(2000);
	    
	    tree.getText().then(function(text){	    	
			// Verify that there are 11 inactive customers -- 92 characters in their names
	     	expect(text).toEqual('Automon\nBoilicon\nFirewax\nGorganic\nMondicil\nPigzart'
	     						+'\nOrder #1\nOrder #2\nOrder #3\nOrder #4\nOrder #5\nOrder #6' 
	     						+'\nPrintspan\nSpeedbolt\nSulfax\nVerbus\nXsports');
	    });
  
	});

	it('should open shipments when order is clicked', function(){
		//Find px-tree item
	    var tree = element(by.tagName('px-tree'));

	    tree.click();

	   	browser.sleep(1000);
	    
	    tree.getText().then(function(text){	    	
			// Verify that there are 11 inactive customers -- 92 characters in their names
	     	expect(text.includes('\nPigzart\nOrder #1\nOrder #2\nOrder #3\nOrder #4\nOrder #5\nOrder #6')).toEqual(true);
	    });

	    tree.click();

	    browser.sleep(4000);

	   	tree.getText().then(function(text){	    	
			// Verify that there are 11 inactive customers -- 92 characters in their names
			console.log(text.includes('\nPigzart'+
	     						+'\nOrder #1\nOrder #2\nOrder #3' 
	     						+ '\nShipment #1\nShipment #2\nShipment #3\nShipment #4\nShipment #5\nShipment #6'
	     						+ '\nOrder #4\nOrder #5\nOrder #6'));
	     	// expect(text.includes('\nPigzart'+
	     	// 					+'\nOrder #1\nOrder #2\nOrder #3' 
	     	// 					+ '\nShipment #1\nShipment #2\nShipment #3\nShipment #4\nShipment #5\nShipment #6'
	     	// 					+ '\nOrder #4\nOrder #5\nOrder #6')).toEqual(true);

	     	expect(text).toEqual('Automon\nBoilicon\nFirewax\nGorganic\nMondicil\nPigzart'
	     						+'\nOrder #1\nOrder #2\nOrder #3' 
	     						+ '\nShipment #1\nShipment #2\nShipment #3\nShipment #4\nShipment #5\nShipment #6'
	     						+ '\nOrder #4\nOrder #5\nOrder #6'
	     						+ '\nPrintspan\nSpeedbolt\nSulfax\nVerbus\nXsports');
	    });

	    browser.sleep(1000); 
	});

	it('should only allow one order open at a time', function(){
		//Find px-tree item
	    var tree = element(by.tagName('px-tree'));
	    
	    browser.actions().mouseMove(tree, {x: 0, y: 200}).click().perform();
	    browser.sleep(1000);

	    tree.getText().then(function(text){	    	
			// Verify that there are 11 inactive customers -- 92 characters in their names
	     	expect(text).toEqual('Automon\nBoilicon\nFirewax\nGorganic\nMondicil\nPigzart'
	     						+ '\nPrintspan\nSpeedbolt\nOrder #1\nSulfax\nVerbus\nXsports');
	    })

	   	browser.actions().mouseMove(tree, {x: 0, y: 150}).click().perform();
	    browser.sleep(1000);

	    tree.getText().then(function(text){	    	
			// Verify that there are 11 inactive customers -- 92 characters in their names
	     	expect(text).toEqual('Automon\nBoilicon\nFirewax\nGorganic\nMondicil\nPigzart'
	     						+'\nOrder #1\nOrder #2\nOrder #3\nOrder #4\nOrder #5\nOrder #6'
	     						+ '\nPrintspan\nSpeedbolt\nSulfax\nVerbus\nXsports');
	    });

	    browser.actions().mouseMove(tree, {x: 0, y: 90}).click().perform();
	    browser.sleep(1000);

	    tree.getText().then(function(text){	    	
			// Verify that there are 11 inactive customers -- 92 characters in their names
	     	expect(text).toEqual('Automon\nBoilicon\nFirewax\nGorganic\nOrder #1\nMondicil\nPigzart'
	     						+ '\nPrintspan\nSpeedbolt\nSulfax\nVerbus\nXsports');
	    })

	    browser.actions().mouseMove(tree, {x: 0, y: 20}).click().perform();
	    browser.sleep(1000);

	   	tree.getText().then(function(text){	    	
			// Verify that there are 11 inactive customers -- 92 characters in their names
	     	expect(text).toEqual('Automon\nOrder #1\nOrder #2\nOrder #3\nOrder #4'
	     						+'\nBoilicon\nFirewax\nGorganic\nMondicil\nPigzart'
	     						+ '\nPrintspan\nSpeedbolt\nSulfax\nVerbus\nXsports');
	    })
  
	});
});

describe('Map Functionality:', function () {
	beforeEach(function() {
		browser.get('https://gemapapp.herokuapp.com/map');

		browser.waitForAngularEnabled();
		browser.sleep(1000);
	});

	it('should display the correct number of map markers based on the number of markers', function () {
		var tree = element(by.tagName('px-tree'));
		tree.click();
	    browser.sleep(3000);

	    tree.click();
	    browser.sleep(3000);

	    tree.getText().then(function(text){
 	  		var count = (text.match(/Shipment/g) || []).length;
 	    	var numMarkers = element.all(by.css('.gmnoprint')).count();
			expect(numMarkers).toEqual(7 + (3*count));
 	    });

 	    browser.actions().mouseMove(tree, {x: 0, y: 20}).click().perform();
 	    browser.sleep(3000);

 	    //When a new customer is clicked all map markers should disappear
 	    var numMarkers = element.all(by.css('.gmnoprint')).count();
 	    expect(numMarkers).toEqual(7);

 	    browser.actions().mouseMove(tree, {x: 50, y: 40}).click().perform();
 	    browser.sleep(3000);

 	    tree.getText().then(function(text){
 	  		var count = (text.match(/Shipment/g) || []).length;
 	    	var numMarkers = element.all(by.css('.gmnoprint')).count();
			expect(numMarkers).toEqual(7 + (3*count));
 	    });

		browser.sleep(5000);
	});

	it('should open right sidebar when map marker is clicked', function () {
		var tree = element(by.tagName('px-tree'));
		tree.click();
	    browser.sleep(3000);

	    tree.click();
	    browser.sleep(3000);

		var mapMarker = element(by.css('.gmnoprint'));
		mapMarker.click();

		browser.sleep(1000);

		var infoButton = element(by.id('markerInfo'));
		infoButton.click();

		browser.sleep(5000);

		var browserWidth = 1000;
		var sidebarPixels = 0.166666667 * browserWidth;
		var mapStepsPixels = 0.21333 * browserWidth;

		var rightSidebar = element(by.id('hide'));
		// expect(rightSidebar.getCssValue('width')).toBe(sidebarPixels + 'px');
		// expect(element(by.id('MAP_MARKERS')).getCssValue('left')).toEqual(mapStepsPixels + 'px');
		// expect(element(by.id('STEPS')).getCssValue('left')).toEqual(mapStepsPixels + 'px');

		expect(rightSidebar.isPresent()).toEqual(true);

		infoButton.click();
		browser.sleep(2000);		

		expect(rightSidebar.isPresent()).toEqual(false);
		
		// expect(rightSidebar.getCssValue('width')).toEqual('0px');
		// expect(element(by.id('MAP_MARKERS')).getCssValue('right')).toEqual('0px');
		// expect(element(by.id('STEPS')).getCssValue('right')).toEqual('0px');
	});

	// it('pin colors should be colored according to delivery state', function () {
	// 	expect(true).toEqual(true);
	// });

	// it('arrays should have correct marker information', function () {
	// 	expect(true).toEqual(true);
	// });

	// it('should clear all markers on the map', function () {
	// 	expect(true).toEqual(true);
	// });

	// it('should draw lines on the map', function () {
	// 	expect(true).toEqual(true);
	// });

	// it('should close all info window', function () {
	// 	expect(true).toEqual(true);
	// });
});

// describe('Comments Functionality', function () {
// 	it('should add comment to submit once submitted', function () {
// 		// Find the element with ng-model="user" and type "jacksparrow" into it
// 		//element(by.model('vm.searchText')).sendKeys('New comment');


// 		expect(true).toEqual(true);
// 	});
// });

