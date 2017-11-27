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
var customerList     = [];
var activeCustomerList   = [];
var inactiveCustomerList = [];
var activeInactiveState = '';
var displayaddress;
var map;
var mapsReady = false;
var originMarkersArray  = [];
var currentMarkersArray = [];
var destinationMarkersArray = [];
var originInfoWindowList    = [];
var currentInfoWindowList     = [];
var destinationInfoWindowList = [];
var flightPathList = [];
var displayedGMapsErrorMsg = false;
var generalLocationOrigin = [];      
var generalLocationCurrent = [];     
var generalLocationDestination = []; 

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

function displayActive() {
  document.getElementById("myInput").value = "";
  activeInactiveState = "Active";
  activeCustomerList = [];
  for (let i = 0; i < customerList.length; i++) {
    if (customerList[i].isActive === true)
      activeCustomerList.push(customerList[i]);
  }
  pxTreeDisplay(activeCustomerList);
}

function displayInactive() {
  document.getElementById("myInput").value = "";
  activeInactiveState = "Inactive";
  inactiveCustomerList = [];
  for (let i = 0; i < customerList.length; i++) {
    if (customerList[i].isActive === false)
      inactiveCustomerList.push(customerList[i]);
  }
  pxTreeDisplay(inactiveCustomerList);
}

function displayAll() {
  document.getElementById("myInput").value = "";
  activeInactiveState = "All";
  pxTreeDisplay(customerList);
}

function searchCustomers() {
  var str = document.getElementById("myInput").value;
  var customerListSearch = [];
  if (activeInactiveState === 'Active') {
    if (str === "") {
      pxTreeDisplay(activeCustomerList);
      return;
    }
    for (let i = 0; i < activeCustomerList.length; i++) {
      let regularExpression = new RegExp(str, 'i');
      if (activeCustomerList[i].name.search(regularExpression) !== -1)
        customerListSearch.push(activeCustomerList[i]);
    }
    pxTreeDisplay(customerListSearch);
  } else if (activeInactiveState === 'Inactive') {
    if (str === "") {
      pxTreeDisplay(inactiveCustomerList);
      return;
    }
    for (let i = 0; i < inactiveCustomerList.length; i++) {
      let regularExpression = new RegExp(str, 'i');
      if (inactiveCustomerList[i].name.search(regularExpression) !== -1)
        customerListSearch.push(inactiveCustomerList[i]);
    }
    pxTreeDisplay(customerListSearch);
  } else {
    if (str === "") {
      pxTreeDisplay(customerList);
      return;
    }
    for (let i = 0; i < customerList.length; i++) {
      let regularExpression = new RegExp(str, 'i');
      if (customerList[i].name.search(regularExpression) !== -1)
        customerListSearch.push(customerList[i]);
    }
    pxTreeDisplay(customerListSearch);
  }
}

function pxTreeDisplay(customerListSearch) {
  customerListSearch.sort(function (a, b) {
    if (a.name.toUpperCase() < b.name.toUpperCase())
      return -1;
    if (a.name.toUpperCase() > b.name.toUpperCase())
      return 1;
    return 0;
  });
  var treeElement = document.getElementById("TEST11");

  let string = "[";
  for (let i = 0; i < customerListSearch.length; i++) {
    string += "{\"label\":\"";
    string += customerListSearch[i].name;
    string += "\",";
    string += "\"id\":\"";
    string += customerListSearch[i]._id;
    string += "\",\"isSelectable\": false,\"children\":[";
    var strcheck0 = string;

    for (let j = 0; j < customerListSearch[i].orders.length; j++) {
      string += "{\"label\":\"Order #";
      string += customerListSearch[i].orders[j].index + 1;
      string += "\",";
      string += "\"id\":\"";
      string += customerListSearch[i].orders[j].id;
      string += "\",\"isSelectable\": true,\"children\":[";
      var strcheck1 = string;

      for (let k = 0; k < customerListSearch[i].orders[j].shipments.length; k++) {
        string += "{\"label\":\"";
        string += "Shipment #" + (k + 1);
        string += "\",\"id\":\"";
        string += customerListSearch[i].orders[j].shipments[k].id;
        string += "\"},";
      }
      if (strcheck1 !== string)
        string = string.substring(0, string.length - 1);
      string += "]},";
    }
    if (strcheck0 !== string)
      string = string.substring(0, string.length - 1);
    string += "]},";
  }
  string = string.substring(0, string.length - 1);
  string += "]";

  treeElement.attributes.items.value = string;
}

