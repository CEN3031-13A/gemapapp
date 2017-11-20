(function () {
  'use strict';

  angular
    .module('customers')
    .controller('CustomersListController', CustomersListController);

  CustomersListController.$inject = ['CustomersService'];

  function CustomersListController(CustomersService) {
    var vm = this;
    vm.customers = CustomersService.query();


    vm.addComment = function(customers){
    	console.log(customers);
    }

  }
}());
