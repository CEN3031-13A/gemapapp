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
var customerList =[];
var activeCustomerList = [];
var inactiveCustomerList = [];
var activeInactiveState = "";

function myFunction() {
  var x = document.getElementById('hide');
  var y = document.getElementById('MAP_MARKERS');
  var z = document.getElementById('STEPS');
  if (x.style.display === 'none') {
    x.style.display = 'block';
    y.style.width = '63.5%';
    z.style.width = '63vw';
  } else {
    x.style.display = 'none';
    y.style.width = '83.5%';
    z.style.width = '83vw';
  }
}

function displayActive(){
  document.getElementById("myInput").value="";
  activeInactiveState = "Active";
  activeCustomerList =[];
  for(i=0;i<customerList.length;i++){
    if(customerList[i].isActive == true)
      activeCustomerList.push(customerList[i]);
  }
  pxTreeDisplay(activeCustomerList)
}

function displayInactive(){
  document.getElementById("myInput").value="";
  activeInactiveState = "Inactive";
  inactiveCustomerList =[];
  for(i=0;i<customerList.length;i++){
    if(customerList[i].isActive == false)
      inactiveCustomerList.push(customerList[i]);
  }
  pxTreeDisplay(inactiveCustomerList)
}

function displayAll(){
  document.getElementById("myInput").value="";
  activeInactiveState = "All";
  pxTreeDisplay(customerList);
}



function searchCustomers(){
  str =  document.getElementById("myInput").value;
  customerListSearch =[];
  if(activeInactiveState == 'Active'){
    if(str == ""){
      pxTreeDisplay(activeCustomerList);
      return;
    }
    for(i=0;i<activeCustomerList.length;i++){
      regularExpression = new RegExp(str, 'i');
      if(activeCustomerList[i].name.search(regularExpression) != -1)
        customerListSearch.push(activeCustomerList[i]);
    }
    pxTreeDisplay(customerListSearch)
  }else if(activeInactiveState == 'Inactive'){
    if(str == ""){
      pxTreeDisplay(inactiveCustomerList);
      return;
    }
    for(i=0;i<inactiveCustomerList.length;i++){
      regularExpression = new RegExp(str, 'i');
      if(inactiveCustomerList[i].name.search(regularExpression) != -1)
        customerListSearch.push(inactiveCustomerList[i]);
    }
    pxTreeDisplay(customerListSearch)
  }else{
    if(str == ""){
      pxTreeDisplay(customerList);
      return;
    }
    for(i=0;i<customerList.length;i++){
      regularExpression = new RegExp(str, 'i');
      if(customerList[i].name.search(regularExpression) != -1)
        customerListSearch.push(customerList[i]);
    }
    pxTreeDisplay(customerListSearch)  
  }
}

