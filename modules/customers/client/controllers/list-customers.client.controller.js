(function () {
  'use strict';

  angular
    .module('customers')
    .controller('CustomersListController', CustomersListController);

  CustomersListController.$inject = ['CustomersService', '$compile', '$scope', '$location'];

  function CustomersListController(CustomersService, $compile, $scope, $location) {
    var vm = this;
    vm.currentIndices = {'customer':null, 'order':null, 'shipment':null};
    $location.currentIndices
    vm.customers = CustomersService.query();

    vm.getItemData = function() {
      var customers = vm.customers;
      var px_tree = document.querySelector('px-tree');
      var selectedShipment = px_tree.selected;
      var selectedPath = px_tree.selectedRoute;
      $location.testMe 
      if (selectedPath <= 1)
        return;
    
      let shipmentID = selectedShipment.id;
      let customerID = selectedPath[0];
      let orderID = selectedPath[1];

      if (selectedPath.length === 2) 
        shipmentID = -1;

      var found = false;
      let i;
      let j;
      let k;
      // try{
        for (i = 0; i < customers.length; i++) {
          if (customerID === customers[i]._id) {
            vm.currentIndices.customer = i;
            for (j = 0; j < customers[i].orders.length; j++) {              
              if (orderID === customers[i].orders[j].id) {
                vm.currentIndices.order = j;
                for (k = 0; k < customers[i].orders[j].shipments.length; k++) {
                  if (shipmentID === customers[i].orders[j].shipments[k].id) {
                    found = true;
                    vm.currentIndices.shipment = k;
                    break;
                  }
                }
              }
            }
          }
        }
        if(orderID != undefined){
          if (!found){
            pxMapMarkersOrder();
            pxSteps(false);
          }
          else{ 
            pxMapMarkers();
            pxSteps(true);
          }
        
          customerInfo();
          shippingDetails();
          packageDetails();
          packageComments();
        }
      // }
      // catch(TypeError){

      // }
    }
    vm.searchCustomers = function() {
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
    vm.displayActive = function() {
      document.getElementById("myInput").value = "";
      activeInactiveState = "Active";
      activeCustomerList = [];
      for (let i = 0; i < customerList.length; i++) {
        if (customerList[i].isActive === true)
          activeCustomerList.push(customerList[i]);
      }
      pxTreeDisplay(activeCustomerList);
    }
    vm.displayInactive = function() {
      document.getElementById("myInput").value = "";
      activeInactiveState = "Inactive";
      inactiveCustomerList = [];
      for (let i = 0; i < customerList.length; i++) {
        if (customerList[i].isActive === false)
          inactiveCustomerList.push(customerList[i]);
      }
      pxTreeDisplay(inactiveCustomerList);
    }
    vm.displayAll = function() {
      document.getElementById("myInput").value = "";
      activeInactiveState = "All";
      pxTreeDisplay(customerList);
    }
    vm.toggleRightSideBar = function() {
      var x = document.getElementById('hide');
      var y = document.getElementById('MAP_MARKERS');
      var z = document.getElementById('STEPS');
      if (x.style.display === 'block') {
        x.style.display = 'none';
        document.getElementById('MAP_MARKERS').className = "u-5/6";
        document.getElementById('MAP_MARKERS').style.right = "0";
        document.getElementById("STEPS").className = "u-5/6";
        document.getElementById('STEPS').style.right = "0";
      } else {
        x.style.display = 'block';
        document.getElementById('MAP_MARKERS').className = "u-4/6";
        document.getElementById('MAP_MARKERS').style.right = "16.6666667%";
        document.getElementById("STEPS").className = "u-4/6";
        document.getElementById('STEPS').style.right = "16.6666667%";
      }
    }
    vm.newAddComment = function(){
      if(vm.newComment != undefined){
        let commentDate = "";
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        month++;
        if(month < 10)
          month = '0' + month;

        let day = date.getDay();
        if(day < 10)
          day = '0' + day;

        let hour = date.getHours();
        if( hour < 10)
          hour = '0' +  hour;

        let minute = date.getMinutes();
        if( minute < 10)
          minute = '0' +  minute;

        let second = date.getSeconds();
        if( second < 10)
          second = '0' +  second;

        let timezone = date.getTimezoneOffset();
        Math.floor(timezone/60)

        commentDate += year;
        commentDate += '-';
        commentDate += month;
        commentDate += '-';
        commentDate += day;
        commentDate += 'T';
        commentDate += hour;
        commentDate += ':';
        commentDate += minute;
        commentDate += ':';
        commentDate += second;
        commentDate += ' ';
        if(timezone >= 0)
          commentDate += '+';
        else
          commentDate += '-';
        if(Math.floor(timezone/60) < 10)
          commentDate += '0';
        commentDate += Math.floor(timezone/60);
        commentDate += ':';
        if(timezone%60 < 10)
          commentDate += '0';
        commentDate += timezone%60;

       $location.newComment = {
        'comment_date': commentDate,
        'comment' : vm.newComment
       };


      }
    }
    // var customer;
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
        string += "\",\"isSelectable\": true,\"children\":[";
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
    
    
    
    function loading() {
      var spinner = document.querySelector('px-spinner');
      spinner.finished = true;
    }
    
    function pxTree() {
      var customers = vm.customers;
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
        string += "\",\"isSelectable\": true,\"children\":[";
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
      let currentCustomer = vm.customers[vm.currentIndices.customer];
      let currentOrder    = currentCustomer.orders[vm.currentIndices.order];
      let currentShipment;
      if(infoNeeded == true)
         currentShipment = currentOrder.shipments[vm.currentIndices.shipment];
      var string = "<px-steps ";
      string += "items=\'[";
      string += "{\"id\":\"1\", \"label\":\"(ORIGIN) ";
      if(infoNeeded == true){
        if(generalLocationOrigin[vm.currentIndices.shipment] == "")
          string += currentShipment.origin.latitude + "," + currentShipment.origin.longitude;
        else
          string += generalLocationOrigin[vm.currentIndices.shipment];
      }
      string += "\"},";
      string += "{\"id\":\"2\", \"label\":\"(CURRENT) ";
      if(infoNeeded == true){
        if(generalLocationCurrent[vm.currentIndices.shipment] == "")
          string += currentShipment.current_location.latitude + "," + currentShipment.current_location.longitude;
        else
          string += generalLocationCurrent[vm.currentIndices.shipment];
      }        
      string += "\"},";
      string += "{\"id\":\"3\", \"label\":\"(TO) ";
      if(infoNeeded == true){
        if(generalLocationDestination[vm.currentIndices.shipment] == "")
          string += currentShipment.destination.latitude + "," + currentShipment.destination.longitude;
        else
          string += generalLocationDestination[vm.currentIndices.shipment];
      }
      string += "\"}]\' completed=\'[\"1\",\"2\"]\' </px-steps>";

      document.getElementById("STEPS").innerHTML = string;
    }
    
    function pxMapMarkers() {
      let currentCustomer = vm.customers[vm.currentIndices.customer];
      let currentOrder    = currentCustomer.orders[vm.currentIndices.order];
      let currentShipment = currentOrder.shipments[vm.currentIndices.shipment];

      clearMarkers();
      setSingleShipmentOnMap(map, vm.currentIndices.shipment);
      if (flightPathList != null)
        removeLine();
      drawLine(currentShipment.origin, currentShipment.current_location, currentShipment.destination, currentShipment.delivery_state);
    }
    
    function pxMapMarkersOrder() {
      let currentCustomer = vm.customers[vm.currentIndices.customer];
      let currentOrder    = currentCustomer.orders[vm.currentIndices.order];
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
      for (let i = 0; i < currentOrder.shipments.length; i++) {
        addShipmentMarkers(currentOrder.shipments[i], i, currentOrder.shipments.length);
        drawLine(currentOrder.shipments[i].origin, currentOrder.shipments[i].current_location, currentOrder.shipments[i].destination, currentOrder.shipments[i].delivery_state);
        latSum += currentOrder.shipments[i].origin.latitude;
        latSum += currentOrder.shipments[i].current_location.latitude;
        latSum += currentOrder.shipments[i].destination.latitude;
        longSum += currentOrder.shipments[i].origin.longitude;
        longSum += currentOrder.shipments[i].current_location.longitude;
        longSum += currentOrder.shipments[i].destination.longitude;
      }
      let latAvg = latSum / (currentOrder.shipments.length * 3);
      let longAvg = longSum / (currentOrder.shipments.length * 3);
      let avgPos = { lat: latAvg, lng: longAvg };
    
      map.panTo(avgPos);
    }
    
    
    function customerInfo() {
      let currentCustomer = vm.customers[vm.currentIndices.customer];
      let customerInfoElement = document.getElementById("CUSTOMER_INFO").children;
      customerInfoElement[1].innerText  = currentCustomer.name;
      customerInfoElement[4].innerText  = currentCustomer.email;
      customerInfoElement[7].innerText  = currentCustomer.phone;
      customerInfoElement[10].innerText = currentCustomer.address;
    }
    
    function shippingDetails() {
      let currentCustomer = vm.customers[vm.currentIndices.customer];
      let currentOrder    = currentCustomer.orders[vm.currentIndices.order];
      let currentShipment = currentOrder.shipments[vm.currentIndices.shipment];
      if (currentShipment !== undefined) {
        let shipmentInfoElement = document.getElementById("SHIPPING_DETAILS").children;
        shipmentInfoElement[1].innerText  =  currentShipment.id;
        shipmentInfoElement[4].innerText  =  currentShipment.carrier;
        shipmentInfoElement[9].innerText  =  currentShipment.current_location.latitude;
        shipmentInfoElement[12].innerText = currentShipment.current_location.longitude;
        shipmentInfoElement[17].innerText = currentShipment.destination.latitude;
        shipmentInfoElement[20].innerText = currentShipment.destination.longitude;
        shipmentInfoElement[23].innerText = currentShipment.ship_date;
        shipmentInfoElement[26].innerText = currentShipment.expected_date;
        shipmentInfoElement[29].innerText = currentShipment.delivery_state;
      }
    }
    
    function packageDetails() {
      let currentCustomer = vm.customers[vm.currentIndices.customer];
      let currentOrder    = currentCustomer.orders[vm.currentIndices.order];
      let currentShipment = currentOrder.shipments[vm.currentIndices.shipment];
      if (currentShipment !== undefined) {
        let packageInfoElement = document.getElementById("PACKAGE_DETAILS").children;
        packageInfoElement[1].innerText = currentShipment.ship_date;
        packageInfoElement[4].innerText = currentShipment.contents;
        packageInfoElement[7].innerText = currentCustomer.about;
      }
    }
    
    function packageComments(){
      let currentShipment = vm.customers[vm.currentIndices.customer].orders[vm.currentIndices.order].shipments[vm.currentIndices.shipment];
      if (currentShipment !== undefined) {
        if(currentShipment.comments != undefined){
          var string =  "<strong>Comments: </strong><br />";
          for(let i = 0;i < currentShipment.comments.length; i++){
            string += "<strong>" + currentShipment.comments[i].comment_date + "</strong>" + ": ";
            string += currentShipment.comments[i].comment + "<br />";
          }
          document.getElementById("PACKAGE_COMMENTS").innerHTML = string;
        }
      }
    }
    
function displayLocation(latitude, longitude, type) {
  var request = new XMLHttpRequest();
  var method = 'GET';
  var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true';
  var async = false;

  request.open(method, url, async);
  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
      var data = JSON.parse(request.responseText);

      if(data.status=="ZERO_RESULTS"){
        if(type == "origin")
          generalLocationOrigin.push("");

        else if(type == "current")
          generalLocationCurrent.push("");

        else if(type == "destination") 
          generalLocationDestination.push("");

      }else{
        var index_address = data.results.length;
        if(index_address >= 2)
          var address = data.results[index_address-2];
        else{
          if (index_address == 1)
            var address = data.results[0];
          if(index_address < 1){

            return;
          }
        }

        var nogood = false;
        if (address.formatted_address === undefined)
          nogood = true;
        if(type == "origin"){
          //console.log("ORIGIN: ");
          if(nogood == true){
            //console.log("NO GOOD!");
            generalLocationOrigin.push("");
          }
          else{
            //console.log(address.formatted_address);
            generalLocationOrigin.push(address.formatted_address);
          }
          //console.log(generalLocationOrigin);
        }
        else if(type == "current"){
          //console.log("CURRENT: ");
          if(nogood == true){
            //console.log("NO GOOD!");
            generalLocationCurrent.push("");
          }
          else{
            //console.log(address.formatted_address);       
            generalLocationCurrent.push(address.formatted_address);
          }
          //console.log(generalLocationCurrent);
        }    
        else if(type == "destination"){
          //console.log("DESTINATION: ");
          if(nogood == true){
            //console.log("NO GOOD!");
            generalLocationDestination.push("");
          }
          else{
            //console.log(address.formatted_address);       
            generalLocationDestination.push(address.formatted_address);
          }
          //console.log(generalLocationDestination);
        }
      }
    }
  };
  request.send();
}
    
    
    setInterval(consistantTimer, 50);
    
    function consistantTimer() {
      if (customerList.length === 0) 
        pxTree();

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
      if($location.currentIndices != vm.currentIndices)
        $location.currentIndices = vm.currentIndices;
    }
    
    
    function addShipmentMarkers(shipment, index, orderSize) {
      displayLocation(shipment.origin.latitude, shipment.origin.longitude, "origin");
      displayLocation(shipment.current_location.latitude, shipment.current_location.longitude, "current");
      displayLocation(shipment.destination.latitude, shipment.destination.longitude, "destination");

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
      if(generalLocationOrigin[index] == ""){
          formattedLocationOrigin = '<p><b>Coordinates:</b></br>' +                     
                              'Latitude: ' + shipment.origin.latitude + "</br>" + 
                              'Longitude: ' + shipment.origin.longitude + "</br>";
      }else{
        formattedLocationOrigin = '<p><b>Location:</b></br>' +
                                   generalLocationOrigin[index] + '</br>';
      }

      let formattedLocationCurrent;
      if(generalLocationCurrent[index] == ""){
        formattedLocationCurrent= '<p><b>Coordinates:</b></br>' +                     
                                  'Latitude: ' + shipment.current_location.latitude + "</br>" + 
                                  'Longitude: ' + shipment.current_location.longitude + "</br>";
      }else{
        formattedLocationCurrent = '<p><b>Location:</b></br>' +
                                   generalLocationCurrent[index] + '</br>';
      }

      let formattedLocationDestination;
      if(generalLocationDestination[index] == ""){
        formattedLocationDestination = '<p><b>Coordinates:</b></br>' +                     
                                       'Latitude: ' + shipment.destination.latitude + "</br>" + 
                                       'Longitude: ' + shipment.destination.longitude + "</br>";
      }else{
        formattedLocationDestination = '<p><b>Location:</b></br>' +
                                   generalLocationDestination[index] + '</br>';
      }

      let originContentString = '<div id="content">' +
                '<div id="siteNotice">' +
                '</div>' +
                '<h3 id="firstHeading" class="firstHeading">Consignment Origin ' +
                '(' + (index + 1) + ' of ' + orderSize + ')' +
                 '</h3>' +
                '<div id="bodyContent">' +
                formattedLocationOrigin + "</br>" +
                '<b>Date: </b></br>' +
                shipment.ship_date +
                '</p>' +
                '</div>' +
                '<button id="info" ng-click="vm.toggleRightSideBar()"><i class="material-icons">info</i></button></div>' +
                '</div>';
    
      var currentContentString = '<div id="content">' +
                '<div id="siteNotice">' +
                '</div>' +
                '<h3 id="firstHeading" class="firstHeading">Consignment Current Location ' +
                '(' + (index + 1) + ' of ' + orderSize + ')' +
                '</h3>' +
                '<div id="bodyContent">' +
                formattedLocationCurrent +
                "</br>" +
                '<b>Date: </b></br>' +
                shipment.ship_date +
                '</p>' +
                '</div>' +
                '<button id="info" ng-click="vm.toggleRightSideBar()"><i class="material-icons">info</i></button></div>' +
                '</div>';
    
      var destinationContentString = '<div id="content">' +
                '<div id="siteNotice">' + '</div>' +
                '<h3 id="firstHeading" class="firstHeading">Consignment Destination ' +
                '(' + (index + 1) + ' of ' + orderSize + ')' +
                '</h3>' +
                '<div id="bodyContent">' +
                formattedLocationDestination +
                '</br>' +
                '<b>Date: </b></br>' +
                shipment.ship_date +
                '</p>' +
                '</div>' +
                '<button id="info" ng-click="vm.toggleRightSideBar()"><i class="material-icons">info</i></button></div>' +
                '</div>';

      var compiledOrigin = $compile(originContentString)($scope);
      var compiledCurrent = $compile(currentContentString)($scope);
      var compiledDestination = $compile(destinationContentString)($scope);

      let originPinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%41|999999");
    
      let currentPinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld="+(index + 1)+"|"+pinColor);
    
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
        content: compiledOrigin[0]
      });
      let currentInfoWindow = new google.maps.InfoWindow({
        content: compiledCurrent[0]
      });
      let destinationInfoWindow = new google.maps.InfoWindow({
        content: compiledDestination[0]
      });
    
      originInfoWindowList.push(originInfoWindow);
      currentInfoWindowList.push(currentInfoWindow);
      destinationInfoWindowList.push(destinationInfoWindow);

      originMarkersArray[index].addListener('click', function () {
        originInfoWindowList[index].open(map, originMarkersArray[index]);
        vm.currentIndices.shipment = index;
        customerInfo();
        shippingDetails();
        packageDetails();
        packageComments();
      });
      currentMarkersArray[index].addListener('click', function () {
        currentInfoWindowList[index].open(map, currentMarkersArray[index]);
        vm.currentIndices.shipment = index;
        customerInfo();
        shippingDetails();
        packageDetails();
        packageComments();
      });
      destinationMarkersArray[index].addListener('click', function () {
        destinationInfoWindowList[index].open(map, destinationMarkersArray[index]);
        vm.currentIndices.shipment = index;
        customerInfo();
        shippingDetails();
        packageDetails();
        packageComments();
      });
    
      currentMarkersArray[index].setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function () { currentMarkersArray[index].setAnimation(null);}, 750);
    
    
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
    




  }
}());
