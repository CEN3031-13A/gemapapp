(function () {
  'use strict';

  angular
    .module('customers')
    .controller('CustomersController', CustomersController);

  CustomersController.$inject = ['$scope', 'customerResolve', 'Authentication'];

  function CustomersController($scope, customer, Authentication) {
    var vm = this;

    vm.customer = customer;
    vm.authentication = Authentication;

  }
}());
