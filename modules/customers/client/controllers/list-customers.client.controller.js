(function () {
  'use strict';

  angular
    .module('customers')
    .controller('CustomersListController', CustomersListController);

  CustomersListController.$inject = ['CustomersService', '$scope'];

  function CustomersListController(CustomersService, $scope) {
    var vm = this;
    vm.customers = CustomersService.query();
    $scope.customers = vm.customers;
  }
}());