function pxTreeDisplay(customerListSearch) {
  
  customerListSearch.sort(function(a, b) {
    if (a.name.toUpperCase() < b.name.toUpperCase())
      return -1;
    if (a.name.toUpperCase() > b.name.toUpperCase())
      return 1;
    return 0;
  });
  var string = "<px-tree keys=\'{\"id\":\"id\",\"label\":\"label\",\"children\":\"children\"}\'";
  string+="items=\'["
  for(i=0;i<customerListSearch.length;i++){
    string+="{\"label\":\"";
    string+=customerListSearch[i].name;
    string+="\",";
    string+="\"id\":\"";
    string+=customerListSearch[i]._id;
    string+="\",\"isSelectable\": false,\"children\":[";
    strcheck0 = string;
    for(j=0;j<customerListSearch[i].orders.length;j++){
      string+="{\"label\":\"Order #";
      string+=customerListSearch[i].orders[j].index+1;
      string+="\",";
      string+="\"id\":\"";
      string+=customerListSearch[i].orders[j].id;
      string+="\",\"isSelectable\": false,\"children\":[";
      strcheck1 = string;
      for(k=0;k<customerListSearch[i].orders[j].shipments.length;k++){
        string+="{\"label\":\"";
        //string+=customers[i].orders[j].shipments[k].ship_date;
        string+="Shipment #"+ (k+1);
        string+="\",\"id\":\"";
        string+=customerListSearch[i].orders[j].shipments[k].id;
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
  string+="]\' onclick=\'getItemData()\'>";
  string+="</px-tree>";

  document.getElementById("TREE").innerHTML = string;

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
							// console.log(shipment.carrier);
							// console.log(shipment.current_location.latitude);
							// console.log(shipment.current_location.longitude);
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
	packageComments();
}

function loading(){
	// while(!document.ready());
	var spinner = document.querySelector('px-spinner');
	spinner.finished = true;
}

function pxTree() {
  var customers = JSON.parse(document.getElementById("SOURCE").innerHTML);
  customers.sort(function(a, b) {
    if (a.name.toUpperCase() < b.name.toUpperCase())
      return -1;
    if (a.name.toUpperCase() > b.name.toUpperCase())
      return 1;
    return 0;
  });
  var string = "<px-tree keys=\'{\"id\":\"id\",\"label\":\"label\",\"children\":\"children\"}\'";
  string+="items=\'["
  for(i=0;i<customers.length;i++){
    customerList.push(customers[i]);
    string+="{\"label\":\"";
    string+=customers[i].name;
    string+="\",";
    string+="\"id\":\"";
    string+=customers[i]._id;
    string+="\",\"isSelectable\": false,\"children\":[";
    strcheck0 = string;
    for(j=0;j<customers[i].orders.length;j++){
      string+="{\"label\":\"Order #";
      string+=customers[i].orders[j].index+1;
      string+="\",";
      string+="\"id\":\"";
      string+=customers[i].orders[j].id;
      string+="\",\"isSelectable\": false,\"children\":[";
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
  string+="]\' onclick=\'getItemData()\'>";
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
  string += "\"> <div class=\"popup\"><img src=\"image.png\">";
	string += "<p><strong>Current Location: </strong><br />";
	string += "<text>Latitude: ";
	string += shipment.current_location.latitude + "</text><br />";
  string += "<text>Longitude: ";
  string += shipment.current_location.longitude + "</text><br /></p>";
  string += "<p><strong>Shipped: </strong>";
  string += shipment.ship_date + "<br />";
  // string += "<strong>Expected Arrival: </strong>";
  // string += shipment.expected_date +"<br /></p>";
  string += "<i class=\"fa fa-info-circle\" id=\"info\" onclick=\"myFunction()\"></i></div></google-map-marker>";
  string += "<google-map-marker latitude=\"";
  string += shipment.destination.latitude
  string += "\" longitude=\"";
  string += shipment.destination.longitude;
  string += "\"> <div class=\"popup\"><img src=\"image.png\">";
  string += "<p><strong>Destination: </strong><br />";
  string += "<text>Latitude: ";
  string += shipment.destination.latitude+"</text><br />";
  string += "<text>Longitude: ";
  string += shipment.destination.longitude+"</text><br /></p>";
  // string += "<p><strong>Shipped: </strong>";
  // string += shipment.ship_date + "<br />";
  string += "<strong>Expected Arrival: </strong>";
  string += shipment.expected_date +"<br /></p>";
  string += "<i class=\"fa fa-info-circle\" id=\"info\" onclick=\"myFunction()\"></i></div></google-map-marker>";
  string += "</google-map>";
  document.getElementById("MAP_MARKERS").innerHTML = string;
}

function customerInfo(){
    var string = "<strong>Name: </strong>";
    string += customer.name;
    string += "<br />";
	string += "<strong>Age: </strong>";
	string += customer.age;
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
	string += "<strong>Registered: </strong><br />";
    string += customer.registered + "<br />";
	string += "<strong>Description: </strong><br />";
    string += customer.about + "<br />";
	document.getElementById("CUSTOMER_INFO").innerHTML = string;
}

function shippingDetails(){
	var string = "<strong>Tracking Number: </strong><text>";
    string += shipment.id + "</text><br />";
    string += "<strong>Carrier: </strong>";
    string += shipment.carrier +"<br />";
	string += "<strong>Origin: </strong><br />";
	string += "<text>Latitude: ";
	string += shipment.origin.latitude + "</text><br />";
    string += "<text>Longitude: ";
    string += shipment.origin.longitude + "</text><br />";
    string += "<strong>Current Location: </strong><br />";
	string += "<text>Latitude: ";
	string += shipment.current_location.latitude + "</text><br />";
    string += "<text>Longitude: ";
    string += shipment.current_location.longitude + "</text><br />";
    string += "<strong>Destination: </strong><br />";
	string += "<text>Latitude: ";
	string += shipment.destination.latitude+"</text><br />";
    string += "<text>Longitude: ";
    string += shipment.destination.longitude+"</text><br />";
    string += "<strong>Shipped: </strong>";
    string += shipment.ship_date + "<br />";
    string += "<strong>Expected Arrival: </strong>";
    string += shipment.expected_date +"<br />";
    string += "<strong>Status: </strong>";
	string += shipment.delivery_state + "<br />";
	string += "<strong>Penalty if Late: </strong>";
	string += shipment.late_penalties + "<br />";
	document.getElementById("SHIPPING_DETAILS").innerHTML = string;
}

function packageDetails(){
	var string = "<strong>Order Placed (Id): </strong>";
	string += shipment.ship_date;
    string += "<br />";
    string += "<strong>Shipment Contents: </strong>";
	for(i=0;i < shipment.contents.length; i++){
		string += shipment.contents[i];
		string += ", ";
	}
	string = string.substring(0, string.length-2);
    string += "<br />";
	document.getElementById("PACKAGE_DETAILS").innerHTML = string;
}

function packageComments(){
	var string =  "<strong>Comments: </strong><br />";
	for(i=0;i < shipment.comments.length; i++){
		string += "<strong>" + shipment.comments[i].comment_date + "</strong>" + ": ";
		string += shipment.comments[i].comment + "<br />";
	}
	document.getElementById("PACKAGE_COMMENTS").innerHTML = string;
}

function addComment(){
	var comment = document.getElementById("newComment").value;
	var current = new Date();
	var timestamp = current.getFullYear();
	timestamp += "-";
	timestamp += (current.getMonth() + 1);
	timestamp += "-";
	timestamp += current.getDate();
	timestamp += "T";
	timestamp += current.getHours();
	timestamp += ":";
	timestamp += current.getMinutes();
	timestamp += ":";
	timestamp += current.getSeconds();
	timestamp += " ";
	current = current.toString();
	var zonepos = current.indexOf('+');
	if (zonepos == -1){
		zonepos = current.indexOf('-');
	}
	timestamp += current.substr(zonepos, 3);
	timestamp += ":";
	timestamp += current.substr(zonepos+3, 2);
	
	//timestamp and comment ready to be submited to db
	console.log(timestamp + ": " + comment);
	
	//refresh comments
	packageComments();
}


setInterval(consistantTimer, 50);

function consistantTimer() {
 if(customerList.length === 0){
   pxTree();
   // console.log("TEST");
 }
 //console.log(customerList);

}

/*setTimeout(myTimer, 1000);

function myTimer() {
   pxTree();
}
*/
