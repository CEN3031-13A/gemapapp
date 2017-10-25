(function () {
  'use strict';

  angular
    .module('customers.admin')
    .controller('CustomersAdminController', CustomersAdminController);

  CustomersAdminController.$inject = ['$scope', '$state', '$window', 'customerResolve', 'Authentication', 'Notification'];

  function CustomersAdminController($scope, $state, $window, customer, Authentication, Notification) {
    var vm = this;

    vm.customer = customer;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Customer
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.customer.$remove(function () {
          $state.go('admin.customers.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Customer deleted successfully!' });
        });
      }
    }

    // Save Customer
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.customerForm');
        return false;
      }

      // Create a new customer, or update the current instance
      vm.customer.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.customers.list'); // should we send the User to the list or the updated Customer's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Customer saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Customer save error!' });
      }
    }
  }
}());
