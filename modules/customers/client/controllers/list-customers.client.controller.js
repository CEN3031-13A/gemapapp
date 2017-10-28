(function () {
  'use strict';

  angular
    .module('customers')
    .controller('CustomersListController', CustomersListController);

  CustomersListController.$inject = ['CustomersService'];

  function CustomersListController(CustomersService) {
    var vm = this;
    var tempCustomers = CustomersService.query();
    
    //console.log(tempCustomers);
    vm.customers = tempCustomers;
    // var check = JSON.parse(tempCustomers)
    //vm.orders = tempCustomers[0].orders;
    console.log(tempCustomers);

    // console.log(check);
    //console.log(vm.orders);
  }
}());
