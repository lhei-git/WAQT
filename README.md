# Wildfire & Air Quality Tracker

The Wildfire & Air Quality Tracker (WAQT) app was developed to provide citizens, scientists, policy makers and the public alike the ability to easily search for air quality and wildfire information for a particular county of interest (currently in the US only). WAQT provides a location’s current air quality measures for Ozone, PM2.5 and PM10—some of the most common air pollutants—based on the US Air Quality Index (AQI). This information is retrieved from the Air Now and EPA AQS application programming interface (API) of the US Environmental Protection Agency (EPA).

WAQT also retrieves the current active wildfires in the searched location from the National Interagency Fire Center API, of the National Interagency Fire Center, and various calculations of historical wildfire data for the searched location, and the entire state, from the Wildland Fire Locations Full History API of the National Interagency Fire Center.


The WAQT app also produces various graphs of the historical trends of the three major pollutants identified from the year 2015 until the most recent data available. This long-term air quality data is pulled from the US EPA Air Quality System (AQS).The application also visualizes historical trends of wildfires, including total wildfires and acres burned from wildfires—when the data is available. Further details about wildfire data calculations are provided below.


# Run Locally
- In a terminal, navigate to `./back-end`
- Install all Python modules: `pip install requirements.txt`
- Insert your Air Now API Key into airnow.py `API_KEY = "KEY_HERE"`
- Insert your AQS API Key into airnow.py `EMAIL = "EMAIL_HERE" AQS_KEY = "KEY_HERE"`
- Run airnow.py `gunicorn --bind 127.0.0.1:8000 airnow:gunicorn_app`
- Run wildfire.py `gunicorn --bind 127.0.0.1:8001 WildFire:gunicorn_app`
- Navigate to the front-end `./front-end/ltaq`
- Install Node modules `npm install --force`
- Insert your Google Maps API key into display.tsx `googleMapsApiKey: "KEY_HERE"`
- In the droplet run: `export NODE_OPTIONS=--max_old_space_size=4096`
- Run for debugging: `npm start`
- Build the front-end `npx nx run ltaq:build --configuration=production `
- Run the front-end `npx nx run ltaq:serve --configuration=production  `
- Navigate to localhost:4200 to start using WAQT. 

# Run on a server
- Add all keys
- `cd ~/WAQT/back-end`
- `gunicorn --certfile fullchain.pem --keyfile privkey.pem -b waqt.lhei.org:8000 airnow:gunicorn_app &`
- `gunicorn --certfile fullchain.pem --keyfile privkey.pem -b waqt.lhei.org:8001 WildFire:gunicorn_app &`
- `cd ~/WAQT/front-end/ltaq`
- `export NODE_OPTIONS=--max_old_space_size=4096`
- `npx nx run ltaq:build --configuration=production &`
- `export NODE_OPTIONS=--max_old_space_size=4096`
- `npx nx run ltaq:serve --configuration=production &`

# Contributing
The code is divided into two sections, the front-end and the back-end. The front-end handles all rendering and styling using React and TypeScript. The back-end handles all API calls and data calculations using Python and Flask.
## Wildfire Code
All wildfire data retrival and logic is located in wildfire.py. Each major piece (trend graphs, current and historical statistics and active wildfires) has an endpoint which the front-end retrives the formatted data from. The front-end renders all wildfire data in activeFireTable.tsx, fireStatsTable.tsx and wildfireGraphs.tsx located in ./front-end/ltaq/src/app
## Air Quality Code
All air quality code is located in airnow.py. The current air quality index and historical air quality trends each have their own endpoint for the front-end to connect to inside airnow.py. You must provide API keys to run this code. All rendering for the air quality code is performed in activeFireTable.tsx, airQualityGraphs.tsx and currentAQITable.tsx. 
## Location Searching Code
All searching is conducted using the Google Maps API. You must provide an API key for this to function. Code for the map is in display.tsx.
