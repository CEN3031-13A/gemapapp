# <img src="https://vignette.wikia.nocookie.net/logopedia/images/f/f3/General_Electric_1942.png/revision/latest/scale-to-width-down/200?cb=20120817062141" width="50"> GEMAPAPP 

### Deployment
This webapp is currently being deployed at <a href="https://gemapapp.herokuapp.com/" target="blank">https://gemapapp.herokuapp.com/</a>

### API's Used
This webapp used:

- <a href="https://developers.google.com/maps/documentation/javascript">Google Maps Javascript</a>
- <a href="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js">Ajax</a>
- <a href="https://www.webcomponents.org/introduction">Web Components</a>
- <a href="https://www.predix-ui.com/#/home">Predix UI</a>

### App Features/Description
1. Displays all customers on left side of page

    <img src="https://github.com/CEN3031-13A/gemapapp/raw/develop/public/images/LandingPage.png" width="70%">

2. Selecting a customer will display available orders for customer. Selecting an order then displays markers on the map.

    <img src="https://github.com/CEN3031-13A/gemapapp/raw/develop/public/images/SelectedOrder.png" width="70%">
	
3. Selecting an available shipment in an order will single out the shipment on the map.

    <img src="https://github.com/CEN3031-13A/gemapapp/raw/develop/public/images/SelectedShipment.png" width="70%">
	
4. Clicking on any of the markers on the map will bring up a popup with extra information.

    <img src="https://github.com/CEN3031-13A/gemapapp/raw/develop/public/images/SelectedMarker.png" width="70%">
	
5. Clicking on the information icon in the popup will bring out the right sidebar with even more information.

    <img src="https://github.com/CEN3031-13A/gemapapp/raw/develop/public/images/RightSidebar.png" width="70%">
	
6. Filling in the search bar on the right will return a list of customers that match the search.

    <img src="https://github.com/CEN3031-13A/gemapapp/raw/develop/public/images/Search.png" width="70%">

### Local Setup

Clone this repository onto your localhost 

```
git clone git@github.com:CEN3031-13A/gemapapp.git
```

Change directory to the repository that you just cloned

```
cd gemapapp
```

Install the required node modules

```
npm install -g bower
npm install -g gulp
npm install
```

Run the server

```
gulp
```

Go to localhost:3000 in your browser(note firefox is not supported, only chrome)

### Update Database
Currently, our database is pulling data from a file called `generated_shipment_data.json`. The configuration file that handles which file will get pushed into our database is `mongo_resources/JSONtoMongo.js`. Just replace the filepath the line `customers = require('filepath')` into the filepath with your data.
