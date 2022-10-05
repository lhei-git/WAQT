# This connects to the AirNow API 
# Documentation: https://docs.airnowapi.org/webservices
from tracemalloc import start
from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import os
import json
from datetime import date

# API is in secrets
# Do not push API_KEY to GitHub
API_KEY = ""

#endpoint to access air now data: 
def airNowEndpoint(config=None):
    app = Flask(__name__)
    app.config.update(dict(DEBUG=True))
    app.config.update(config or {})
    CORS(app)

    #this function sets up the url and downloads the json 
    
    def downloadDataBBOX(startDate, endDate, parameters, bbox):
        # API request URL
        REQUEST_URL = "https://www.airnowapi.org/aq/data/?startDate="+startDate+"&endDate="+endDate+"&parameters="+ parameters+"&BBOX="+bbox+"&dataType=B&format=application/json&verbose=0&monitorType=2&includerawconcentrations=0&API_KEY="+API_KEY
        print(REQUEST_URL)
        r = requests.get(REQUEST_URL)
        with open("output.txt",'wb') as f:
            f.write(r.content)
    
    #endpoint to get all the data
    # Contract: https://docs.airnowapi.org/Data/docs
    # Returns Ozone, PM25, PM10, CO, N02 and S02 Values for a location
    # Sample bounds: -83.553673,42.029418,-82.871707,42.451216	
    # Sample date: 2022-09-12T00
    # Will return in json format 
    def getAllData(startDate, endDate, parameters, bbox):   

        downloadDataBBOX(startDate, endDate, parameters, bbox)
        #example paramaters:
        #downloadData("2022-09-17T16","2022-09-17T17","PM25", "-83.553673,42.029418,-82.871707,42.451216")

        #read output.txt 
        #contains json response from air now
        responseData = open('output.txt')
        jsonResponse = json.load(responseData)
        #delete the json file
        if os.path.exists("output.txt"):
            os.remove("output.txt")
        else:
            print("The file does not exist")
        #print(jsonResponse)
        return jsonify(jsonResponse)

    #This grabs pm 2.5 values for a bounding box
    #sample request url: localhost:8000/pm25?startDate=2022-09-17T16&endDate=2022-09-17T17&bbox=-83.553673,42.029418,-82.871707,42.451216
    @app.route("/pm25", methods=['GET'])
    def getPM25():
        #get url parameters 
        startDate = request.args.get("startDate")
        endDate = request.args.get("endDate")
        bbox = request.args.get("bbox")
        #retrieve json data (this method only calls for pm2.5)
        return getAllData(str(startDate), str(endDate), "PM25", str(bbox))
    
    @app.route("/all", methods=['GET'])
    def getAllAQI():
        #get url parameters 
        startDate = request.args.get("startDate")
        endDate = request.args.get("endDate")
        bbox = request.args.get("bbox")
        #retrieve json data (this method only calls for pm2.5)
        return getAllData(str(startDate), str(endDate), "OZONE,PM25,PM10,CO,SO2", str(bbox))

    @app.route("/aqi", methods=['GET'])
    def getCurrentAQI():
        #get these from GMAPS 
        lat = str(36.6002)
        lon = str(121.8947)
        REQUEST_URL = "https://www.airnowapi.org/aq/observation/latLong/current/?format=application/json&latitude="+lat+"&longitude=-"+lon+"&distance=25&API_KEY="+API_KEY
        print(REQUEST_URL)
        r = requests.get(REQUEST_URL)
        with open("outputAQI.txt",'wb') as f:
            f.write(r.content) 
        #read output.txt 
        #contains json response from air now
        responseData = open('outputAQI.txt')
        jsonResponse = json.load(responseData)
        #delete the json file
        if os.path.exists("outputAQI.txt"):
            os.remove("outputAQI.txt")
        else:
            print("The file does not exist")
        #print(jsonResponse)
        print(jsonResponse)
        return jsonify(jsonResponse)

    return app


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app = airNowEndpoint()
    app.run(host="0.0.0.0", port=port)