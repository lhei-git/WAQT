# This connects to the AirNow API 
# Documentation: https://docs.airnowapi.org/webservices
from flask import request
import json

# API is in secrets
# Do not push API_KEY to GitHub
API_KEY = ""
app = Flask(__name__)
CORS(app)
# Contract: https://docs.airnowapi.org/CurrentObservationsByZip/docs
# Requires a valid zip code
# Returns a zip code's current AQI in json
@app.route("/getCurrentAQIValuesByZipCode/<zipcode>")
def getCurrentAQIValuesByZipCode(zipCode):
    getCurrentAQIValuesByZipCodeURL = "https://www.airnowapi.org/aq/observation/zipCode/current/?format=application/json&zipCode="+zipCode+"&distance=25&API_KEY="+API_KEY
    getCurrentAQIValuesByZipCodeRequest = requests.get(getCurrentAQIValuesByZipCodeURL)
    return json.dumps(getCurrentAQIValuesByZipCodeRequest)
    
# Contract: https://docs.airnowapi.org/Data/docs
# Returns Ozone, PM25, PM10, CO, N02 and S02 Values for a location
# Sample bounds: -124.205070,28.716781,-75.337882,45.419415
# Sample date: 2022-09-12T00
# Will return in json format 
@app.route("/getAllData/<minX>,<minY>,<maxX>,<maxY>,<startdate>,<enddate>")
def getAllData(minX, minY, maxX, maxY, startDate, endDate):
    getAllDataURL = """
    https://www.airnowapi.org/aq/data/?startDate="""+startDate+"""&endDate="""+endDate+"""
    &parameters=OZONE,PM25,PM10,CO,NO2,SO2
    BBOX="""+minX+","+minY+","+maxX+","+maxY+","+"""
    &dataType=B&format=application/json&verbose=0&monitorType=2&includerawconcentrations=0&
    API_KEY="""+API_KEY
    getAllDataRequest = requests.get(getAllDataURL)
    return json.dumps(getAllDataRequest)

