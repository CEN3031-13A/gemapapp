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
    console.log(vm.customers)
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
    setInterval(consistantTimer, 50);
map = undefined
  function consistantTimer() {
  
  if (customerList.length === 0) {
    pxTree();
  }
  if (map === undefined) {
    var GEHeadquarters = { lat: 42.3522898, lng: -71.0495636 };
    try {
      console.log("map")
      map = new google.maps.Map(document.getElementById('MAP_MARKERS'), {
        zoom: 2,
        center: GEHeadquarters,
        mapTypeId: 'hybrid'
      });
    }
    catch (ReferenceError) {
      if (displayedGMapsErrorMsg === false) {
        console.log("Google Maps APIs have not been loaded yet.");
        displayedGMapsErrorMsg = true;
      }
    }
  }
}
    
  }
}());
