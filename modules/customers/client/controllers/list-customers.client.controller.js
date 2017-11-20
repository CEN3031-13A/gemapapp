(function () {
  'use strict';

  angular
    .module('customers')
    .controller('CustomersListController', CustomersListController);

  CustomersListController.$inject = ['CustomersService'];

  function CustomersListController(CustomersService) {
    var vm = this;
    vm.customers = CustomersService.query();
    vm.currentlySelected = function(){
    	console.log(document.querySelector('px-tree'));
    }
    
  }
}());
