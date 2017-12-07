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

### Local Setup

1. Clone this repository onto your localhost 
   - ```
	 git clone git@github.com:CEN3031-13A/gemapapp.git
	 ```
2. Change directory to the repository that you just cloned
   - ```
	 cd gemapapp
	 ```
3. Install the required node modules
   - ```
	 npm install
	 ```
4. Run the server
   - ```
	 gulp
	 ```
5. Go to localhost:3000 in your browser(note firefox is not supported, only chrome)

### Update Database
Currently, our database is pulling data from a file called `generated_shipment_data.json`. The configuration file that handles which file will get pushed into our database is `mongo_resources/JSONtoMongo.js`. Just replace the filepath the line `customers = require('filepath')` into the filepath with your data.
