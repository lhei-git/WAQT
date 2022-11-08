# This connects to the AirNow API 
# Documentation: https://docs.airnowapi.org/webservices
from calendar import c
import datetime
from tracemalloc import start
from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import os
import json
from datetime import date
from dateutil.relativedelta import relativedelta
import csv
from operator import contains

# API is in secrets
# Do not push API_KEY to GitHub
#Air Now
API_KEY = ""

#AQS
EMAIL = "" 
AQS_KEY = ""
CURRENT_DATE = date.today()

#states
StateAbbrv = {
    "ALABAMA": "AL",
    "ALASKA": "AK",
    "ARIZONA": "AZ",
    "ARKANSAS": "AR",
    "CALIFORNIA": "CA",
    "COLORADO": "CO",
    "CONNECTICUT": "CT",
    "DELAWARE": "DE",
    "FLORIDA": "FL",
    "GEORGIA": "GA",
    "HAWAII": "HI",
    "IDAHO": "ID",
    "ILLINOIS": "IL",
    "INDIANA": "IN",
    "IOWA": "IA",
    "KANSAS": "KS",
    "KENTUCKY": "KY",
    "LOUISIANA": "LA",
    "MAINE": "ME",
    "MARYLAND": "MD",
    "MASSACHUSETTS": "MA",
    "MICHIGAN": "MI",
    "MINNESOTA": "MN",
    "MISSISSIPPI": "MS",
    "MISSOURI": "MO",
    "MONTANA": "MT",
    "NEBRASKA": "NE",
    "NEVADA": "NV",
    "NEW HAMPSHIRE": "NH",
    "NEW JERSEY": "NJ",
    "NEW MEXICO": "NM",
    "NEW YORK": "NY",
    "NORTH CAROLINA": "NC",
    "NORTH DAKOTA": "ND",
    "OHIO": "OH",
    "OKLAHOMA": "OK",
    "OREGON": "OR",
    "PENNSYLVANIA": "PA",
    "RHODE ISLAND": "RI",
    "SOUTH CAROLINA": "SC",
    "SOUTH DAKOTA": "SD",
    "TENNESSEE": "TN",
    "TEXAS": "TX",
    "UTAH": "UT",
    "VERMONT": "VT",
    "VIRGINIA": "VA",
    "WASHINGTON": "WA",
    "WEST VIRGINIA": "WV",
    "WISCONSIN": "WI",
    "WYOMING": "WY",
}
PM25Trends = {}
PM10Trends = {}
OzoneTrends = {}
#function to get air quality trends
def extractTrendData(output, year):
    quarter = 1
    while quarter <= 4:
        PM25Total = 0.0
        PM10Total = 0.0
        OzoneTotal = 0.0
        PM25Count = 0
        PM10Count = 0
        OzoneCount = 0
        for i in range(len(output['Data'])):
            if contains(output['Data'][i]['parameter'], "PM2.5") and contains(output['Data'][i]['quarter'], str(quarter)):
                if(output['Data'][i]['arithmetic_mean']):
                    #print(output['Data'][i]['arithmetic_mean'])
                    PM25Total = PM25Total + output['Data'][i]['arithmetic_mean']
                    PM25Count = PM25Count + 1
                    i = i + 1
                else:
                    i = i + 1
            else:
                i = i + 1
        for i in range(len(output['Data'])):
            if contains(output['Data'][i]['parameter'], "PM10") and contains(output['Data'][i]['quarter'], str(quarter)):
                if(output['Data'][i]['arithmetic_mean']):
                    #print(output['Data'][i]['arithmetic_mean'])
                    PM10Total = PM10Total + output['Data'][i]['arithmetic_mean']
                    PM10Count = PM10Count + 1
                    i = i + 1
                else:
                    i = i + 1
            else:
                i = i + 1
        for i in range(len(output['Data'])):
            if contains(output['Data'][i]['parameter'], "Ozone") and contains(output['Data'][i]['quarter'], str(quarter)):
                if(output['Data'][i]['arithmetic_mean']):
                    #print(output['Data'][i]['arithmetic_mean'])
                    OzoneTotal = OzoneTotal + output['Data'][i]['arithmetic_mean']
                    OzoneCount = OzoneCount + 1
                    i = i + 1
                else:
                    i = i + 1
            else:
                i = i + 1
        if(PM25Count != 0):
            PM25Trends["Q"+str(quarter)+str(year)] = PM25Total / PM25Count
        else:
            PM25Trends["Q"+str(quarter)+str(year)] = 0
        if(PM10Count != 0):
            PM10Trends["Q"+str(quarter)+str(year)] = PM10Total / PM10Count
        else:
            PM10Trends["Q"+str(quarter)+str(year)] = 0
        if(OzoneCount != 0):
            OzoneTrends["Q"+str(quarter)+str(year)] = OzoneTotal / OzoneCount
        else:
            OzoneTrends["Q"+str(quarter)+str(year)] = 0
        
        quarter = quarter + 1
    

