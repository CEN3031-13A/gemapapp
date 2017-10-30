(function (app) {
  'use strict';

  app.registerModule('customers');
}(ApplicationConfiguration));

var customer;
var order;
var shipment;
var customerIndex;
var orderIndex;
var shipmentIndex;

function myFunction() {
  var x = document.getElementById('hide');
  if (x.style.display === 'none') {
    x.style.display = 'block';
  } else {
    x.style.display = 'none';
  }
}

function getItemData(){
	var customers = JSON.parse(document.getElementById("SOURCE").innerHTML);
	var px_tree = document.querySelector('px-tree');
	// var selectedData =px_tree.selectedMeta;
	var selectedShipment = px_tree.selected;
	var selectedPath = px_tree.selectedRoute;
	//(item:Object) -- reference to the selected item
	// var selectedShipment = selectedData.item;
	var shipmentID = selectedShipment.id;
	console.log("Shipment ID: " + shipmentID);
	var customerID = selectedPath[0];
	console.log("Customer ID: " + customerID);
	var orderID = selectedPath[1];
	console.log("Order ID: " + orderID);

	var found = false;
	var i,j,k;
	for(i=0;i<customers.length;i++){
		if(customerID == customers[i]._id){
			console.log("Found customer!");
			customer = customers[i];
			for(j=0;j<customers[i].orders.length;j++){
				if(orderID == customers[i].orders[j].id){
					order = customers[i].orders[j];
					for(k=0;k<customers[i].orders[j].shipments.length;k++){
						console.log(customers[i].orders[j].shipments[k].id);
						if(shipmentID == customers[i].orders[j].shipments[k].id){
							found = true;
							shipment = customers[i].orders[j].shipments[k];
							console.log(shipment.carrier);
							console.log(shipment.current_location.latitude);
							console.log(shipment.current_location.longitude);
							customerIndex = i;
							orderIndex = j;
							shipmentIndex = k;
							break;
						}
					}
				}
			}
		}
	}

	if(found == false){
		console.log("Shipment was not found!");
	}

	pxSteps();
	pxMapMarkers();
	customerInfo();
	shippingDetails();
	packageDetails();
}

function loading(){
	// while(!document.ready());
	var spinner = document.querySelector('px-spinner');
	spinner.finished = true;
}

function pxTree() {
  var customers = JSON.parse(document.getElementById("SOURCE").innerHTML);
  var string = "<px-tree keys=\'{\"id\":\"id\",\"label\":\"label\",\"children\":\"children\"}\'";
  string+="items=\'["
  for(i=0;i<customers.length;i++){
    string+="{\"label\":\"";
    string+=customers[i].name;
    string+="\",";
    string+="\"id\":\"";
    string+=customers[i]._id;
    string+="\",\"children\":[";
    strcheck0 = string;
    for(j=0;j<customers[i].orders.length;j++){
      string+="{\"label\":\"Order #";
      string+=customers[i].orders[j].index+1;
      string+="\",";
      string+="\"id\":\"";
      string+=customers[i].orders[j].id;
      string+="\",\"children\":[";
      strcheck1 = string;
      for(k=0;k<customers[i].orders[j].shipments.length;k++){
        string+="{\"label\":\"";
        //string+=customers[i].orders[j].shipments[k].ship_date;
        string+="Shipment #"+ (k+1);
        string+="\",\"id\":\"";
        string+=customers[i].orders[j].shipments[k].id;
        string+="\"},"
      }
      if(strcheck1 != string)
        string = string.substring(0, string.length-1);
      string+="]},";
    }
    if(strcheck1 != string)
      string = string.substring(0, string.length-1);
    string+="]},";
  }
  string = string.substring(0, string.length-1);
  string+="]\'>";
  string+="</px-tree>";

  document.getElementById("TREE").innerHTML = string;
}

function pxSteps() {
	var string = "<px-steps ";
  	string += "items=\'[";
  	string += "{\"id\":\"1\", \"label\":\"(ORIGIN) ";
  	string += shipment.origin.latitude;
  	string += ", ";
  	string += shipment.origin.latitude;
  	string += "\"},";
  	string += "{\"id\":\"2\", \"label\":\"(CURRENT) ";
  	string += shipment.current_location.latitude;
  	string += ", ";
  	string += shipment.current_location.latitude;
  	string += "\"},";
  	string += "{\"id\":\"3\", \"label\":\"(TO) ";
  	string += shipment.destination.latitude;
  	string += ", ";
  	string += shipment.destination.latitude;
  	string += "\"}]\' completed=\'[\"1\",\"2\"]\' </px-steps>";

  	document.getElementById("STEPS").innerHTML = string;
}

