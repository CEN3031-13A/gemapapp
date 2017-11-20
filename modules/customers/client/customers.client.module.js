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
var customerList 		 = [];
var activeCustomerList 	 = [];
var inactiveCustomerList = [];
var activeInactiveState = "";
var displayaddress;
var map;
var mapsReady = false;
var originMarkersArray 	= [];
var currentMarkersArray = [];
var destinationMarkersArray   = [];
var originInfoWindowList 	  = [];
var currentInfoWindowList 	  = [];
var destinationInfoWindowList = [];
var flightPathList =[];
var displayedGMapsErrorMsg = false;

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

  var shipmentID = selectedShipment.id;

  var customerID = selectedPath[0];

  var orderID = selectedPath[1];

  if(selectedPath.length == 2){
    shipmentID = -1;
  }

  var found = false;
  var i,j,k;
  for(i=0;i<customers.length;i++){
    if(customerID == customers[i]._id){
      customer = customers[i];
      for(j=0;j<customers[i].orders.length;j++){
        if(orderID == customers[i].orders[j].id){
          order = customers[i].orders[j];
          for(k=0;k<customers[i].orders[j].shipments.length;k++){
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
    string += orig;
    string += "\"},";
    string += "{\"id\":\"2\", \"label\":\"(CURRENT) ";
    // string += shipment.current_location.latitude;
    // string += ", ";
    // string += shipment.current_location.latitude;
    string += current;
    string += "\"},";
    string += "{\"id\":\"3\", \"label\":\"(TO) ";
    // string += shipment.destination.latitude;
    // string += ", ";
    // string += shipment.destination.latitude;
    string += dest
    string += "\"}]\' completed=\'[\"1\",\"2\"]\' </px-steps>";

    document.getElementById("STEPS").innerHTML = string;
}

function pxMapMarkers(){

  clearMarkers();
  setSingleShipmentOnMap(map, shipmentIndex);

  if(flightPathList!=null)
    removeLine()
  drawLine(shipment.origin, shipment.current_location, shipment.destination);
}

function pxMapMarkersOrder(){
  if(flightPathList!=null)
    removeLine()

  clearMarkers();
  originMarkersArray        = [];
  currentMarkersArray       = [];
  destinationMarkersArray   = [];
  originInfoWindowList      = [];
  currentInfoWindowList     = [];
  destinationInfoWindowList = [];
  latSum = 0;
  longSum =0;
  for(i = 0; i<order.shipments.length; i++){
  	addShipmentMarkers(order.shipments[i], i+1, order.shipments.length);
  	drawLine(order.shipments[i].origin, order.shipments[i].current_location, order.shipments[i].destination);
  	latSum  += order.shipments[i].origin.latitude;
  	latSum  += order.shipments[i].current_location.latitude;
  	latSum  += order.shipments[i].destination.latitude;
  	longSum += order.shipments[i].origin.longitude;
  	longSum += order.shipments[i].current_location.longitude;
  	longSum += order.shipments[i].destination.longitude;
  }
  latAvg  = latSum/(order.shipments.length*3);
  longAvg = longSum/(order.shipments.length*3);
  avgPos  = {lat:latAvg, lng:longAvg};

  map.panTo(avgPos);

}

function customerInfo(){

	customerInfoElement = document.getElementById("CUSTOMER_INFO").children;
    customerInfoElement[1].innerText  = customer.name;
    customerInfoElement[4].innerText  = customer.email;
    customerInfoElement[7].innerText  = customer.phone;
    customerInfoElement[10].innerText = customer.address;
}

function shippingDetails(){

  if(shipment != undefined){
	  shipmentInfoElement = document.getElementById("SHIPPING_DETAILS").children;
	  shipmentInfoElement[1].innerText  = shipment.id;
	  shipmentInfoElement[4].innerText  = shipment.carrier;
	  shipmentInfoElement[9].innerText  = shipment.current_location.latitude;
	  shipmentInfoElement[12].innerText = shipment.current_location.longitude;
	  shipmentInfoElement[17].innerText = shipment.destination.latitude;
	  shipmentInfoElement[20].innerText = shipment.destination.longitude;
	  shipmentInfoElement[23].innerText = shipment.ship_date;
	  shipmentInfoElement[26].innerText = shipment.expected_date;
	  shipmentInfoElement[29].innerText = shipment.delivery_state;
  }
}

function packageDetails(){

  if(shipment != undefined){
  	packageInfoElement = document.getElementById("PACKAGE_DETAILS").children;
  	packageInfoElement[1].innerText  = shipment.ship_date;
  	packageInfoElement[4].innerText  = shipment.contents;
  	packageInfoElement[7].innerText  = customer.about ;
  }
}



function displayLocation(latitude,longitude){
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
      	// console.log(address.formatted_address)
        return address.formatted_address;
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
  var GEHeadquarters = {lat: 42.3522898, lng: -71.0495636};
  try{
    map = new google.maps.Map(document.getElementById('MAP_MARKERS'), {
          zoom: 2,
          center: GEHeadquarters,
          mapTypeId: 'hybrid',
        });
  }
  catch(ReferenceError){

    if(displayedGMapsErrorMsg == false){
      console.log("Google Maps APIs have not been loaded yet.")
      displayedGMapsErrorMsg = true;
    }
    
  }
}
 
}

function clearOverlays() {
  for (var i = 0; i < markersArray.length; i++ )
    markersArray[i].setMap(null);
  markersArray.length = 0;
}

function addShipmentMarkers(shipment, index, orderSize) {
  // generalLocationOrigin      = displayLocation(shipment.origin.latitude, shipment.origin.longitude)
  // generalLocationCurrent     = displayLocation(shipment.current_location.latitude, shipment.current_location.longitude)
  // generalLocationDestination = displayLocation(shipment.destination.latitude, shipment.destination.longitude)


  if(shipment.delivery_state == "Ahead of Time")
      pinColor = "00FF6F";
  else if(shipment.delivery_state == "On Time")
      pinColor = "00A849";
  else if(shipment.delivery_state == "Likely to be On Time")
      pinColor = "CEF700";
  else if(shipment.delivery_state == "Likely to be Behind Schedule")
      pinColor = "C0C439";
  else if(shipment.delivery_state == "Behind Schedule")
      pinColor = "FFA220";
  else if(shipment.delivery_state == "Late")
      pinColor = "BF1913"; 
  else
      pinColor = "BF1913";
      
  origin  = {lat: shipment.origin.latitude, lng: shipment.origin.longitude};
  current = {lat: shipment.current_location.latitude, lng: shipment.current_location.longitude};
  dest    = {lat: shipment.destination.latitude, lng: shipment.destination.longitude};

  originContentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h3 id="firstHeading" class="firstHeading">Consignment Origin '+
            '('+index+' of '+orderSize+')'+
            '</h3>'+
            '<div id="bodyContent">'+
            '<p><b>Coordinates:</b></br>'+
            'Latitude: '+shipment.origin.latitude+"</br>"+
            'Longitude: '+shipment.origin.longitude+"</br>"+
            "</br>"+
            '<b>Date: </b></br>'+
            shipment.ship_date+
            '</p>'+
            '</div>'+
            '</div>'; 

  var currentContentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h3 id="firstHeading" class="firstHeading">Consignment Current Location '+
            '('+index+' of '+orderSize+')'+
            '</h3>'+
            '<div id="bodyContent">'+
            '<p><b>Coordinates:</b></br>'+
            'Latitude: '+shipment.current_location.latitude+"</br>"+
            'Longitude: '+shipment.current_location.longitude+"</br>"+
            "</br>"+
            '<b>Date: </b></br>'+
            shipment.ship_date+
            '</p>'+
            '</div>'+
            '</div>'; 

  var destinationContentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h3 id="firstHeading" class="firstHeading">Consignment Destination '+
            '('+index+' of '+orderSize+')'+
            '</h3>'+
            '<div id="bodyContent">'+
            '<p><b>Coordinates:</b></br>'+
            'Latitude: '+shipment.destination.latitude+"</br>"+
            'Longitude: '+shipment.destination.longitude+"</br>"+
            "</br>"+
            '<b>Date: </b></br>'+
            shipment.ship_date+
            '</p>'+
            '</div>'+
            '</div>';    

  originPinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%41|86B6EC");

  currentPinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld="+index+"|"+pinColor);

  destinationPinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%42|86B6EC");


  originMarker = new google.maps.Marker({
    position: origin,
    map: map,
    icon: originPinImage
  });

  currentMarker = new google.maps.Marker({
    position: current,
    map: map,
    icon: currentPinImage
  });

  destinationMarker = new google.maps.Marker({
    position: dest,
    map: map,
    icon: destinationPinImage
  });

  originMarkersArray.push(originMarker);
  currentMarkersArray.push(currentMarker);
  destinationMarkersArray.push(destinationMarker);

  originInfoWindow = new google.maps.InfoWindow({
        content: originContentString
      });
  currentInfoWindow= new google.maps.InfoWindow({
        content: currentContentString
      });
  destinationInfoWindow = new google.maps.InfoWindow({
        content: destinationContentString
      });

  originInfoWindowList.push(originInfoWindow);
  currentInfoWindowList.push(currentInfoWindow);
  destinationInfoWindowList.push(destinationInfoWindow);  
  originMarkersArray[index-1].addListener('click', function() {
  	console.log(originMarkersArray)
    originInfoWindowList[index-1].open(map, originMarkersArray[index-1]);
  });
  
  currentMarkersArray[index-1].addListener('click', function() {
    currentInfoWindowList[index-1].open(map, currentMarkersArray[index-1]);
  });
  
  destinationMarkersArray[index-1].addListener('click', function() {
    destinationInfoWindowList[index-1].open(map, destinationMarkersArray[index-1]);
  });
  

  currentMarkersArray[index-1].setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(function(){ currentMarkersArray[index-1].setAnimation(null);}, 750);


}
var inAnimation = false;
function setSingleShipmentOnMap(map, index) {
    originMarkersArray[index].setMap(map);
    currentMarkersArray[index].setMap(map);
    destinationMarkersArray[index].setMap(map);

    map.panTo(currentMarkersArray[index].position)
    currentMarkersArray[index].setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(function(){ currentMarkersArray[index].setAnimation(null); }, 750);
}

function setMapOnAll(map) {
  for (var i = 0; i < originMarkersArray.length; i++) {
    originMarkersArray[i].setMap(map);
  }
  for (var i = 0; i < currentMarkersArray.length; i++) {
    currentMarkersArray[i].setMap(map);
  }
  for (var i = 0; i < destinationMarkersArray.length; i++) {
    destinationMarkersArray[i].setMap(map);
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
  geodesic: false,
  strokeColor: '#C1C1C1',
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
