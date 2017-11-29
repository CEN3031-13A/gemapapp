(function () {
  'use strict';

  angular
    .module('customers')
    .controller('CustomersListController', CustomersListController);

  CustomersListController.$inject = ['CustomersService', '$compile', '$scope', '$location'];

  function CustomersListController(CustomersService, $compile, $scope, $location) {
    var vm = this;
    // Stores the current customer's, order's, and shipment's current index.
    vm.currentIndices = {'customer':null, 'order':null, 'shipment':null};
    // Used to transfer the indices over to the other customer client controller.
    $location.currentIndices;
    // Pulls the customer list from the DB.
    vm.customers = CustomersService.query();


    // Used to animate the right sidebar.
    document.getElementById('MAP_MARKERS').style.width = "83.3333333333%";
    document.getElementById('STEPS').style.width = "83.3333333333%";
    document.getElementById('hide').style.width = "0";

    /*  Function: getItemData()
    *   Description:  Gets selected item from customer tree in the view
    *                 Determines if selected item is a shipment or order
    *                 Tracks the hierarchy of the path to the selected item.
    */
    vm.getItemData = function() {
      closeAllInfoWindows();
      var customers = vm.customers;
      //Selects treee component from the view
      //Predix px-tree api is used to obtain selected items and hierarchy
      var px_tree = document.querySelector('px-tree');
      var selectedShipment = px_tree.selected;
      var selectedPath = px_tree.selectedRoute;

      $location.testMe 

      //If a customer is selected clear markers and lines
      if (selectedPath.length <= 1){
        clearMarkers();
        if (flightPathList != null)
          removeLine();
        return;
      }
    
      let shipmentID = selectedShipment.id;
      let customerID = selectedPath[0];
      let orderID = selectedPath[1];

      if (selectedPath.length === 2) 
        shipmentID = -1;

      var found = false;
      let i;
      let j;
      let k;
      //Loops through array of customers to find selected item id
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
          //Set the markers for an entire order
          if (!found){
            displayShipmentMapElementsOrder();
            displayRelativeShipmentLocation(false);
          }
          //Set the markers for one shipment
          else{ 
            displayShipmentMapElements();
            displayRelativeShipmentLocation(true);
          }
          console.log("HELP")
          customerInfo();
          shippingDetails();
          packageDetails();
          packageComments();
        }
    }

    /*  Function: searchCustomers()
    *   Description:  Uses a regular expression to search through the sort
    *                 through the active, inactive, and complete customers
    *                 lists and display them in the left tree.
    */
    vm.searchCustomers = function() {
      // console.log(vm.searchText)
      var customerListSearch = [];
      if (activeInactiveState === 'Active') {
        if (vm.searchText === "") {
          displayCustomerTree(activeCustomerList);
          return;
        }
        for (let i = 0; i < activeCustomerList.length; i++) {
          let regularExpression = new RegExp(vm.searchText, 'i');
          if (activeCustomerList[i].name.search(regularExpression) !== -1)
            customerListSearch.push(activeCustomerList[i]);
        }
        displayCustomerTree(customerListSearch);
      } else if (activeInactiveState === 'Inactive') {
        if (vm.searchText === "") {
          displayCustomerTree(inactiveCustomerList);
          return;
        }
        for (let i = 0; i < inactiveCustomerList.length; i++) {
          let regularExpression = new RegExp(vm.searchText, 'i');
          if (inactiveCustomerList[i].name.search(regularExpression) !== -1)
            customerListSearch.push(inactiveCustomerList[i]);
        }
        displayCustomerTree(customerListSearch);
      } else {
        if (vm.searchText === "") {
          displayCustomerTree(customerList);
          return;
        }
        for (let i = 0; i < customerList.length; i++) {
          let regularExpression = new RegExp(vm.searchText, 'i');
          if (customerList[i].name.search(regularExpression) !== -1)
            customerListSearch.push(customerList[i]);
        }
        displayCustomerTree(customerListSearch);
      }
    }

    /*  Function: displayActive()
    *   Description: Creates a list of the active cutstomers
    *                Calls function to display list.
    */
    vm.displayActive = function() {
      document.getElementById("myInput").value = "";
      activeInactiveState = "Active";
      activeCustomerList = [];
      for (let i = 0; i < customerList.length; i++) {
        if (customerList[i].isActive === true)
          activeCustomerList.push(customerList[i]);
      }
      displayCustomerTree(activeCustomerList);
    }

    /*  Function: displayInactive()
    *   Description:  Creates a list of the inactive customers
    *                 Calls function to display list.
    */
    vm.displayInactive = function() {
      document.getElementById("myInput").value = "";
      activeInactiveState = "Inactive";
      inactiveCustomerList = [];
      for (let i = 0; i < customerList.length; i++) {
        if (customerList[i].isActive === false)
          inactiveCustomerList.push(customerList[i]);
      }
      displayCustomerTree(inactiveCustomerList);
    }

    /*  Function: displayAll()
    *   Description:  Displays all customers
    */
    vm.displayAll = function() {
      document.getElementById("myInput").value = "";
      activeInactiveState = "All";
      displayCustomerTree(customerList);
    }

    /*  Function: toggleRightSidebar()
    *   Description:  Toggles the right sidebar and resizes components on the app.
    */
    vm.toggleRightSideBar = function() {
      var x = document.getElementById('hide');
      var y = document.getElementById('MAP_MARKERS');
      var z = document.getElementById('STEPS');
      if (rightSideBarIsDisplayed === true) {
        if(rightSideBarTimerOut == undefined && rightSideBarTimerIn == undefined){
          // x.style.display = 'none';
          document.getElementById('MAP_MARKERS').style.right = "0";
          document.getElementById('STEPS').style.right = "0";
          rightSideBarTimerIn = setInterval(rightSideBarIn, 1);
          rightSideBarIsDisplayed = false;
        }
      } else {
        if(rightSideBarTimerOut == undefined && rightSideBarTimerIn == undefined){
          // x.style.display = 'block';
          document.getElementById('MAP_MARKERS').style.left = "16.6666667%";
          document.getElementById('STEPS').style.left = "16.6666667%";
          rightSideBarTimerOut = setInterval(rightSideBarOut, 1);
          rightSideBarIsDisplayed = true;
        }
      }
    }


    /*  Function: newAddComment()
    *   Description:  Adds new comment and formats the time it was made.
    */
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

    /* Global variables */
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

    var inAnimation = false;
    var currentInfoWindow;

    var flightPathList = [];

    var displayedGMapsErrorMsg = false;

    var generalLocationOrigin = [];      
    var generalLocationCurrent = [];     
    var generalLocationDestination = []; 

    var rightSideBarIsDisplayed = false
    var rightSideBarTimerIn;
    var inVal = 0;
    var rightSideBarTimerOut;
    var outVal = 0;
      

    /*  Function: displayCustomerTree()
    *   Input: List of customers
    *   Description:  Formats list of customers alphabetically
    *                 Rewrites px-tree and injects it into Predix component.
    */
    function displayCustomerTree(customerListSearch) {
      //Sort customer list alphabetically
      customerListSearch.sort(function (a, b) {
        if (a.name.toUpperCase() < b.name.toUpperCase())
          return -1;
        if (a.name.toUpperCase() > b.name.toUpperCase())
          return 1;
        return 0;
      });

      var treeElement = document.getElementById("TEST11");

      //Rewrite string to inject into Predix px-tree component
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
      
      //Inject Predix component with concatenated string
      treeElement.attributes.items.value = string;
    }
    
    /*  Function: constructCustomerTree()
    *   Description:  Constructs the tree layout for the quireied customer
    *                 data.
    */
    function constructCustomerTree() {
      var customers = vm.customers;
      //Sort customer list alphabetically
      customers.sort(function (a, b) {
        if (a.name.toUpperCase() < b.name.toUpperCase())
          return -1;
        if (a.name.toUpperCase() > b.name.toUpperCase())
          return 1;
        return 0;
      });

      var treeElement = document.getElementById("TEST11");
      
      //Rewrite string to inject into Predix px-tree component
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
      
      //Inject Predix component with concatenated string
      treeElement.attributes.items.value = string;
    
    }
    
    /*  Function: displayRelativeShipmentLocation()
    *   Input: Boolean -- true is a shipment is currently chosen, false if an order is chosen
    *   Description:  Rewrite html for Predix px-steps component
    *                 If an order is chosen no content is shown in the component
    *                 If a shipment is chosen the location is shown
    *                     --if location of shipment is undefined the longitude and latitude are displayed. 
    */
    function displayRelativeShipmentLocation(infoNeeded) {
      //Set variables for the current customer and order selected
      let currentCustomer = vm.customers[vm.currentIndices.customer];
      let currentOrder    = currentCustomer.orders[vm.currentIndices.order];
      let currentShipment;

      //InfoNeeded indicates that a shipment has been selected and info needs to be displayed
      //Therefore the currentShipment is defined
      if(infoNeeded == true)
         currentShipment = currentOrder.shipments[vm.currentIndices.shipment];

      var string = "<px-steps ";
      string += "items=\'[";
      string += "{\"id\":\"1\", \"label\":\"(ORIGIN) ";

      //If a shipment is selected display needed information in the component
      if(infoNeeded == true){
        //If location is undefined display the longitude and latitude
        if(generalLocationOrigin[vm.currentIndices.shipment] == "")
          string += currentShipment.origin.latitude + "," + currentShipment.origin.longitude;
        //Display location
        else
          string += generalLocationOrigin[vm.currentIndices.shipment];
      }

      string += "\"},";
      string += "{\"id\":\"2\", \"label\":\"(CURRENT) ";

      //If a shipment is selected display needed information in the component
      if(infoNeeded == true){
        //If location is undefined display the longitude and latitude
        if(generalLocationCurrent[vm.currentIndices.shipment] == "")
          string += currentShipment.current_location.latitude + "," + currentShipment.current_location.longitude;
        //Display location
        else
          string += generalLocationCurrent[vm.currentIndices.shipment];
      } 

      string += "\"},";
      string += "{\"id\":\"3\", \"label\":\"(TO) ";

      //If a shipment is selected display needed information in the component
      if(infoNeeded == true){
        //If location is undefined display the longitude and latitude
        if(generalLocationDestination[vm.currentIndices.shipment] == "")
          string += currentShipment.destination.latitude + "," + currentShipment.destination.longitude;
        //Display location
        else
          string += generalLocationDestination[vm.currentIndices.shipment];
      }

      string += "\"}]\' completed=\'[\"1\",\"2\"";

      //If the current location is at the destination then mark the desination location
      if(infoNeeded){
        if(currentShipment.current_location.latitude == currentShipment.destination.latitude){
          if(currentShipment.current_location.longitude == currentShipment.destination.longitude){
            string += ",\"3\"";
          }
        }
      }

      string += "]\'+</px-steps>";


      document.getElementById("STEPS").innerHTML = string;
    }
    
    /*  Function: displayShipmentMapElements()
    *   Description: Places markers and draws lines on map for a specific shipment.
    */
    function displayShipmentMapElements() {
      //Variables for the currently selected customer, order and shipment
      let currentCustomer = vm.customers[vm.currentIndices.customer];
      let currentOrder    = currentCustomer.orders[vm.currentIndices.order];
      let currentShipment = currentOrder.shipments[vm.currentIndices.shipment];

      clearMarkers(); //Clears markers currently on the map
      setSingleShipmentOnMap(map, vm.currentIndices.shipment);  //Places markers on the amp

      if (flightPathList != null)
        removeLine();

      //Draws lines between markers
      drawLine(currentShipment.origin, currentShipment.current_location, currentShipment.destination, currentShipment.delivery_state);
    }
    
    /*  Function: displayShipmentMapElementsOrder()
    *   Description:  Places markers and draws lines on map for every shipment in an order.
    */
    function displayShipmentMapElementsOrder() {
      //Variables for the currently selected customer, order
      let currentCustomer = vm.customers[vm.currentIndices.customer];
      let currentOrder    = currentCustomer.orders[vm.currentIndices.order];
      if (flightPathList != null)
        removeLine();
        
      clearMarkers(); //Clears markers already on the map

      //Clears arrays for origin, current and destination markers
      originMarkersArray = [];
      currentMarkersArray = [];
      destinationMarkersArray = [];

      //Clears arrays for origin, current and destination info window lists
      originInfoWindowList = [];
      currentInfoWindowList = [];
      destinationInfoWindowList = [];

      //Clears arrays for origin, current and destination general locations
      generalLocationOrigin = [];      
      generalLocationCurrent = [];     
      generalLocationDestination = [];

      //Finds average point of location to zoom on the map
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
      
      //Zooms to average location on the map
      map.panTo(avgPos);
    }
    
    /*  Function: customerInfo()
    *   Description: Injects data from the database into right sidebar.
    */
    function customerInfo() {
      let currentCustomer = vm.customers[vm.currentIndices.customer];
      let customerInfoElement = document.getElementById("CUSTOMER_INFO").children;
      customerInfoElement[1].innerText  = currentCustomer.name;
      customerInfoElement[4].innerText  = currentCustomer.age;
      customerInfoElement[7].innerText  = currentCustomer.email;
      customerInfoElement[10].innerText  = currentCustomer.phone;
      customerInfoElement[13].innerText = currentCustomer.address;
      customerInfoElement[16].innerText = currentCustomer.registered;
      customerInfoElement[19].innerText = currentCustomer.about;
    }
    
    /*  Function: shippingDetails()
    *   Description: Injects data from the database into right sidebar
    */
    function shippingDetails() {
      let currentCustomer = vm.customers[vm.currentIndices.customer];
      let currentOrder    = currentCustomer.orders[vm.currentIndices.order];
      let currentShipment = currentOrder.shipments[vm.currentIndices.shipment];
      if (currentShipment !== undefined) {
        let shipmentInfoElement = document.getElementById("SHIPPING_DETAILS").children;
        shipmentInfoElement[1].innerText  =  currentShipment.tracking_number;
        shipmentInfoElement[4].innerText  =  currentShipment.carrier;
        shipmentInfoElement[7].innerText  =  currentShipment.delivery_state;
        shipmentInfoElement[10].innerText  =  currentShipment.late_penalties;
        shipmentInfoElement[15].innerText  =  currentShipment.current_location.latitude;
        shipmentInfoElement[18].innerText = currentShipment.current_location.longitude;
        shipmentInfoElement[23].innerText = currentShipment.destination.latitude;
        shipmentInfoElement[26].innerText = currentShipment.destination.longitude;
        shipmentInfoElement[29].innerText = currentShipment.ship_date;
        shipmentInfoElement[32].innerText = currentShipment.expected_date;
        shipmentInfoElement[35].innerText = currentShipment.delivery_state;
      }
    }
    
    /*  Function: packageDetails()
    *   Description: Injects data from the database into right sidebar.
    */
    function packageDetails() {
      let currentCustomer = vm.customers[vm.currentIndices.customer];
      let currentOrder    = currentCustomer.orders[vm.currentIndices.order];
      let currentShipment = currentOrder.shipments[vm.currentIndices.shipment];
      if (currentShipment !== undefined) {
        let packageInfoElement = document.getElementById("PACKAGE_DETAILS").children;
        packageInfoElement[1].innerText = currentShipment.ship_date;
        let contents = "";
        for(let i = 0; i < currentShipment.contents.length; i++){
          contents += currentShipment.contents[i];
          contents += ", ";
        }
        packageInfoElement[4].innerText = contents.substring(0,contents.length-2);
      }
    }
    
    /*  Function: packageComments()
    *   Description: Injects data from the database into right sidebar
    */
    function packageComments(){
      let currentShipment = vm.customers[vm.currentIndices.customer].orders[vm.currentIndices.order].shipments[vm.currentIndices.shipment];
      if (currentShipment !== undefined) {
        if(currentShipment.comments != undefined){
          var string =  "";
          for(let i = 0;i < currentShipment.comments.length; i++){
      string += '<px-accordion disabled=true style=font-weight:normal header-value="';
      string += currentShipment.comments[i].comment_date;
      string += '"></px-accordion><span style=font-weight:normal>'
            string += currentShipment.comments[i].comment + '</span><br />';
          }
          document.getElementById("PACKAGE_COMMENTS").innerHTML = string;
        }
      }
    }
    
    /*  Function: displayLocation()
    *   Input: latitude, longitude -- location coordinates
    *          type -- specifies whether the location is an origin,current or destination position
    *   Description: Injects data from the database into right sidebar
    */
    function displayLocation(latitude, longitude, type) {
      //Initialize HTTP request
      var request = new XMLHttpRequest();
      var method = 'GET';
      var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true';
      var async = false; //Should be synchronous

      request.open(method, url, async);
      request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
          //Parse data received from request
          var data = JSON.parse(request.responseText);

          //If the location is undefined push an empty string into the array
          if(data.status=="ZERO_RESULTS"){
            if(type == "origin")
              generalLocationOrigin.push("");

            else if(type == "current")
              generalLocationCurrent.push("");

            else if(type == "destination") 
              generalLocationDestination.push("");

          }
          //Otherwise retrieve the location of the area and country
          else{
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

            var undefinedAddress = false;
            if (address.formatted_address === undefined)
              undefinedAddress = true;
            //If the address is undefined push an empty string otherwise pusht the formatted address
            if(type == "origin")
            {
              if(undefinedAddress == true)
                generalLocationOrigin.push("");
              else
                generalLocationOrigin.push(address.formatted_address); 
            }
            else if(type == "current")
            {
              if(undefinedAddress == true)
                generalLocationCurrent.push("");      
              else       
                generalLocationCurrent.push(address.formatted_address);
            }   
            else if(type == "destination")
            {
              if(undefinedAddress == true)
                generalLocationDestination.push("");
              else      
                generalLocationDestination.push(address.formatted_address);
            }
          }
        }
      };
      request.send();
    }
    
    setInterval(consistantTimer, 50);
    
    /*  Function: consistantTimer() 
    *   Description:  Used to initialize the data throughout
    *                 the web app and wait for Google Maps to load
    */
    function consistantTimer() {
      if (customerList.length === 0) 
        constructCustomerTree();

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
    
    /*  Function: addShipmentMarker()
    *   Description:  Adds a Google Maps marker for a given shipment.
    */
    function addShipmentMarkers(shipment, index, orderSize) {
      displayLocation(shipment.origin.latitude, shipment.origin.longitude, "origin");
      displayLocation(shipment.current_location.latitude, shipment.current_location.longitude, "current");
      displayLocation(shipment.destination.latitude, shipment.destination.longitude, "destination");

      let pinColor;
    
      if (shipment.delivery_state === "Ahead of Time")
        pinColor = "00C300";
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
                '<button id="markerInfo" ng-click="vm.toggleRightSideBar()"><i class="material-icons">info</i></button></div>' +
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
                '<button id="markerInfo" ng-click="vm.toggleRightSideBar()"><i class="material-icons">info</i></button></div>' +
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
                '<button id="markerInfo" ng-click="vm.toggleRightSideBar()"><i class="material-icons">info</i></button></div>' +
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
        closeAllInfoWindows();
        originInfoWindowList[index].open(map, originMarkersArray[index]);
        vm.currentIndices.shipment = index;
        displayRelativeShipmentLocation(true);
        customerInfo();
        shippingDetails();
        packageDetails();
        packageComments();
      });
      currentMarkersArray[index].addListener('click', function () {
        closeAllInfoWindows();
        currentInfoWindowList[index].open(map, currentMarkersArray[index]);
        vm.currentIndices.shipment = index;
        displayRelativeShipmentLocation(true);
        customerInfo();
        shippingDetails();
        packageDetails();
        packageComments();
      });
      destinationMarkersArray[index].addListener('click', function () {
        closeAllInfoWindows();
        destinationInfoWindowList[index].open(map, destinationMarkersArray[index]);
        vm.currentIndices.shipment = index;
        displayRelativeShipmentLocation(true);
        customerInfo();
        shippingDetails();
        packageDetails();
        packageComments();
      });
    
      currentMarkersArray[index].setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function () { currentMarkersArray[index].setAnimation(null);}, 750);
    }

    /*  Function: setSingleShipmentOnMap()
    *   Inputs:  map -- The Google Maps opbject
    *            index -- Index of the current shipment 
    *   Description:  Draws a line and adds markers for a given shipment 
    *                 in the current order.
    */
    function setSingleShipmentOnMap(map, index) {
      originMarkersArray[index].setMap(map);
      currentMarkersArray[index].setMap(map);
      destinationMarkersArray[index].setMap(map);
      map.panTo(currentMarkersArray[index].position);
      currentMarkersArray[index].setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function () { currentMarkersArray[index].setAnimation(null); }, 750);
    }
    
    /*  Function: setMapOnAll()
    *   Inputs:  map -- The Google Maps opbject
    *   Description:  Used to set all markers to a given value.
    */
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
    
    /*  Function: clearMarkers()
    *   Description:  Used to clear all markers from the map.
    */
    function clearMarkers() {
      setMapOnAll(null);
    }
    
    /*  Function: drawLine()
    *   Inputs:  origin, current, destination -- passed location objects for the current shipment.
    *            state -- delivery state of the shipment
    *   Description:  Draws lines between the three passed locations and colors
    *                 the line depending on the state. 
    */
    function drawLine(origin, current, destination, state) {
      let lineCoordinates = [
        { lat: origin.latitude, lng: origin.longitude },
        { lat: current.latitude, lng: current.longitude },
        { lat: destination.latitude, lng: destination.longitude }
      ];
      var lineColor;
      switch (state) {
        case 'Ahead of Time':
          lineColor = '#00C300';
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
    
    /*  Function: removeLine()
    *   Description:  Removes a line from the map.
    */
    function removeLine() {
      for (let i = 0; i < flightPathList.length; i++)
        flightPathList[i].setMap(null);
    }

    /*  Function: rightSideBarOut()
    *   Description:  Animates the right sidebar entering the view.
    */
    function rightSideBarOut(){
      outVal += 0.035;
      let val = (50.0/3.0)*Math.sin(outVal + Math.PI/2.0)+(66+(2.0/3.0));
      let val1= 83.3333333333 - val;
      document.getElementById('MAP_MARKERS').style.width = val+"%";
      document.getElementById('STEPS').style.width = val+"%";
      document.getElementById('hide').style.width = val1+"%";
      if(val <= 66.9){
        outVal =0;
        document.getElementById('MAP_MARKERS').style.width = "66.666666667%";
        document.getElementById('STEPS').style.width = "66.666666667%";
        document.getElementById('hide').style.width = "16.6666666667%";
        clearInterval(rightSideBarTimerOut);
        rightSideBarTimerOut = undefined;
      }
    }

    /*  Function: rightSideBarIn()
    *   Description:  Animates the right sidebar leaving the view.
    */
    function rightSideBarIn(){
      inVal += 0.035;
      let val = (50.0/3.0)*Math.sin(inVal )+(66+(2.0/3.0));
      let val1 = 83.3333333333 - val;
      document.getElementById('MAP_MARKERS').style.width = val+"%";
      document.getElementById('STEPS').style.width = val+"%";
      document.getElementById('hide').style.width = val1+"%";
      if(val >= 83.1){
        inVal =0;
        document.getElementById('MAP_MARKERS').style.width = "83.3333333333%";
        document.getElementById('STEPS').style.width = "83.3333333333%";
        document.getElementById('hide').style.width = "0%";
        clearInterval(rightSideBarTimerIn);
        rightSideBarTimerIn = undefined;
      }
    }

    /*  Function: closeAllInfoWindows()
    *   Description:  Closes all marker info windows.
    */
    function closeAllInfoWindows() {
      if(originInfoWindowList != undefined){
        for (var i=0;i<originInfoWindowList.length;i++) {
            originInfoWindowList[i].close();
        }
      }
      if(currentInfoWindowList != undefined){
        for (var i=0;i<currentInfoWindowList.length;i++) {
            currentInfoWindowList[i].close();
        }
      }
      if(destinationInfoWindowList != undefined){
        for (var i=0;i<destinationInfoWindowList.length;i++) {
            destinationInfoWindowList[i].close();
        }
      }
    }
  }
}());
