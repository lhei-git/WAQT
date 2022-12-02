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
- Run the front-end `npm start`
- Nativage to localhost:4200 to start using WAQT. 
