// Customers service used to communicate Customers REST endpoints
(function () {
  'use strict';

  angular
    .module('customers')
    .factory('CustomersService', CustomersService);

  CustomersService.$inject = ['$resource'];

  function CustomersService($resource) {
    return $resource('api/customers/', {
      update: {
        method: 'PUT'
      }
    });
  }
}());
