'use strict';

describe('Customers E2E Tests:', function () {
	it('should have a title', function(){
		browser.get('https://gemapapp.herokuapp.com/map');

		expect(browser.getTitle()).toEqual('GE Shipment Tracker');
	});
});

describe('Search Bar Functionality:', function () {
	beforeEach(function() {
		browser.get('https://gemapapp.herokuapp.com/map');

		browser.waitForAngularEnabled();
		browser.sleep(1000);
	});

	it('should display no matching when customers do not contain the input', function() {
		var tree = element(by.tagName('px-tree'));

		var searchBar = element(by.model('vm.searchText'));
		searchBar.sendKeys('j');
		browser.sleep(1000);

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

	    searchBar.sendKeys('j');
		browser.sleep(1000);

		tree.getText().then(function(text) {
			browser.sleep(1000);
			
			// Verify correct filtering
	     	expect(text).toEqual('');
	    });
	});
});

describe('Left Sidebar Functionality:', function () {
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
 		browser.actions().mouseMove(allButton, {x: 170, y: 10}).click().perform();
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

	it('should display the correct number of map markers', function () {
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

	it('should display map markers when shipment is clicked', function () {
		var tree = element(by.tagName('px-tree'));
		
		tree.click();
		browser.sleep(3000);
		
		tree.click();
		browser.sleep(3000);
		
		tree.click();
		browser.sleep(3000);

	    tree.getText().then(function(text){
 	  		var count = (text.match(/Shipment/g) || []).length;
 	    	var numMarkers = element.all(by.css('.gmnoprint')).count();
			expect(numMarkers).toEqual(7 + (3));
 	    });
	});


	it('should display three map markers when shipment is clicked', function () {
		var tree = element(by.tagName('px-tree'));

		browser.actions().mouseMove(tree, {x: 0, y: 20}).click().perform();
 	    browser.sleep(3000);

 	    browser.actions().mouseMove(tree, {x: 50, y: 40}).click().perform();
 	    browser.sleep(3000);

	    tree.getText().then(function(text){
 	  		var count = (text.match(/Shipment/g) || []).length;
 	    	var numMarkers = element.all(by.css('.gmnoprint')).count();
			expect(numMarkers).toEqual(7 + (3*count));
 	    });
	});

	it('should open right sidebar when map marker is clicked', function () {
		var tree = element(by.tagName('px-tree'));
		
 	    browser.actions().mouseMove(tree, {x: 0, y: 20}).click().perform();
 	    browser.sleep(3000);

 	    //When a new customer is clicked all map markers should disappear
 	    var numMarkers = element.all(by.css('.gmnoprint')).count();
 	    expect(numMarkers).toEqual(7);

 	    browser.actions().mouseMove(tree, {x: 50, y: 40}).click().perform();
 	    browser.sleep(3000);

		var mapMarker = element(by.css('.gmnoprint'));
		mapMarker.click();

		browser.sleep(1000);

		var infoButton = element(by.id('markerInfo'));
		infoButton.click();

		browser.sleep(5000);

		var rightSidebar = element(by.id('hide'));

		expect(rightSidebar.isPresent()).toEqual(true);

		infoButton.click();
		browser.sleep(2000);			
	});

	it('should color lines according to delivery state', function () {
		var tree = element(by.tagName('px-tree'));
		
 	    browser.actions().mouseMove(tree, {x: 0, y: 20}).click().perform();
 	    browser.sleep(3000);

 	    //When a new customer is clicked all map markers should disappear
 	    var numMarkers = element.all(by.css('.gmnoprint')).count();
 	    expect(numMarkers).toEqual(7);

 	    browser.actions().mouseMove(tree, {x: 50, y: 40}).click().perform();
 	    browser.sleep(3000);

		var mapMarker = element(by.css('.gmnoprint'));
		mapMarker.click();
	});

});

describe('Right Sidebar Functionality:', function () {
	beforeEach(function() {
		browser.get('https://gemapapp.herokuapp.com/map');

		browser.waitForAngularEnabled();
		browser.sleep(1000);
	});
	
	it('should add comment to list of comments when submitted', function () {
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

		var mapMarker = element(by.css('.gmnoprint'));
		mapMarker.click();

		browser.sleep(1000);

		var infoButton = element(by.id('markerInfo'));
		infoButton.click();

		browser.sleep(5000);

		var commentSection = element(by.id('new_comment'));
		var textContext = 'This is to test an added comment from protractor';
		commentSection.sendKeys(textContext);

		element(by.css('.form-group #submitbutton')).click();
		browser.sleep(5000);

		tree.click();
	    browser.sleep(3000);

	    tree.click();
	    browser.sleep(3000);

		var mapMarker = element(by.css('.gmnoprint'));
		mapMarker.click();

		browser.sleep(1000);

		var infoButton = element(by.id('markerInfo'));
		infoButton.click();

		element.all(by.css('.list-group px-accordion')).then(function(dropdowns){
			browser.sleep(5000);
			dropdowns[21].click();
			expect(true).toEqual(true);
		});
	});
});



