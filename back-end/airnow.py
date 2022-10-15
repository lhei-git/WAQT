# This connects to the AirNow API 
# Documentation: https://docs.airnowapi.org/webservices
from tracemalloc import start
from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import os
import json
from datetime import date
from dateutil.relativedelta import relativedelta

# API is in secrets
# Do not push API_KEY to GitHub
API_KEY = ""
CURRENT_DATE = date.today()

#convert month to quarter
month2quarter = {
        1:1,2:1,3:1,
        4:2,5:2,6:2,
        7:3,8:3,9:3,
        10:4,11:4,12:4,
    }.get


#endpoint to access air now data: 
def airNowEndpoint():
    app = Flask(__name__)
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
    def getAllData(startDate, endDate, parameters, bbox, top10):   

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
        
        #sort the data
        res = sorted(jsonResponse, key=lambda k: k['Value'], reverse=True)
        top10Results = []
        #return data for the highest value o
        if(top10):
            for i in range(len(res)):
                top10Results.append(res[i]['Value'])
            return top10Results
        else:
            return res[0]['Value']

    #This grabs pm 2.5 values for a bounding box
    #sample request url: localhost:8000/pm25?startDate=2022-09-17T16&endDate=2022-09-17T17&bbox=-83.553673,42.029418,-82.871707,42.451216
    @app.route("/pm25", methods=['GET'])
    def getPM25():
        #get url parameters 
        bbox = request.args.get("bbox")
        #results
        highestValuesPerQuarter = {}
        #get data for the previous 8 quarters 

        #retrieve sorted json data (this method only calls for pm2.5)
        highestValuesPerQuarter['Q'+str(month2quarter(CURRENT_DATE.month))+str(CURRENT_DATE.year)] = getAllData(str(CURRENT_DATE - relativedelta(months=3))+"T00", str(CURRENT_DATE)+"T00", "PM25", str(bbox), False)
        highestValuesPerQuarter['Q'+str(month2quarter(CURRENT_DATE.month - 3))+str(CURRENT_DATE.year)] = getAllData(str(CURRENT_DATE - relativedelta(months=6))+"T00", str(CURRENT_DATE - relativedelta(months=3))+"T00", "PM25", str(bbox), False)
        highestValuesPerQuarter['Q'+str(month2quarter(CURRENT_DATE.month - 6))+str(CURRENT_DATE.year)] = getAllData(str(CURRENT_DATE - relativedelta(months=9))+"T00", str(CURRENT_DATE - relativedelta(months=6))+"T00", "PM25", str(bbox), False)
        highestValuesPerQuarter['Q'+str(month2quarter(CURRENT_DATE.month - 9))+str(CURRENT_DATE.year)] = getAllData(str(CURRENT_DATE - relativedelta(months=12))+"T00", str(CURRENT_DATE - relativedelta(months=9))+"T00", "PM25", str(bbox), False)
        return jsonify(highestValuesPerQuarter)
    @app.route("/pm10", methods=['GET'])
    def getPM10():
        #get url parameters 
        bbox = request.args.get("bbox")
        #results
        highestValuesPerQuarter = {}
        #get data for the previous 8 quarters 

        #retrieve sorted json data (this method only calls for pm2.5)
        highestValuesPerQuarter['Q'+str(month2quarter(CURRENT_DATE.month))+str(CURRENT_DATE.year)] = getAllData(str(CURRENT_DATE - relativedelta(months=3))+"T00", str(CURRENT_DATE)+"T00", "PM10", str(bbox), False)
        highestValuesPerQuarter['Q'+str(month2quarter(CURRENT_DATE.month - 3))+str(CURRENT_DATE.year)] = getAllData(str(CURRENT_DATE - relativedelta(months=6))+"T00", str(CURRENT_DATE - relativedelta(months=3))+"T00", "PM10", str(bbox), False)
        highestValuesPerQuarter['Q'+str(month2quarter(CURRENT_DATE.month - 6))+str(CURRENT_DATE.year)] = getAllData(str(CURRENT_DATE - relativedelta(months=9))+"T00", str(CURRENT_DATE - relativedelta(months=6))+"T00", "PM10", str(bbox), False)
        highestValuesPerQuarter['Q'+str(month2quarter(CURRENT_DATE.month - 9))+str(CURRENT_DATE.year)] = getAllData(str(CURRENT_DATE - relativedelta(months=12))+"T00", str(CURRENT_DATE - relativedelta(months=9))+"T00", "PM10", str(bbox), False)
        return jsonify(highestValuesPerQuarter)
    
    @app.route("/ozone", methods=['GET'])
    def getOzone():
        #get url parameters 
        bbox = request.args.get("bbox")
        #results
        highestValuesPerQuarter = {}
        #get data for the previous 8 quarters 

        #retrieve sorted json data (this method only calls for pm2.5)
        highestValuesPerQuarter['Q'+str(month2quarter(CURRENT_DATE.month))+str(CURRENT_DATE.year)] = getAllData(str(CURRENT_DATE - relativedelta(months=3))+"T00", str(CURRENT_DATE)+"T00", "OZONE", str(bbox), False)
        highestValuesPerQuarter['Q'+str(month2quarter(CURRENT_DATE.month - 3))+str(CURRENT_DATE.year)] = getAllData(str(CURRENT_DATE - relativedelta(months=6))+"T00", str(CURRENT_DATE - relativedelta(months=3))+"T00", "OZONE", str(bbox), False)
        highestValuesPerQuarter['Q'+str(month2quarter(CURRENT_DATE.month - 6))+str(CURRENT_DATE.year)] = getAllData(str(CURRENT_DATE - relativedelta(months=9))+"T00", str(CURRENT_DATE - relativedelta(months=6))+"T00", "OZONE", str(bbox), False)
        highestValuesPerQuarter['Q'+str(month2quarter(CURRENT_DATE.month - 9))+str(CURRENT_DATE.year)] = getAllData(str(CURRENT_DATE - relativedelta(months=12))+"T00", str(CURRENT_DATE - relativedelta(months=9))+"T00", "OZONE", str(bbox), False)
        return jsonify(highestValuesPerQuarter)
    
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
    @app.route("/top10PM25", methods=['GET'])
    def getTopTenPM25():
        #get url parameters 
        bbox = request.args.get("bbox")
        #results
        topPM25 = []
        #get data for the previous 8 quarters 
        topPM25.extend(getAllData(str(CURRENT_DATE - relativedelta(months=3))+"T00", str(CURRENT_DATE)+"T00", "PM25", str(bbox), True))
        #topPM25.extend(getAllData(str(CURRENT_DATE - relativedelta(months=6))+"T00", str(CURRENT_DATE - relativedelta(months=3))+"T00", "PM25", str(bbox), True))
        #topPM25.extend(getAllData(str(CURRENT_DATE - relativedelta(months=9))+"T00", str(CURRENT_DATE - relativedelta(months=6))+"T00", "PM25", str(bbox), True))
        #topPM25.extend(getAllData(str(CURRENT_DATE - relativedelta(months=12))+"T00", str(CURRENT_DATE - relativedelta(months=9))+"T00", "PM25", str(bbox), True))
        #print(topPM25)
        return json.dumps(topPM25)


    return app


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app = airNowEndpoint()
    app.run(host="0.0.0.0", port=port)