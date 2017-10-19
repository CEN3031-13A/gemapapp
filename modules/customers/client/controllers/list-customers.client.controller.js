(function () {
  'use strict';

  angular
    .module('customers')
    .controller('CustomersListController', ArticlesListController);

  ArticlesListController.$inject = ['CustomersService'];

  function CustomersListController(CustomersService) {
    var vm = this;

    vm.customers = CustomersService.query();
  }
}());
