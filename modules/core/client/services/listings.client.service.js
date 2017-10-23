(function () {
  'use strict';

  angular
    .module('core')
    .factory('ListingsService', ListingsService);

  ListingsService.$inject = ['$resource', '$log'];

  function ListingsService($resource, $log) {
    var Customer = $resource('/:listingId', {
      listingId: '@_id'
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