function getItemData() {
  var customers = JSON.parse(document.getElementById("SOURCE").innerHTML);
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
  for (i = 0; i < customers.length; i++) {
    if (customerID === customers[i]._id) {
      customer = customers[i];
      for (j = 0; j < customers[i].orders.length; j++) {
        if (orderID === customers[i].orders[j].id) {
          order = customers[i].orders[j];
          customerIndex = i;
          orderIndex = j;
          for (k = 0; k < customers[i].orders[j].shipments.length; k++) {
            if (shipmentID === customers[i].orders[j].shipments[k].id) {
              found = true;
              shipment = customers[i].orders[j].shipments[k];
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

  if (!found){
    pxMapMarkersOrder();
    pxSteps(false);
  }
  else {
    pxMapMarkers();
    pxSteps(true);
  }

  pxSteps();
  customerInfo();
  shippingDetails();
  packageDetails();
  packageComments();

}

function loading() {
  // while(!document.ready());
  var spinner = document.querySelector('px-spinner');
  spinner.finished = true;
}

function pxTree() {
  var customers = JSON.parse(document.getElementById("SOURCE").innerHTML);
  customers.sort(function (a, b) {
    if (a.name.toUpperCase() < b.name.toUpperCase())
      return -1;
    if (a.name.toUpperCase() > b.name.toUpperCase())
      return 1;
    return 0;
  });
  var treeElement = document.getElementById("TEST11");

  let string = "[";
  for (let i = 0; i < customers.length; i++) {
    customerList.push(customers[i]);
    string += "{\"label\":\"";
    string += customers[i].name;
    string += "\",";
    string += "\"id\":\"";
    string += customers[i]._id;
    string += "\",\"isSelectable\": false,\"children\":[";
    var strcheck0 = string;

    for (let j = 0; j < customers[i].orders.length; j++) {
      string += "{\"label\":\"Order #";
      string += customers[i].orders[j].index + 1;
      string += "\",";
      string += "\"id\":\"";
      string += customers[i].orders[j].id;
      string += "\",\"isSelectable\": true,\"children\":[";
      var strcheck1 = string;

      for (let k = 0; k < customers[i].orders[j].shipments.length; k++) {
        string += "{\"label\":\"";
        string += "Shipment #" + (k + 1);
        string += "\",\"id\":\"";
        string += customers[i].orders[j].shipments[k].id;
        string += "\"},";
      }
      if (strcheck1 !== string)
        string = string.substring(0, string.length - 1);
      string += "]},";
    }
    if (strcheck0 !== string)
      string = string.substring(0, string.length - 1);
    string += "]},";
  }
  string = string.substring(0, string.length - 1);
  string += "]";

  treeElement.attributes.items.value = string;

}


function pxSteps(infoNeeded) {
    var string = "<px-steps ";
    string += "items=\'[";
    string += "{\"id\":\"1\", \"label\":\"(ORIGIN) ";
    if(infoNeeded){
      string += generalLocationOrigin[shipmentIndex];
    }
    string += "\"},";
    string += "{\"id\":\"2\", \"label\":\"(CURRENT) ";
    if(infoNeeded){
      string += generalLocationCurrent[shipmentIndex];
    }
    string += "\"},";
    string += "{\"id\":\"3\", \"label\":\"(TO) ";
    if(infoNeeded){
      string += generalLocationDestination[shipmentIndex];
    }
    string += "\"}]\' completed=\'[\"1\",\"2\"]\' </px-steps>";

    document.getElementById("STEPS").innerHTML = string;
}


function pxMapMarkers() {
  clearMarkers();
  setSingleShipmentOnMap(map, shipmentIndex);
  if (flightPathList != null)
    removeLine();
  drawLine(shipment.origin, shipment.current_location, shipment.destination, shipment.delivery_state);
}

function pxMapMarkersOrder() {
  if (flightPathList != null)
    removeLine();
    
  clearMarkers();
  originMarkersArray = [];
  currentMarkersArray = [];
  destinationMarkersArray = [];
  originInfoWindowList = [];
  currentInfoWindowList = [];
  destinationInfoWindowList = [];
  generalLocationOrigin = [];      
  generalLocationCurrent = [];     
  generalLocationDestination = []; 

  let latSum = 0;
  let longSum = 0;
  for (let i = 0; i < order.shipments.length; i++) {
    displayLocations(order.shipments[i], i + 1, order.shipments.length);
    drawLine(order.shipments[i].origin, order.shipments[i].current_location, order.shipments[i].destination, order.shipments[i].delivery_state);
    latSum += order.shipments[i].origin.latitude;
    latSum += order.shipments[i].current_location.latitude;
    latSum += order.shipments[i].destination.latitude;
    longSum += order.shipments[i].origin.longitude;
    longSum += order.shipments[i].current_location.longitude;
    longSum += order.shipments[i].destination.longitude;
  }
  let latAvg = latSum / (order.shipments.length * 3);
  let longAvg = longSum / (order.shipments.length * 3);
  let avgPos = { lat: latAvg, lng: longAvg };

  map.panTo(avgPos);
}


function customerInfo() {
  let customerInfoElement = document.getElementById("CUSTOMER_INFO").children;
  customerInfoElement[1].innerText = customer.name;
  customerInfoElement[4].innerText = customer.email;
  customerInfoElement[7].innerText = customer.phone;
  customerInfoElement[10].innerText = customer.address;
}

function shippingDetails() {
  if (shipment !== undefined) {
    let shipmentInfoElement = document.getElementById("SHIPPING_DETAILS").children;
    shipmentInfoElement[1].innerText = shipment.id;
    shipmentInfoElement[4].innerText = shipment.carrier;
    shipmentInfoElement[9].innerText = shipment.current_location.latitude;
    shipmentInfoElement[12].innerText = shipment.current_location.longitude;
    shipmentInfoElement[17].innerText = shipment.destination.latitude;
    shipmentInfoElement[20].innerText = shipment.destination.longitude;
    shipmentInfoElement[23].innerText = shipment.ship_date;
    shipmentInfoElement[26].innerText = shipment.expected_date;
    shipmentInfoElement[29].innerText = shipment.delivery_state;
  }
}

function packageDetails() {

  if (shipment !== undefined) {
    let packageInfoElement = document.getElementById("PACKAGE_DETAILS").children;
    packageInfoElement[1].innerText = shipment.ship_date;
    packageInfoElement[4].innerText = shipment.contents;
    packageInfoElement[7].innerText = customer.about;
  }
}

function packageComments(){
  // if(shipment.comments != undefined){
  //   var string =  "<strong>Comments: </strong><br />";
  //   for(i=0;i < shipment.comments.length; i++){
  //     string += "<strong>" + shipment.comments[i].comment_date + "</strong>" + ": ";
  //     string += shipment.comments[i].comment + "<br />";
  //   }
  //   document.getElementById("PACKAGE_COMMENTS").innerHTML = string;
  // }
}

function displayLocation(latitude, longitude, type, callback) {
  var request = new XMLHttpRequest();
  var method = 'GET';
  var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true';
  var async = false;

  request.open(method, url, async);
  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
      var data = JSON.parse(request.responseText);
      console.log(data);
      if(data.status=="ZERO_RESULTS"){
        if(type == "origin"){
          console.log("ORIGIN: ");
          generalLocationOrigin.push("");
          console.log("NO GOOD!");
        }
        else if(type == "current"){
          console.log("CURRENT: ");       
          generalLocationCurrent.push("");
          console.log("NO GOOD!"); 
        }   
        else if(type == "destination"){
          console.log("DESTINATION: ");   
          generalLocationDestination.push("");
          console.log("NO GOOD!");
        }
      }else{
        var index_address = data.results.length;
        if(index_address >= 2)
          var address = data.results[index_address-2];
        else{
          if (index_address == 1)
            var address = data.results[0];
          if(index_address < 1){
            console.log("NO BUENO!");
            return;
          }
        }
        //console.log(address);
        var nogood = false;
        if (address.formatted_address === undefined)
          nogood = true;
        if(type == "origin"){
          console.log("ORIGIN: ");
          if(nogood == true){
            console.log("NO GOOD!");
            generalLocationOrigin.push("");
          }
          else{
            console.log(address.formatted_address);
            generalLocationOrigin.push(address.formatted_address);
          }
          console.log(generalLocationOrigin);
        }
        else if(type == "current"){
          console.log("CURRENT: ");
          if(nogood == true){
            console.log("NO GOOD!");
            generalLocationCurrent.push("");
          }
          else{
            console.log(address.formatted_address);       
            generalLocationCurrent.push(address.formatted_address);
          }
          console.log(generalLocationCurrent);
        }    
        else if(type == "destination"){
          console.log("DESTINATION: ");
          if(nogood == true){
            console.log("NO GOOD!");
            generalLocationDestination.push("");
          }
          else{
            console.log(address.formatted_address);       
            generalLocationDestination.push(address.formatted_address);
          }
          console.log(generalLocationDestination);
        }
      }
    }
  };
  request.send();
  callback();
}


setInterval(consistantTimer, 50);

function consistantTimer() {
  if (customerList.length === 0) {
    pxTree();
  }
  if (map === undefined) {
    var GEHeadquarters = { lat: 42.3522898, lng: -71.0495636 };
    try {
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
  // console.log("orgin "      +       generalLocationOrigin.length     );   
  // console.log("current "    +    generalLocationCurrent.length    );     
  // console.log("destination "+ generalLocationDestination.length); 
}

/*
function clearOverlays() {
  for (var i = 0; i < markersArray.length; i++)
    markersArray[i].setMap(null);
    markersArray.length = 0;
}
*/
function displayLocations(shipment, index, orderSize){
  displayLocation(shipment.origin.latitude, shipment.origin.longitude, "origin", function(){console.log("origin complete!")});
  displayLocation(shipment.current_location.latitude, shipment.current_location.longitude, "current", function(){console.log("current complete!")});
  displayLocation(shipment.destination.latitude, shipment.destination.longitude, "destination", function(){addShipmentMarkers(shipment, index, orderSize)});
}

function addShipmentMarkers(shipment, index, orderSize) {
  // displayLocation(shipment.origin.latitude, shipment.origin.longitude, "origin", function(){console.log("origin complete!")});
  // setTimeout(delay, 1000000000000);
  // displayLocation(shipment.current_location.latitude, shipment.current_location.longitude, "current", function(){console.log("origin complete!")});
  // setTimeout(delay, 1000000000000);
  // displayLocation(shipment.destination.latitude, shipment.destination.longitude, "destination", function(){console.log("origin complete!")});
  // setTimeout(delay, 1000000000000);

  console.log("ARRAY LOCATION: ");
  console.log("orgin "      +generalLocationOrigin[index - 1] );
  console.log("current "    +generalLocationCurrent[index - 1] );
  console.log("destination "+generalLocationDestination[index - 1] ); 

  console.log("ARRAY LENGTHS: ");
  console.log("orgin length "      +       generalLocationOrigin.length     );   
  console.log("current length "    +    generalLocationCurrent.length    );     
  console.log("destination length "+ generalLocationDestination.length);
  
  console.log("WHOLE FREAKING ARRAY: ");
  console.log("orgin "      +generalLocationOrigin );
  console.log("current "    +generalLocationCurrent );
  console.log("destination "+generalLocationDestination );

  let pinColor;

  if (shipment.delivery_state === "Ahead of Time")
    pinColor = "10C6FF";
  else if (shipment.delivery_state === "On Time")
    pinColor = "00C300";
  else if (shipment.delivery_state === "Likely to be On Time")
    pinColor = "DEE800";
  else if (shipment.delivery_state === "Likely to be Behind Schedule")
    pinColor = "FFBF0C";
  else if (shipment.delivery_state === "Behind Schedule")
    pinColor = "E85E00";
  else if (shipment.delivery_state === "Late")
    pinColor = "FF0000";
  else {
    pinColor = "999999";
  }

  
  let origin = { lat: shipment.origin.latitude, lng: shipment.origin.longitude };
  let current = { lat: shipment.current_location.latitude, lng: shipment.current_location.longitude };
  let dest = { lat: shipment.destination.latitude, lng: shipment.destination.longitude };

  let formattedLocationOrigin;
  // console.log("orgin "      +generalLocationOrigin );
  // console.log("current "    +generalLocationCurrent );
  // console.log("destination "+generalLocationDestination );
  // console.log("orgin "      +generalLocationOrigin[index - 1] );
  // console.log("current "    +generalLocationCurrent[index - 1] );
  // console.log("destination "+generalLocationDestination[index - 1] );
  if(generalLocationOrigin[index - 1] == ""){
    formattedLocationOrigin = '<p><b>Coordinates:</b></br>' +                     
                              'Latitude: ' + shipment.origin.latitude + "</br>" + 
                              'Longitude: ' + shipment.origin.longitude + "</br>";
  }else{
    formattedLocationOrigin = '<p><b>Location:</b></br>' +
                               generalLocationOrigin[index - 1] + '</br>';
  }
  let formattedLocationCurrent;
  if(generalLocationCurrent[index - 1] == ""){
    formattedLocationCurrent= '<p><b>Coordinates:</b></br>' +                     
                              'Latitude: ' + shipment.current_location.latitude + "</br>" + 
                              'Longitude: ' + shipment.current_location.longitude + "</br>";
  }else{
    formattedLocationCurrent = '<p><b>Location:</b></br>' +
                               generalLocationCurrent[index - 1] + '</br>';
  }
  let formattedLocationDestination;
  if(generalLocationDestination[index - 1] == ""){
    formattedLocationDestination = '<p><b>Coordinates:</b></br>' +                     
                                   'Latitude: ' + shipment.destination.latitude + "</br>" + 
                                   'Longitude: ' + shipment.destination.longitude + "</br>";
  }else{
    formattedLocationDestination = '<p><b>Location:</b></br>' +
                               generalLocationDestination[index - 1] + '</br>';
  }

  let originContentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<h3 id="firstHeading" class="firstHeading">Consignment Origin ' +
            '(' + index + ' of ' + orderSize + ')' +
             '</h3>' +
            '<div id="bodyContent">' +
            formattedLocationOrigin +
            "</br>" +
            '<b>Date: </b></br>' +
            shipment.ship_date +
            '</p>' +
            '</div>' +
            '</div>';

  var currentContentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<h3 id="firstHeading" class="firstHeading">Consignment Current Location ' +
            '(' + index + ' of ' + orderSize + ')' +
            '</h3>' +
            '<div id="bodyContent">' +
            formattedLocationCurrent +
            "</br>" +
            '<b>Date: </b></br>' +
            shipment.ship_date +
            '</p>' +
            '</div>' +
            '</div>';

  var destinationContentString = '<div id="content">' +
            '<div id="siteNotice">' + '</div>' +
            '<h3 id="firstHeading" class="firstHeading">Consignment Destination ' +
            '(' + index + ' of ' + orderSize + ')' +
            '</h3>' +
            '<div id="bodyContent">' +
            formattedLocationDestination +
            '</br>' +
            '<b>Date: </b></br>' +
            shipment.ship_date +
            '</p>' +
            '</div>' +
            '</div>';

  let originPinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%41|999999");

  let currentPinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld="+index+"|"+pinColor);

  let destinationPinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%42|999999");

  let originMarker = new google.maps.Marker({
    position: origin,
    map: map,
    icon: originPinImage
  });

  let currentMarker = new google.maps.Marker({
    position: current,
    map: map,
    icon: currentPinImage
  });

  let destinationMarker = new google.maps.Marker({
    position: dest,
    map: map,
    icon: destinationPinImage
  });

  originMarkersArray.push(originMarker);
  currentMarkersArray.push(currentMarker);
  destinationMarkersArray.push(destinationMarker);

  let originInfoWindow = new google.maps.InfoWindow({
    content: originContentString
  });
  let currentInfoWindow = new google.maps.InfoWindow({
    content: currentContentString
  });
  let destinationInfoWindow = new google.maps.InfoWindow({
    content: destinationContentString
  });

  originInfoWindowList.push(originInfoWindow);
  currentInfoWindowList.push(currentInfoWindow);
  destinationInfoWindowList.push(destinationInfoWindow);
  originMarkersArray[index - 1].addListener('click', function () {
    //console.log(originMarkersArray);
    originInfoWindowList[index - 1].open(map, originMarkersArray[index - 1]);
  });
  currentMarkersArray[index - 1].addListener('click', function () {
    currentInfoWindowList[index - 1].open(map, currentMarkersArray[index - 1]);
  });
  destinationMarkersArray[index - 1].addListener('click', function () {
    destinationInfoWindowList[index - 1].open(map, destinationMarkersArray[index - 1]);
  });

  currentMarkersArray[index - 1].setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(function () { currentMarkersArray[index - 1].setAnimation(null);}, 750);
}

function delay(){
  for(i = 0; i<100000; i++);
}

var inAnimation = false;
function setSingleShipmentOnMap(map, index) {
  originMarkersArray[index].setMap(map);
  currentMarkersArray[index].setMap(map);
  destinationMarkersArray[index].setMap(map);
  map.panTo(currentMarkersArray[index].position);
  currentMarkersArray[index].setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(function () { currentMarkersArray[index].setAnimation(null); }, 750);
}

function setMapOnAll(map) {
  for (let i = 0; i < originMarkersArray.length; i++) {
    originMarkersArray[i].setMap(map);
  }
  for (let i = 0; i < currentMarkersArray.length; i++) {
    currentMarkersArray[i].setMap(map);
  }
  for (var i = 0; i < destinationMarkersArray.length; i++) {
    destinationMarkersArray[i].setMap(map);
  }
}

function clearMarkers() {
  setMapOnAll(null);
}

function drawLine(origin, current, destination, state) {
  let lineCoordinates = [
    { lat: origin.latitude, lng: origin.longitude },
    { lat: current.latitude, lng: current.longitude },
    { lat: destination.latitude, lng: destination.longitude }
  ];
  var lineColor;
  switch (state) {
    case 'Ahead of Time':
      lineColor = '#10C6FF';
      break;
    case 'On Time':
      lineColor = '#00C300';
      break;
    case 'Likely to be On Time':
      lineColor = '#DEE800';
      break;
    case 'Likely to be Behind Schedule':
      lineColor = '#FFBF0C';
      break;
    case 'Behind Schedule':
      lineColor = '#E85E00';
      break;
    case 'Late':
      lineColor = '#FF0000';
      break;
    default:
      lineColor = '#999999';
  }
  let flightPath = new google.maps.Polyline({
    path: lineCoordinates,
    geodesic: false,
    strokeColor: lineColor,
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  flightPathList.push(flightPath);
  flightPathList[flightPathList.length - 1].setMap(map);
}

function removeLine() {
  for (let i = 0; i < flightPathList.length; i++)
    flightPathList[i].setMap(null);
}