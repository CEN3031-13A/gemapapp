(function () {
  'use strict';

  angular
    .module('customers.services')
    .factory('CustomersService', CustomersService);

  CustomersService.$inject = ['$resource', '$log'];

  function CustomersService($resource, $log) {
    var Customer = $resource('/api/customers/:customerId', {
      customerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Customer.prototype, {
      createOrUpdate: function () {
        var customer = this;
        return createOrUpdate(customer);
      }
    });

    return Customer;

    function createOrUpdate(customer) {
      if (customer._id) {
        return customer.$update(onSuccess, onError);
      } else {
        return customer.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(customer) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
