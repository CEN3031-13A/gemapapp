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
var displayaddress;
var orig;
var current;
var dest;
var map;
var mapsReady = false;
var markersArray = [];
var flightPathList =[];

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
  var treeElement = document.getElementById("TEST11");

  string="["
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
      string+="\",\"isSelectable\": true,\"children\":[";
      strcheck1 = string;

      for(k=0;k<customerListSearch[i].orders[j].shipments.length;k++){
        string+="{\"label\":\"";
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
  string+="]";

  treeElement.attributes.items.value = string;
}




function getItemData(){
  var customers = JSON.parse(document.getElementById("SOURCE").innerHTML);
  var px_tree = document.querySelector('px-tree');
  // var selectedData =px_tree.selectedMeta;
  var selectedShipment = px_tree.selected;
  var selectedPath = px_tree.selectedRoute;
  if(selectedPath <= 1)
    return;
  //console.log(selectedPath.length);
  //(item:Object) -- reference to the selected item
  // var selectedShipment = selectedData.item;
  var shipmentID = selectedShipment.id;
  //console.log(selectedPath.length);
  var customerID = selectedPath[0];
  //console.log("Customer ID: " + customerID);
  var orderID = selectedPath[1];
  //console.log("Order ID: " + orderID);
  if(selectedPath.length == 2){
    shipmentID = -1;
  }

  var found = false;
  var i,j,k;
  for(i=0;i<customers.length;i++){
    if(customerID == customers[i]._id){
      //console.log("Found customer!");
      customer = customers[i];
      for(j=0;j<customers[i].orders.length;j++){
        if(orderID == customers[i].orders[j].id){
          order = customers[i].orders[j];
          for(k=0;k<customers[i].orders[j].shipments.length;k++){
            //console.log(customers[i].orders[j].shipments[k].id);
            if(shipmentID == customers[i].orders[j].shipments[k].id){
              found = true;
              shipment = customers[i].orders[j].shipments[k];
              customerIndex = i;
              orderIndex    = j;
              shipmentIndex = k;
              break;
            }
          }
        }
      }
    }
  }

  if(!found){
    // console.log("Shipment was not found!");
    pxMapMarkersOrder();
  }
  else{
   pxMapMarkers();
  }

  // pxSteps();
  // customerInfo();
  // shippingDetails();
  // packageDetails();

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
  var treeElement = document.getElementById("TEST11");

  string="["
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
      string+="\",\"isSelectable\": true,\"children\":[";
      strcheck1 = string;

      for(k=0;k<customers[i].orders[j].shipments.length;k++){
        string+="{\"label\":\"";
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
  string+="]";

  treeElement.attributes.items.value = string;

}

function pxSteps() {
  var string = "<px-steps ";
    string += "items=\'[";
    string += "{\"id\":\"1\", \"label\":\"(ORIGIN) ";
    // string += shipment.origin.latitude;
    // string += ", ";
    // string += shipment.origin.latitude;
    //displayLocation(shipment.origin.latitude,shipment.origin.longitude, "origin");
    string += orig;
    string += "\"},";
    string += "{\"id\":\"2\", \"label\":\"(CURRENT) ";
    // string += shipment.current_location.latitude;
    // string += ", ";
    // string += shipment.current_location.latitude;
    //displayLocation(shipment.current_location.latitude,shipment.current_location.longitude, "current");
    string += current;
    string += "\"},";
    string += "{\"id\":\"3\", \"label\":\"(TO) ";
    // string += shipment.destination.latitude;
    // string += ", ";
    // string += shipment.destination.latitude;
    //displayLocation(shipment.destination.latitude,shipment.destination.longitude, "dest");
    string += dest
    string += "\"}]\' completed=\'[\"1\",\"2\"]\' </px-steps>";

    document.getElementById("STEPS").innerHTML = string;
}

function pxMapMarkers(){
  
  clearMarkers();
  var origin = {lat: shipment.origin.latitude, lng: shipment.origin.longitude};
  addMarker(origin);

  var current = {lat: shipment.current_location.latitude, lng: shipment.current_location.longitude};
  addMarker(current);

  var dest = {lat: shipment.destination.latitude, lng: shipment.destination.longitude};
  addMarker(dest);
  if(flightPathList!=null)
    removeLine()
  drawLine(shipment.origin, shipment.current_location, shipment.destination);
  
}

function pxMapMarkersOrder(){
  if(flightPathList!=null)
    removeLine()

  clearMarkers();
  
  for(i = 0; i<order.shipments.length; i++){
  var origin  = {lat: order.shipments[i].origin.latitude, lng: order.shipments[i].origin.longitude};
  addMarker(origin);

  var current = {lat: order.shipments[i].current_location.latitude, lng: order.shipments[i].current_location.longitude};
  addMarker(current);

  var dest    = {lat: order.shipments[i].destination.latitude, lng: order.shipments[i].destination.longitude};
  addMarker(dest);

  drawLine(order.shipments[i].origin, order.shipments[i].current_location, order.shipments[i].destination);
     }
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
  var string = "<strong>Tracking Number: </strong><text>";
  string += shipment.id + "</text><br />";
  string += "<strong>Carrier: </strong>";
  string += shipment.carrier +"<br />";
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
  string += "<strong>Status: </strong><strong>what is this?</strong><br />";
  document.getElementById("SHIPPING_DETAILS").innerHTML = string;
}

function packageDetails(){
  var string = "<strong>Order Placed (Id): </strong>";
  string += shipment.ship_date;
  string += "<br />";
  string += "<strong>Shipment Contents: </strong>";
  string += shipment.contents;
  string += "<br />";
  string += "<strong>Description: </strong><br />";
  string += customer.about + "<br />";
  document.getElementById("PACKAGE_DETAILS").innerHTML = string;
}



function mapPaths(){
    var string = "<google-map-poly closed fill-color=\""
    string += black + "\" "; 
    string += "fill-opacity=\"" + 0.5 + "\">"
    string += "<google-map-point latitude=\"";
    string += shipment.origin.latitude;
    string += "\" longitude=\"" ;
    string += shipment.origin.longitude;
    string += "\"></google-map-point>";
    string += "<google-map-point latitude=\"";
    string += shipment.current_location.latitude;
    string += "\" longitude=\"" ;
    string += shipment.current_location.longitude;
    string += "\"></google-map-point>";
    string += "</google-map-poly>";
    string += "<google-map-poly closed fill-color=\""
    string += black + "\" "; 
    string += "fill-opacity=\"" + 0.5 + "\">"
    string += "<google-map-point latitude=\"";
    string += shipment.current_location.latitude;
    string += "\" longitude=\"" ;
    string += shipment.current_location.longitude;
    string += "\"></google-map-point>";
    string += "<google-map-point latitude=\"";
    string += shipment.destination.latitude;
    string += "\" longitude=\"" ;
    string += shipment.destination.longitude;
    string += "\"></google-map-point>";
    string += "</google-map-poly>";

    return string;
}


function displayLocation(latitude,longitude,location){
        var request = new XMLHttpRequest();

        var method = 'GET';
        var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=true';
        var async = true;

        request.open(method, url, async);
        request.onreadystatechange = function(){
          if(request.readyState == 4 && request.status == 200){
            var data = JSON.parse(request.responseText);
            var address = data.results[0];
            if(address == undefined)
              return;
            if(address.formatted_address == undefined)
              return;
            if(address.address_components == undefined)
              return;
            console.log(address.formatted_address);
            if(address.address_components[3].long_name == undefined || address.address_components[4].long_name == undefined )
              return;
              //console.log(address.address_components[3].long_name);
              //console.log(address.address_components[4].long_name);
          
              if(location == "origin")
                orig = address.formatted_address;
              else if(location == "current")
                current = address.formatted_address;
              else if(location == "dest")
                dest = address.formatted_address;
          }
        };
    request.send();
};


setInterval(consistantTimer, 50);

function consistantTimer() {
 if(customerList.length === 0){
   pxTree();
   
 }
 if(map == undefined){
  var uluru = {lat: -25.363, lng: 131.044};
    map = new google.maps.Map(document.getElementById('MAP_MARKERS'), {
          zoom: 4,
          center: uluru
        });
    
  mapsReady = true;
}
 
}

function clearOverlays() {
  for (var i = 0; i < markersArray.length; i++ )
    markersArray[i].setMap(null);
  markersArray.length = 0;
}

function addMarker(location) {
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  markersArray.push(marker);
}

function setMapOnAll(map) {
  for (var i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(map);
  }
}

function clearMarkers() {
        setMapOnAll(null);
}
 
function drawLine(origin, current, destination){
  
  lineCoordinates = [
    {lat: origin.latitude,      lng: origin.longitude},
    {lat: current.latitude,     lng: current.longitude},
    {lat: destination.latitude, lng: destination.longitude},
  ];

  flightPath = new google.maps.Polyline({
  path: lineCoordinates,
  geodesic: true,
  strokeColor: '#FF0000',
  strokeOpacity: 1.0,
  strokeWeight: 2
  });
  flightPathList.push(flightPath)
  flightPathList[flightPathList.length-1].setMap(map);
}

function removeLine() {
  for(i=0;i<flightPathList.length;i++)
        flightPathList[i].setMap(null);
      }
