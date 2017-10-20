(function () {
  'use strict';

  angular
    .module('customers.admin')
    .controller('CustomersAdminListController', CustomersAdminListController);

  CustomersAdminListController.$inject = ['CustomersService'];

  function CustomersAdminListController(CustomersService) {
    var vm = this;

    vm.customers = CustomersService.query();
  }
}());
