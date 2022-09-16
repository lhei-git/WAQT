# This connects to the AirNow API 
# Documentation: https://docs.airnowapi.org/webservices
from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import os
import json

# API is in secrets
# Do not push API_KEY to GitHub
API_KEY = ""

#endpoint to access air now data: 
def airNowEndpoint(config=None):
    app = Flask(__name__)
    app.config.update(dict(DEBUG=True))
    app.config.update(config or {})
    CORS(app)

    def downloadData(startDate, startHourUTC, endDate, endHourUTC, parameters, bbox):
        # API parameters
        options = {}
        options["url"] = "https://airnowapi.org/aq/data/"
        options["start_date"] = startDate
        options["start_hour_utc"] = startHourUTC
        options["end_date"] = endDate
        options["end_hour_utc"] = endHourUTC
        options["parameters"] = parameters
        options["bbox"] = bbox
        options["data_type"] = "a"
        options["format"] = "application/json"
        options["ext"] = "json"
        options["api_key"] = API_KEY

        # API request URL
        REQUEST_URL = options["url"] \
                    + "?startdate=" + options["start_date"] \
                    + "t" + options["start_hour_utc"] \
                    + "&enddate=" + options["end_date"] \
                    + "t" + options["end_hour_utc"] \
                    + "&parameters=" + options["parameters"] \
                    + "&bbox=" + options["bbox"] \
                    + "&datatype=" + options["data_type"] \
                    + "&format=" + options["format"] \
                    + "&api_key=" + options["api_key"]
        r = requests.get(REQUEST_URL)
        with open("output.txt",'wb') as f:
            f.write(r.content)

    #endpoint to get all the data
    # Contract: https://docs.airnowapi.org/Data/docs
    # Returns Ozone, PM25, PM10, CO, N02 and S02 Values for a location
    # Sample bounds: -124.205070,28.716781,-75.337882,45.419415
    # Sample date: 2022-09-12T00
    # Will return in json format 
    @app.route("/", methods=['GET'])
    def getAllData():
        startDate = request.args.get("startDate")
        startHourUTC = request.args.get("startHourUTC")
        endDate = request.args.get("endDate")
        endHourUTC = request.args.get("endHourUTC")
        parameters = request.args.get("parameters")
        bbox = request.args.get("bbox")
        downloadData(startDate, startHourUTC, endDate, endHourUTC, parameters, bbox)

        #read output.txt 
        #contains json response from air now
        responseData = open('output.txt')
        jsonResponse = json.load(responseData)
        return jsonResponse
    return app


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app = airNowEndpoint()
    app.run(host="0.0.0.0", port=port)