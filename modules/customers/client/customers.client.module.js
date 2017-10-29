(function (app) {
  'use strict';

  app.registerModule('customers');
}(ApplicationConfiguration));

function myFunction() {
  var x = document.getElementById('hide');
  if (x.style.display === 'none') {
    x.style.display = 'block';
  } else {
    x.style.display = 'none';
  }
}

function getItemData(){
	var px_tree = document.querySelector('px-tree');
	var selectedData =px_tree.selectedMeta;
	//(item:Object) -- reference to the selected item
	var selectedShipment = selectedData.item;
	console.log(_getSelectedMeta(selectedShipment));
	//(path:Array) The path to the selected item as an array. 
	//Begins with the top-most item in the graph and ends with the selected item. 
	var shipmentHierarchy = selectedData.path;
	//(selectedRoute:Array) Different way to get the same information
	var shipmentHierarchy2 = px_tree.selectedRoute;
	console.log("Selected Shipment: " + selectedShipment);
	console.log("Shipment Hierarchy: " + shipmentHierarchy);
	console.log("Shipment Hierarchy 2: " + shipmentHierarchy2);
}

function loading(){
	// while(!document.ready());
	var spinner = document.querySelector('px-spinner');
	spinner.finished = true;
}
