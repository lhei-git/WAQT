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
    "AL": "ALABAMA",
    "AK": "ALASKA",
    "AZ": "ARIZONA",
    "AR": "ARKANSAS",
    "CA": "CALIFORNIA",
    "CO": "COLORADO",
    "CT": "CONNECTICUT",
    "DE": "DELAWARE",
    "FL": "FLORIDA",
    "GA": "GEORGIA",
    "HI": "HAWAII",
    "ID": "IDAHO",
    "IL": "ILLINOIS",
    "IN": "INDIANA",
    "IA": "IOWA",
    "KS": "KANSAS",
    "KY": "KENTUCKY",
    "LA": "LOUISIANA",
    "ME": "MAINE",
    "MD": "MARYLAND",
    "MA": "MASSACHUSETTS",
    "MI": "MICHIGAN",
    "MN": "MINNESOTA",
    "MS": "MISSISSIPPI",
    "MO": "MISSOURI",
    "MT": "MONTANA",
    "NE": "NEBRASKA",
    "NV": "NEVADA",
    "NH": "NEW HAMPSHIRE",
    "NJ": "NEW JERSEY",
    "NM": "NEW MEXICO",
    "NY": "NEW YORK",
    "NC": "NORTH CAROLINA",
    "ND": "NORTH DAKOTA",
    "OH": "OHIO",
    "OK": "OKLAHOMA",
    "OR": "OREGON",
    "PA": "PENNSYLVANIA",
    "RI": "RHODE ISLAND",
    "SC": "SOUTH CAROLINA",
    "SD": "SOUTH DAKOTA",
    "TN": "TENNESSEE",
    "TX": "TEXAS",
    "UT": "UTAH",
    "VT": "VERMONT",
    "VA": "VIRGINIA",
    "WA": "WASHINGTON",
    "WV": "WEST VIRGINIA",
    "WI": "WISCONSIN",
    "WY": "WYOMING",
}
PM25Trends = {}
PM10Trends = {}
OzoneTrends = {}
#function to get air quality trends
def extractTrendData(output, year):
    global PM25Trends
    global PM10Trends 
    global OzoneTrends  
    #this represents 4 quarters in a year
    quarter = 1
    while quarter <= 4:
        PM25Total = 0.0
        PM10Total = 0.0
        OzoneTotal = 0.0
        try:
            #loop through the api output and grab the max values for that quarter
            for i in range(len(output['Data'])):
                if contains(output['Data'][i]['parameter'], "PM2.5") and contains(output['Data'][i]['quarter'], str(quarter)) and int(output['Data'][i]['year']) == year:
                    if(output['Data'][i]['maximum_value']):
                        #print(output['Data'][i]['arithmetic_mean'])
                        if(PM25Total < float(output['Data'][i]['maximum_value'])):
                            PM25Total = float(output['Data'][i]['maximum_value'])

            for i in range(len(output['Data'])):
                if contains(output['Data'][i]['parameter'], "PM10") and contains(output['Data'][i]['quarter'], str(quarter)) and int(output['Data'][i]['year']) == year:
                    if(output['Data'][i]['maximum_value']):
                        #print(output['Data'][i]['arithmetic_mean'])
                        if(PM25Total < float(output['Data'][i]['maximum_value'])):
                            PM10Total = float(output['Data'][i]['maximum_value'])

            for i in range(len(output['Data'])):
                if contains(output['Data'][i]['parameter'], "Ozone") and contains(output['Data'][i]['quarter'], str(quarter)) and int(output['Data'][i]['year']) == year:
                    if(output['Data'][i]['maximum_value']):
                        #print(output['Data'][i]['arithmetic_mean'])
                        if(OzoneTotal < float(output['Data'][i]['maximum_value'])):
                            OzoneTotal = float(output['Data'][i]['maximum_value'])
            #ignore 0 values
            #output example: Q1 2022: 45
            if(PM25Total != 0):
                PM25Trends["Q"+str(quarter)+" "+str(year)] = PM25Total 

            if(PM10Total != 0):
                PM10Trends["Q"+str(quarter)+" "+str(year)] = PM10Total 

            if(OzoneTotal != 0):
                OzoneTrends["Q"+str(quarter)+" "+str(year)] = OzoneTotal 

            
            quarter = quarter + 1
        except KeyError:
            print("key error")
            PM25Trends["PM2.5"] = 0
            PM10Trends["PM10"] = 0
            OzoneTrends["Ozone"] = 0
            break
    

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
        #print(jsonResponse)
        return jsonify(jsonResponse)

    #Endpoint for unit testing
    @app.route("/aqi/test", methods=['GET'])
    def getCurrentAQITest():
        jsonTestData = open('./TestData/currentAQITestData.json')
        data = json.load(jsonTestData)
        jsonTestData.close()
        return jsonify(data)



    @app.route("/trends", methods=['GET'])
    def getTrends():
        global PM25Trends 
        global PM10Trends 
        global OzoneTrends 
        #https://aqs.epa.gov/aqsweb/documents/data_api.html#quarterly
        county = request.args.get("county")
        state = request.args.get("state") 
        #fips csv files for translating to fips for the api
        try:
            with open('fips.csv', newline='') as f:
                reader = csv.reader(f)
                for row in reader:
                    if (contains(row[1], county) and contains(row[2], state.upper())):
                        print(str(row[0])[-3:])
                        countyFips = str(row[0])[-3:]
                f.close()
            with open('statefips.csv', newline='') as f:
                reader = csv.reader(f)
                for name in reader:
                    if (contains(name[0], StateAbbrv[state.upper()].capitalize())):
                        print(str(name[3]))
                        stateFips = str(name[3])
                f.close
        
            #get all trend data from 2015 until the current year
            today = datetime.datetime.now()
            PM25Trends.clear()
            PM10Trends.clear()
            OzoneTrends.clear()
            endYear = today.year
            year = 2015
            #the api must be called on a loop due to it only allowing one year at a time
            while(endYear >= year):
                url = "https://aqs.epa.gov/data/api/quarterlyData/byCounty?email="+EMAIL+"&key="+AQS_KEY+"&param=88101,44201,81102&bdate="+str(year)+"0101&edate="+str(year)+"1231&state="+stateFips+"&county="+countyFips
                print(url)
                response_API = requests.get(url)
                output = json.loads(response_API.text)
                extractTrendData(output, year)  
                year = year + 1
            #AllTrends houses the final output
            AllTrends = {}
            AllTrends["PM25"] = PM25Trends
            AllTrends["PM10"] = PM10Trends
            AllTrends["Ozone"] = OzoneTrends
            return json.dumps(AllTrends)
        except Exception as e:
            print(e)
            AllTrends = {}
            PM25Trends["PM2.5"] = 0
            PM10Trends["PM10"] = 0
            OzoneTrends["Ozone"] = 0
            AllTrends["PM25"] = PM25Trends
            AllTrends["PM10"] = PM10Trends
            AllTrends["Ozone"] = OzoneTrends
            return json.dumps(AllTrends)

    #Test version of the getTrends method
    @app.route("/trends/test", methods=['GET'])
    def getTrendsTest():
        global PM25Trends 
        global PM10Trends 
        global OzoneTrends 
        try:
            today = datetime.datetime.now()
            PM25Trends.clear()
            PM10Trends.clear()
            OzoneTrends.clear()
            endYear = today.year
            year = 2015
            while(endYear >= year):
                jsonTestData = open('./TestData/aqiTrendTestData.json')
                output = json.load(jsonTestData)
                extractTrendData(output, year)  
                jsonTestData.close()
                year = year + 1
            
            AllTrends = {}
            AllTrends["PM25"] = PM25Trends
            AllTrends["PM10"] = PM10Trends
            AllTrends["Ozone"] = OzoneTrends
            return json.dumps(AllTrends)
        except:
            AllTrends = {}
            PM25Trends["PM2.5"] = 0
            PM10Trends["PM10"] = 0
            OzoneTrends["Ozone"] = 0
            AllTrends["PM25"] = PM25Trends
            AllTrends["PM10"] = PM10Trends
            AllTrends["Ozone"] = OzoneTrends
            return json.dumps(AllTrends)
    return app


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app = airNowEndpoint()
    app.run(host="0.0.0.0", port=port)
else:
    gunicorn_app = airNowEndpoint()
