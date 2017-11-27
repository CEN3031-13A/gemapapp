(function () {
  'use strict';

  // Customers controller
  angular
    .module('customers')
    .controller('CustomersController', CustomersController);

  CustomersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'customerResolve', '$location'];

  function CustomersController($scope, $state, $window, Authentication, customer, $location) {
    var vm = this;
    vm.authentication = Authentication;
    vm.customer = customer;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    setTimeout(save, 1);

    // Remove existing Customer
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.customer.$remove($state.go('customers.list'));
      }
    }

    // Save Customer
    function save() {
      // let customer.orders[$location.currentIndices.order].shipments[$location.currentIndices.shipment];
      vm.customer.orders[$location.currentIndices.order].shipments[$location.currentIndices.shipment].comments.push($location.newComment)


      console.log(vm.customer)
      // TODO: move create/update logic to service
      if (vm.customer._id) {

        vm.customer.$update(successCallback, errorCallback);
      } else {
        vm.customer.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $location.path('/')
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
