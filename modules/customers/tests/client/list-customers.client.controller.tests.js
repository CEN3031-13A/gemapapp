(function () {
    'use strict';
    describe('Customers List Controller Tests', function () {
	// Initialize global variables
	var CustomersListController,
	    $scope,
	    element,
	    template,
	    CustomersService,
	    mockCustomers;
	var customerList = [];
	var originMarkersArray  = [];
	var currentMarkersArray = [];
	var destinationMarkersArray = [];

	var originInfoWindowList    = [];
	var currentInfoWindowList     = [];
	var destinationInfoWindowList = [];

	var inAnimation = false;
	var currentInfoWindow;

	var flightPathList = [];

	var displayedGMapsErrorMsg = false;

	var generalLocationOrigin = [];      
	var generalLocationCurrent = [];     
	var generalLocationDestination = [];

	var inVal = 0;
	var outVal = 0;
	
	// The $resource service augments the response object with methods for updating and deleting the resource.
	// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
	// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
	// When the toEqualData matcher compares two objects, it takes only object properties into
	// account and ignores methods.
	beforeEach(function () {
	    jasmine.addMatchers({
		toEqualData: function (util, customEqualityTesters) {
		    return {
			compare: function (actual, expected) {
			    return {
				pass: angular.equals(actual, expected)
			    };
			}
		    };
		}
	    });
	});

	// Then we can start by loading the main application module
	beforeEach(module(ApplicationConfiguration.applicationModuleName));
	beforeEach(module('templates'));

	// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
	// This allows us to inject a service but then attach it to a variable
	// with the same name as the service.
	beforeEach(inject(function ($controller, $state, $compile, $rootScope, _CustomersService_, $templateCache) {
	    //Import our html into testing environment
	    var template = $templateCache.get('modules/customers/client/views/list-customers.client.view.html');
	    document.body.insertAdjacentHTML('beforeend', template);
	    // Set a new global scope
	    $scope = $rootScope.$new();
	    //Instantiate the service
	    CustomersService = _CustomersService_;
	    // create mock customer
	    mockCustomers = [{
	    	"_id": "5a09f3c07d169896e6df8c8b",
	    	"index": 0,
	    	"isActive": true,
	    	"logo": "http://placehold.it/32x32",
	    	"age": 38,
	    	"name": "Pigzart",
	    	"email": "jannacooley@pigzart.com",
	    	"phone": "+1 (975) 588-3059",
	    	"address": "491 Wilson Street, Florence, Palau, 8010",
	    	"about": "Officia eu ex sit ipsum ad velit aliquip.",
	    	"registered": "2014-07-03T03:20:14 +04:00",
	    	"orders": [{
	    	    "id": "5a09f3c0d8978c0b9e531dca",
	    	    "index": 0,
	    	    "shipments": [{
	    		"id": "5a09f3c0c02b72d0d33d5ef1",
	    		"tracking_number": "5a09f3c0786d0923a695d572",
	    		"carrier": "UPS",
	    		"delivery_state": "Late",
	    		"late_penalties": "laborum laboris qui dolor.",
	    		"comments": [{
	    		    "comment_date": "2016-01-20T07:06:07 +05:00",
	    		    "comment": "sint proident id minim laborum do ex."
	    		}],
			"origin": {
			    "latitude": 32.144117,
			    "longitude": 84.913914
			},
			"destination": {
			    "latitude": 71.190901,
			    "longitude": 84.982768
			},
			"current_location": {
			    "latitude": 47.333186,
			    "longitude": 106.611654
			},
			"ship_date": "Wed Dec 12 2012 12:21:19 GMT-0500 (Eastern Standard Time)",
			"expected_date": "Fri Oct 26 1979 17:52:35 GMT-0400 (Eastern Daylight Time)",
			"contents": [
			    "occaecat",
			    "sint",
			    "laboris",
			    "labore",
			    "officia"
			]
	    	    }]
	    	}]
	    }];
	    
	    // Initialize the Customers List controller.
	    CustomersListController = $controller('CustomersListController as vm', {
	    	$scope: $scope
	    });
	    
	    CustomersListController.customers = mockCustomers;
	    // Spy on state go
	    spyOn($state, 'go');
	}));
	describe('Testing', function () {
	    function removeLine() {
		for (let i = 0; i < flightPathList.length; i++)
		    flightPathList[i].setMap(null);
	    }
	    function clearMarkers() {
		setMapOnAll(null);
	    }
	    function setMapOnAll(map) {
		for (let i = 0; i < originMarkersArray.length; i++) {
		    originMarkersArray[i].setMap(map);
		}
		for (let i = 0; i < currentMarkersArray.length; i++) {
		    currentMarkersArray[i].setMap(map);
		}
		for (var i = 0; i < destinationMarkersArray.length; i++) {
		    destinationMarkersArray[i].setMap(map);
		}
	    }
	    function rightSideBarOut(){
		outVal += 0.035;
		let val = (21.333)*Math.sin(outVal + Math.PI/2.0)+(62);
		let val1= 83.3333333333 - val;
		document.getElementById('MAP_MARKERS').style.width = val+"%";
		document.getElementById('STEPS').style.width = val+"%";
		document.getElementById('hide').style.width = val1+"%";
		if(val <= 61.4){
		    outVal =0;
		    document.getElementById('MAP_MARKERS').style.width = "62%";
		    document.getElementById('overlay').style.width = "62%";
		    document.getElementById('STEPS').style.width = "62%";
		    document.getElementById('hide').style.width = "21.333%";
		}
	    }
	    function rightSideBarIn(){
		inVal += 0.035;
		let val = (21.333)*Math.sin(inVal )+(62);
		let val1 = 83.3333333333 - val;
		document.getElementById('MAP_MARKERS').style.width = val+"%";
		document.getElementById('STEPS').style.width = val+"%";
		document.getElementById('hide').style.width = val1+"%";
		if(val >= 83.1){
		    inVal =0;
		    document.getElementById('MAP_MARKERS').style.width = "83.3333333333%";
		    document.getElementById('overlay').style.width = "83.3333333333%";
		    document.getElementById('STEPS').style.width = "83.3333333333%";
		    document.getElementById('hide').style.width = "0%";
		}
	    }
	    it('should construct the predix tree', inject(function (CustomersService) {
		var customers = CustomersListController.customers;
		//Sort customer list alphabetically
		customers.sort(function (a, b) {
		    if (a.name.toUpperCase() < b.name.toUpperCase())
			return -1;
		    if (a.name.toUpperCase() > b.name.toUpperCase())
			return 1;
		    return 0;
		});

		var treeElement = document.getElementById("TEST11");
		
		//Rewrite string to inject into Predix px-tree component
		let string = "[";
		for (let i = 0; i < customers.length; i++) {
		    customerList.push(customers[i]);
		    string += "{\"label\":\"";
		    string += customers[i].name;
		    string += "\",";
		    string += "\"id\":\"";
		    string += customers[i]._id;
		    string += "\",\"isSelectable\": true,\"children\":[";
		    var strcheck0 = string;
		    
		    for (let j = 0; j < customers[i].orders.length; j++) {
			string += "{\"label\":\"Order #";
			string += customers[i].orders[j].index + 1;
			string += "\",";
			string += "\"id\":\"";
			string += customers[i].orders[j].id;
			string += "\",\"isSelectable\": true,\"children\":[";
			var strcheck1 = string;
			
			for (let k = 0; k < customers[i].orders[j].shipments.length; k++) {
			    string += "{\"label\":\"";
			    string += "Shipment #" + (k + 1);
			    string += "\",\"id\":\"";
			    string += customers[i].orders[j].shipments[k].id;
			    string += "\"},";
			}
			if (strcheck1 !== string)
			    string = string.substring(0, string.length - 1);
			string += "]},";
		    }
		    if (strcheck0 !== string)
			string = string.substring(0, string.length - 1);
		    string += "]},";
		}
		string = string.substring(0, string.length - 1);
		string += "]";
		
		//Inject Predix component with concatenated string
		treeElement.attributes.items.value = string;
		expect(string).toEqual(document.getElementById('TEST11').attributes.items.value);
	    }));

	    it('should inject customer info', inject(function(CustomersService){
		let currentCustomer = CustomersListController.customers[0];
		let customerInfoElement = document.getElementById("CUSTOMER_INFO").children;
		customerInfoElement[1].innerText  = currentCustomer.name;
		customerInfoElement[4].innerText  = currentCustomer.age;
		customerInfoElement[7].innerText  = currentCustomer.email;
		customerInfoElement[10].innerText  = currentCustomer.phone;
		customerInfoElement[13].innerText = currentCustomer.address;
		customerInfoElement[16].innerText = currentCustomer.registered;
		customerInfoElement[19].innerText = currentCustomer.about;
		expect(document.getElementById("CUSTOMER_INFO").children[1].innerText).toEqual('Pigzart');
		expect(document.getElementById("CUSTOMER_INFO").children[4].innerText).toEqual('38');
		expect(document.getElementById("CUSTOMER_INFO").children[19].innerText).toEqual('Officia eu ex sit ipsum ad velit aliquip.');
	    }));

	    it('should inject shipping details', inject(function(CustomersService){
		let currentCustomer = CustomersListController.customers[0];
		let currentOrder    = currentCustomer.orders[0];
		let currentShipment = currentOrder.shipments[0];
		if (currentShipment !== undefined) {
		    let shipmentInfoElement = document.getElementById("SHIPPING_DETAILS").children;
		    shipmentInfoElement[1].innerText  =  currentShipment.tracking_number;
		    shipmentInfoElement[4].innerText  =  currentShipment.carrier;
		    shipmentInfoElement[7].innerText  =  currentShipment.delivery_state;
		    shipmentInfoElement[10].innerText  =  currentShipment.late_penalties;
		    shipmentInfoElement[15].innerText  =  currentShipment.current_location.latitude;
		    shipmentInfoElement[18].innerText = currentShipment.current_location.longitude;
		    shipmentInfoElement[23].innerText = currentShipment.destination.latitude;
		    shipmentInfoElement[26].innerText = currentShipment.destination.longitude;
		    shipmentInfoElement[29].innerText = currentShipment.ship_date;
		    shipmentInfoElement[32].innerText = currentShipment.expected_date;
		    shipmentInfoElement[35].innerText = currentShipment.delivery_state;
		}
		expect(document.getElementById("SHIPPING_DETAILS").children[1].innerText).toEqual('5a09f3c0786d0923a695d572');
		expect(document.getElementById("SHIPPING_DETAILS").children[4].innerText).toEqual('UPS');
		expect(document.getElementById("SHIPPING_DETAILS").children[7].innerText).toEqual('Late');
		expect(document.getElementById("SHIPPING_DETAILS").children[23].innerText).toEqual('71.190901');
		expect(document.getElementById("SHIPPING_DETAILS").children[32].innerText).toEqual('Fri Oct 26 1979 17:52:35 GMT-0400 (Eastern Daylight Time)');
	    }));

	    it('should inject package details', inject(function(CustomersService){
		let currentCustomer = CustomersListController.customers[0];
		let currentOrder    = currentCustomer.orders[0];
		let currentShipment = currentOrder.shipments[0];
		if (currentShipment !== undefined) {
		    let packageInfoElement = document.getElementById("PACKAGE_DETAILS").children;
		    packageInfoElement[1].innerText = currentShipment.ship_date;
		    let contents = "";
		    for(let i = 0; i < currentShipment.contents.length; i++){
			contents += currentShipment.contents[i];
			contents += ", ";
		    }
		    packageInfoElement[4].innerText = contents.substring(0,contents.length-2);
		}
		expect(document.getElementById("PACKAGE_DETAILS").children[1].innerText).toEqual('Wed Dec 12 2012 12:21:19 GMT-0500 (Eastern Standard Time)');
		expect(document.getElementById("PACKAGE_DETAILS").children[4].innerText).toEqual('occaecat, sint, laboris, labore, officia');
	    }));
	    
	    it('should inject relative shipment location', inject(function(CustomersService){
		var infoNeeded = true;
		//Set variables for the current customer and order selected
		let currentCustomer = CustomersListController.customers[0];
		let currentOrder    = currentCustomer.orders[0];
		let currentShipment;

		//InfoNeeded indicates that a shipment has been selected and info needs to be displayed
		//Therefore the currentShipment is defined
		if(infoNeeded == true)
		    currentShipment = currentOrder.shipments[0];

		var string = "<px-steps ";
		string += "items=\'[";
		string += "{\"id\":\"1\", \"label\":\"(ORIGIN) ";

		//If a shipment is selected display needed information in the component
		if(infoNeeded == true){
		    //If location is undefined display the longitude and latitude
		    if(generalLocationOrigin[0] == "")
			string += currentShipment.origin.latitude + ", " + currentShipment.origin.longitude;
		    //Display location
		    else
			string += generalLocationOrigin[0];
		}

		string += "\"},";
		string += "{\"id\":\"2\", \"label\":\"(CURRENT) ";

		//If a shipment is selected display needed information in the component
		if(infoNeeded == true){
		    //If location is undefined display the longitude and latitude
		    if(generalLocationCurrent[0] == "")
			string += currentShipment.current_location.latitude + ", " + currentShipment.current_location.longitude;
		    //Display location
		    else
			string += generalLocationCurrent[0];
		} 

		string += "\"},";
		string += "{\"id\":\"3\", \"label\":\"(TO) ";

		//If a shipment is selected display needed information in the component
		if(infoNeeded == true){
		    //If location is undefined display the longitude and latitude
		    if(generalLocationDestination[0] == "")
			string += currentShipment.destination.latitude + ", " + currentShipment.destination.longitude;
		    //Display location
		    else
			string += generalLocationDestination[0];
		}

		string += "\"}]\' completed=\'[\"1\",\"2\"";

		//If the current location is at the destination then mark the desination location
		if(infoNeeded){
		    if(currentShipment.current_location.latitude == currentShipment.destination.latitude){
			if(currentShipment.current_location.longitude == currentShipment.destination.longitude){
			    string += ",\"3\"";
			}
		    }
		}

		string += "]\'+</px-steps>";


		document.getElementById("STEPS").innerHTML = string;
		var compare = '<px-steps items="[{&quot;id&quot;:&quot;1&quot;, &quot;label&quot;:&quot;(ORIGIN) undefined&quot;},{&quot;id&quot;:&quot;2&quot;, &quot;label&quot;:&quot;(CURRENT) undefined&quot;},{&quot;id&quot;:&quot;3&quot;, &quot;label&quot;:&quot;(TO) undefined&quot;}]" completed="[&quot;1&quot;,&quot;2&quot;]" +<="" px-steps=""></px-steps>'
		expect(document.getElementById('STEPS').innerHTML).toEqual(compare);
	    }));

	    it('should toggle right sidebar', inject(function(CustomersService){
		expect(document.getElementById('hide').style.width).toEqual('0px');
		rightSideBarOut();
		expect(document.getElementById('hide').style.width).not.toEqual('0px');
		while(document.getElementById('hide').style.width !== '0%'){
		    rightSideBarIn();
		}
		expect(document.getElementById('hide').style.width).toEqual('0%');
	    }));
	});
    });
}());