function pxMapMarkers(){
	var string = "<google-map zoom=\"2\"";
	string += " fit-to-markers api-key=\"AIzaSyDIwsEgFNLvamPKR96RMJzlwTuxBHh3xj0\">";
	string += "<google-map-marker latitude=\"";
	string += shipment.current_location.latitude
	string += "\" longitude=\"";
	string += shipment.current_location.longitude;
	string += "\" draggable=\"true\">";
    string += "<div class=\"popup\"><img src=\"image.png\">";
    string += "<h1>test1</h1>";
    string += "<p> a lot of words in order to test whether the size of the window will increase.</p>";
    string += "<i class=\"fa fa-info-circle\" id=\"info\" onclick=\"myFunction()\"></i></div></google-map-marker>";
    string += "<google-map-marker latitude=\"";
	string += shipment.destination.latitude
	string += "\" longitude=\"";
	string += shipment.destination.longitude;
	string += "\" draggable=\"true\">";
    string += "<div class=\"popup\"><img src=\"image.png\">";
    string += "<h1>test1</h1>";
    string += "<p> a lot of words in order to test whether the size of the window will increase.</p>";
    string += "<i class=\"fa fa-info-circle\" id=\"info\" onclick=\"myFunction()\"></i></div></google-map-marker>";
    string += "</google-map>";
    document.getElementById("MAP_MARKERS").innerHTML = string;
}

function customerInfo(){
    var string = "<strong>Name: </strong>";
    string += customer.name;
    string += "<br />";
    string += "<strong>Email: </strong>";
    string += customer.email;
    string += "<br />";
    string += "<strong>Phone: </strong>";
    string += customer.phone;
    string += "<br />";
    string += "<strong>Address: </strong>"
    string += customer.address;
    string += "<br />";
	document.getElementById("CUSTOMER_INFO").innerHTML = string;
}

function shippingDetails(){
	var string = "<strong>Tracking Number: </strong>";
    string += "{{vm.customers[" + customerIndex +"]";
    string += ".orders[" + orderIndex +"]";
    string += ".shipments[" + shipmentID + "].id}}<br />";
    string += "<strong>Carrier: </strong>";
    string += "{{vm.customers[" + customerIndex +"]";
    string += ".orders[" + orderIndex +"]";
    string += ".shipments[" + shipmentID + "].carrier}}<br />";
    string += "<strong>Current Location: </strong><br />";
	string += "Latitude: ";
	string += "{{vm.customers[" + customerIndex +"]";
    string += ".orders[" + orderIndex +"]";
    string += ".shipments[" + shipmentID + "].current_location.latitude}}<br />";
    string += "Longitude: ";
    string += "{{vm.customers[" + customerIndex +"]";
    string += ".orders[" + orderIndex +"]";
    string += ".shipments[" + shipmentID + "].current_location.longitude}}<br />";
    string += "<strong>Destination: </strong><br />";
	string += "Latitude: ";
	string += "{{vm.customers[" + customerIndex +"]";
    string += ".orders[" + orderIndex +"]";
    string += ".shipments[" + shipmentID + "].current_location.latitude}}<br />";
    string += "Longitude: ";
    string += "{{vm.customers[" + customerIndex +"]";
    string += ".orders[" + orderIndex +"]";
    string += ".shipments[" + shipmentID + "].current_location.longitude}}<br />";
    string += "<strong>Shipped: </strong>";
    string += "{{vm.customers[" + customerIndex +"]";
    string += ".orders[" + orderIndex +"]";
    string += ".shipments[" + shipmentID + "].ship_date}}<br />";
    string += "<strong>Expected Arrival: </strong>";
    string += "{{vm.customers[" + customerIndex +"]";
    string += ".orders[" + orderIndex +"]";
    string += ".shipments[" + shipmentID + "].expected_date}}<br />";
    string += "<strong>Status: </strong><strong>what is this?</strong><br />";
	document.getElementById("SHIPPING_DETAILS").innerHTML = string;
}

function packageDetails(){
	var string = "<strong>Order Placed (Id): </strong>";
	string += "{{vm.customers[" + customerIndex +"]";
    string += ".orders[" + orderIndex +"]";
    string += ".shipments[" + shipmentID + "].id}}<br />";
    string += "<strong>Shipment Contents: </strong>";
	string += "{{vm.customers[" + customerIndex +"]";
    string += ".orders[" + orderIndex +"]";
    string += ".shipments[" + shipmentID + "].carrier}}<br />";
    string += "<strong>Description: </strong><br />";
    string += "Idk what we wanna put here<br />";
	document.getElementById("PACKAGE_COMMENTS").innerHTML = string;
}
