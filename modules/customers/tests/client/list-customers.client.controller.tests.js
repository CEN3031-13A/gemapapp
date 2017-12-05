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

	// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
	// This allows us to inject a service but then attach it to a variable
	// with the same name as the service.
	beforeEach(inject(function ($controller, $state, $compile, $rootScope, _CustomersService_, $templateCache) {
	    var dummyElement = document.createElement('div');
	    document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement);
	    // Set a new global scope
	    $scope = $rootScope.$new();
	    // Point global variables to injected services
	    CustomersService = _CustomersService_;
	    // create mock article
	    mockCustomer = new CustomersService({
		_id: '525a8422f6d0f87f0e407a33',
		'label': "Test",
		'isSelectable': true,
		'children': [{
		    'id': '2',
		    'label': 'TestOrder',
		    'isSelectable': true,
		    'children': [{
			'id': '3',
			'label': 'TestShipment',
			'isSelectable': true
		    }]
		}]
	    });
	    
	    // Initialize the Customers List controller.
	    CustomersListController = $controller('CustomersListController as vm', {
	    	$scope: $scope
	    });
	    
	    // CustomersListController.vm.customers = mockCustomer;

	    // Spy on state go
	    spyOn($state, 'go');
	}));
	describe('Testing', function () {
	    it('should return true', inject(function (CustomersService) {
		expect(2 + 2).toEqual(4);
	    }));
	});
    });
}());
