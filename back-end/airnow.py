# This connects to the AirNow API 
# Documentation: https://docs.airnowapi.org/webservices
from flask import request
import json

# API is in secrets
# Do not push API_KEY to GitHub
API_KEY = ""

# Contract: https://docs.airnowapi.org/CurrentObservationsByZip/docs
# Requires a valid zip code
# Returns a zip code's current AQI in json
def getCurrentAQIValuesByZipCode(zipcode):
    getCurrentAQIValuesByZipCodeURL = "https://www.airnowapi.org/aq/observation/zipCode/current/?format=application/json&zipCode="+zipCode+"&distance=25&API_KEY="+API_KEY
    getCurrentAQIValuesByZipCodeRequest = requests.get(getCurrentAQIValuesByZipCodeURL)
    return json.dumps(getCurrentAQIValuesByZipCodeRequest)
    

def getAllData(minX, minY, maxX, maxY):
    getAllDataURL = """
    https://www.airnowapi.org/aq/data/?startDate=2022-09-11T01&endDate=2022-09-11T02&parameters=PM25&
    BBOX="""+minX+","+minY+","+maxX+","+maxY+","+"""
    &dataType=A&format=text/csv&verbose=0&monitorType=0&includerawconcentrations=0&
    API_KEY="""+API_KEY
    getAllDataRequest = requests.get(getAllDataURL)
    return json.dumps(getAllDataRequest)