#endpoint to access air now data: 
def airNowEndpoint():
    app = Flask(__name__)
    app.config.update(dict(DEBUG=True))
    CORS(app)


    @app.route("/aqi", methods=['GET'])
    def getCurrentAQI():
        #endpoint url sample: localhost:8000/aqi?lat=36.6002&lon=121.8947
        #get these from GMAPS 
        #lat = str(36.6002)
        #lon = str(121.8947)
        lat = request.args.get("lat")
        lon = request.args.get("lon")
        REQUEST_URL = "https://www.airnowapi.org/aq/observation/latLong/current/?format=application/json&latitude="+lat+"&longitude=-"+lon+"&distance=25&API_KEY="+API_KEY
        print(REQUEST_URL)
        r = requests.get(REQUEST_URL)
        with open("outputAQI.txt",'wb') as f:
            f.write(r.content) 
        f.close()
        #read output.txt 
        #contains json response from air now
        responseData = open('outputAQI.txt')
        jsonResponse = json.load(responseData)
        responseData.close()
        #delete the json file
        if os.path.exists("outputAQI.txt"):
            os.remove("outputAQI.txt")
        else:
            print("The file does not exist")
        #print(jsonResponse)
        print(jsonResponse)
        return jsonify(jsonResponse)

    @app.route("/trends", methods=['GET'])
    def getTrends():
        #https://aqs.epa.gov/aqsweb/documents/data_api.html#quarterly
        county = request.args.get("county")
        state = request.args.get("state") 
        with open('fips.csv', newline='') as f:
            reader = csv.reader(f)
            for row in reader:
                if (contains(row[1], county) and contains(row[2], StateAbbrv[state.upper()])):
                    print(str(row[0])[-3:])
                    countyFips = str(row[0])[-3:]
            f.close()
        with open('statefips.csv', newline='') as f:
            reader = csv.reader(f)
            for name in reader:
                if (contains(name[0], state.capitalize())):
                    print(str(name[3]))
                    stateFips = str(name[3])
            f.close
    

        today = datetime.datetime.now()
        endYear = today.year
        year = 2015
        while(endYear >= year):
            url = "https://aqs.epa.gov/data/api/quarterlyData/byCounty?email="+EMAIL+"&key="+AQS_KEY+"&param=88101,44201,81102&bdate="+str(year)+"0101&edate="+str(year)+"1231&state="+stateFips+"&county="+countyFips
            print(url)
            response_API = requests.get(url)
            output = json.loads(response_API.text)

            AllTrends = {}
            extractTrendData(output, year)

            AllTrends["PM25"] = PM25Trends
            AllTrends["PM10"] = PM10Trends
            AllTrends["Ozone"] = OzoneTrends
            year = year + 1

        return jsonify(AllTrends)

    return app


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app = airNowEndpoint()
    app.run(host="0.0.0.0", port=port)