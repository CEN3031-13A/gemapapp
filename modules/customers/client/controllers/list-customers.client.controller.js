(function () {
  'use strict';

  angular
    .module('customers')
    .controller('CustomersListController', CustomersListController);

  CustomersListController.$inject = ['CustomersService'];

  function CustomersListController(CustomersService) {
    var vm = this;
    vm.currentIndices = {'customer':null, 'order':null, 'shipment':null};
    vm.customers = CustomersService.query();
    vm.currentlySelected = function(){
    	  var customers = vm.customers;
        var px_tree = document.querySelector('px-tree');
        // var selectedData =px_tree.selectedMeta;
        var selectedShipment = px_tree.selected;
        var selectedPath = px_tree.selectedRoute;
        if (selectedPath <= 1)
          return;
      
        var shipmentID = selectedShipment.id;
      
        var customerID = selectedPath[0];
      
        var orderID = selectedPath[1];
        if (selectedPath.length === 2) {
          shipmentID = -1;
        }
      
        var found = false;
        var i;
        var j;
        var k;
        for (let i = 0; i < customers.length; i++) {
          if (customerID === customers[i]._id) {
            customer = customers[i];
            for (let j = 0; j < customers[i].orders.length; j++) {
              if (orderID === customers[i].orders[j].id) {
                order = customers[i].orders[j];
                for (k = 0; k < customers[i].orders[j].shipments.length; k++) {
                  if (shipmentID === customers[i].orders[j].shipments[k].id) {
                    found = true;
                    shipment = customers[i].orders[j].shipments[k];
                    vm.currentIndices.customer = i;
                    vm.currentIndices.order = j;
                    vm.currentIndices.shipment = k;
                    break;
                  }
                }
              }
            }
          }
        }
      
        if (!found)
          console.log("Not found fam")
        else {
          console.log(vm.currentIndices);

        }
    }
    vm.submitComment = function(input){
      // document.getElementById("NEW_COMMENT").value;
      // console.log(vm.customers[vm.currentIndices.customer].orders[vm.currentIndices.order].shipments[vm.currentIndices.shipment].comments);
      //     // Update existing Article

      // console.log(CustomersService)
      // var customers = vm.customers;
      // CustomersService.save();
      // customers.$update(function () {
      //   $location.path('customers/update');
      // }, function (errorResponse) {
      //   $scope.error = errorResponse.data.message;
      // });
    }
    
  }
}());
