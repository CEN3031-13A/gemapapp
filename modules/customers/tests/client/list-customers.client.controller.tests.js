(function () {
    'use strict';
    describe('Customers List Controller Tests', function () {
	// Initialize global variables
	var CustomersListController,
	    $scope,
	    element,
	    template,
	    CustomersService,
	    mockCustomer;

	
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
	    //Render a dummy element so getElementById wont return null
	    var template = $templateCache.get('modules/customers/client/views/list-customers.client.view.html');
	    document.body.insertAdjacentHTML('beforeend', template);
	    //document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement);
	    console.log(document.getElementById('MAP_MARKERS'));
	    // Set a new global scope
	    $scope = $rootScope.$new();
	    //Instantiate the service
	    CustomersService = _CustomersService_;
	    // create mock customer
	    mockCustomer = new CustomersService({
		"_id": "5a09f3c07d169896e6df8c8b",
		"index": 0,
		"isActive": true,
		"logo": "http://placehold.it/32x32",
		"age": 38,
		"name": "Pigzart",
		"email": "jannacooley@pigzart.com",
		"phone": "+1 (975) 588-3059",
		"address": "491 Wilson Street, Florence, Palau, 8010",
		"about": "Officia eu ex sit ipsum ad velit aliquip.\r\n",
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
			}]
		    }]
		}]
	    });
				
	    // Initialize the Customers List controller.
	    CustomersListController = $controller('CustomersListController as vm', {
	    	$scope: $scope
	    });
	    
	    CustomersListController.customers = mockCustomer;

	    // Spy on state go
	    spyOn($state, 'go');
	}));
	describe('Testing', function () {
	    it('should return true', inject(function (CustomersService) {
		CustomersListController.displayActive();
		expect(CustomersListController.customers.isActive).toEqual(true);
	    }));
	});
    });
}());
