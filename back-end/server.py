#This code was moved to wildfire.py
#This file remains for commit history purposes
import datetime
from operator import contains
import requests, os
import json
import pandas as pd
from collections import OrderedDict
import numpy as np
import dateutil.relativedelta

from datetime import date
from flask import Flask, jsonify, request
from flask_cors import CORS

ActiveFireResponse = {}
WildfireResponse = {}
WildfireStateResponse = {}
WildfireAvgRes = {}
WildfireTotalResponse = {}
WildfireAcres = {}
WildfireCount = {}

def averageMonth(dateStart, dateEnd, month, year, output):
    totalDays = 0
    amountOfFiresWithStartEndDates = 0
    try:
        for j in range(len(output['features'])):
        #fire out 
            if(str(output['features'][j]['attributes']['FireOutDateTime']) != "None"):
                start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                end = str(output['features'][j]['attributes']['FireOutDateTime'])
                if (int(end[:-3]) < dateEnd and int(start[:-3]) > dateStart):
                    startDateConvert = datetime.datetime.fromtimestamp(int(start[:-3])) 
                    endDateConvert = datetime.datetime.fromtimestamp(int(end[:-3]))
                    timeDifference = dateutil.relativedelta.relativedelta (endDateConvert, startDateConvert)
            #print(timeDifference.days)
                    totalDays = totalDays + timeDifference.days
                    totalDays = totalDays + (timeDifference.months * 30)
                    totalDays = totalDays + (timeDifference.years * 365)
                    amountOfFiresWithStartEndDates = amountOfFiresWithStartEndDates + 1
        #fire containment
            elif(str(output['features'][j]['attributes']['ContainmentDateTime']) != "None"):
                start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                end = str(output['features'][j]['attributes']['ContainmentDateTime'])
                if (int(end[:-3]) < dateEnd and int(start[:-3]) > dateStart):
                    startDateConvert = datetime.datetime.fromtimestamp(int(start[:-3])) 
                    endDateConvert = datetime.datetime.fromtimestamp(int(end[:-3]))
                    timeDifference = dateutil.relativedelta.relativedelta (endDateConvert, startDateConvert)
                    totalDays = totalDays + timeDifference.days
                    totalDays = totalDays + (timeDifference.months * 30)
                    totalDays = totalDays + (timeDifference.years * 365)
                    amountOfFiresWithStartEndDates = amountOfFiresWithStartEndDates + 1
        #fire control 
            elif(output['features'][j]['attributes']['ControlDateTime']):
                start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                end = str(output['features'][j]['attributes']['ControlDateTime'])
                if (int(end[:-3]) < dateEnd and int(start[:-3]) > dateStart):
            #print(start)
                    startDateConvert = datetime.datetime.fromtimestamp(int(start[:-3])) 
                    endDateConvert = datetime.datetime.fromtimestamp(int(end[:-3]))
                    timeDifference = dateutil.relativedelta.relativedelta (endDateConvert, startDateConvert)
                    totalDays = totalDays + timeDifference.days
                    totalDays = totalDays + (timeDifference.months * 30)
                    totalDays = totalDays + (timeDifference.years * 365)            
                    amountOfFiresWithStartEndDates = amountOfFiresWithStartEndDates + 1  

        if(amountOfFiresWithStartEndDates !=0 and totalDays != 0 ):
            if(round(float(totalDays/amountOfFiresWithStartEndDates)!=0)):
                WildfireAvgRes[month + " " + str(year)] = str(round(float(totalDays/amountOfFiresWithStartEndDates)))
    except KeyError:
        WildfireAvgRes["Average"] = 0
       
def acresMonth(dateStart, dateEnd, month, year, output):
        sum = 0
        try:
            for j in range(len(output['features'])):
                print(str(output['features'][j]['attributes']['DailyAcres']))
                if (str(output['features'][j]['attributes']['DailyAcres'])!= "None"):
                    str(output['features'][j]['attributes']['DailyAcres'])
                    start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                    end = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                    if (int(end[:-3]) < dateEnd and int(start[:-3]) > dateStart):
                        sum = sum + int(output['features'][j]['attributes']['DailyAcres'])

            if(sum !=0):
                WildfireAcres[month + " " + str(year)] = sum
        except KeyError:
            WildfireAcres["Acres"] = 0

def countMonth(dateStart, dateEnd, month, year, output):
    total = 0
    try: 
        for j in range(len(output['features'])):
        #print(str(output['features'][j]['attributes']['FireDiscoveryDateTime']))
            if (str(output['features'][j]['attributes']['FireDiscoveryDateTime'])!= "None"):
                str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                end = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                if (int(end[:-3]) < dateEnd and int(start[:-3]) > dateStart):
                    total = total + 1
                    #print("hello")
                    j = j + 1
                else:
                    j = j + 1
            else: 
                j = j + 1
        if(total !=0):
            WildfireCount[month + " " + str(year)] = total
    except KeyError:
        WildfireCount["Count"] = 0

#Time converter for converting UNIX Time
def timeConverter(timeToConvert):
    formatTime = str(timeToConvert)[:-3]
    return str(datetime.datetime.fromtimestamp(int(formatTime)))

#Convert seconds to time
def convertSecondsToTime(seconds):
    seconds = seconds % (24 * 3600)
    hour = seconds // 3600
    seconds %= 3600
    minutes = seconds // 60
    seconds %= 60
     
    return "%d:%02d:%02d" % (hour, minutes, seconds)

#check that fires exist for a specific location
def fireCheck(output):
    if (len(output['features']) == 0):
        return False
    else:
        return True

#Get the count of wildfires
def getTotalFiresCounty(county, state):
    countUrl = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+county+"'%20AND%20POOState%20%3D%20'US-"+state+"'&outFields=IncidentName,DailyAcres,ContainmentDateTime,FireDiscoveryDateTime&returnGeometry=false&returnCountOnly=true&outSR=4326&f=json"
    count_response_API = requests.get(countUrl)    
    countOutput = json.loads(count_response_API.text)
    WildfireResponse["Total Fires"] = countOutput["count"]

def getTotalFiresState(state):
    countUrl = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOState%20%3D%20'US-"+state+"'&outFields=IncidentName,DailyAcres,ContainmentDateTime,FireDiscoveryDateTime&returnGeometry=false&returnCountOnly=true&outSR=4326&f=json"
    count_response_API = requests.get(countUrl)    
    countOutput = json.loads(count_response_API.text)
    WildfireResponse["Total Fires"] = countOutput["count"]

#get fires that are contained but not put out
def getContainedFires(output, state):
    sum = 0 
    for i in range(len(output['features'])):
        if(str(output['features'][i]['attributes']['ContainmentDateTime']) != "None" and str(output['features'][i]['attributes']['FireOutDateTime']) == "None"):
            sum = sum + 1
            i = i + 1
        else: 
            i = i + 1
    if(state):
        WildfireStateResponse["Current Number of Contained Fires"] = sum
    else:
        WildfireResponse["Current Number of Contained Fires"] = sum

#get total acres burned
def totalAcres(output, state):
    sum = 0 
    for i in range(len(output['features'])):
        if(str(output['features'][i]['attributes']['DailyAcres']) != "None"):
            sum = sum + int(output['features'][i]['attributes']['DailyAcres'])
            i = i + 1
        else: 
            i = i + 1
    if(state):
        WildfireStateResponse["Total Acres Burned"] = sum
    else:
        WildfireResponse["Total Acres Burned"] = sum


def getMostRecentFire(output, state):
    #most recent fire row
    marker = 0
    mostRecent = output['features'][0]['attributes']['FireDiscoveryDateTime']
    for i in range(len(output['features'])):
        if(mostRecent < output['features'][i]['attributes']['FireDiscoveryDateTime']):
            mostRecent = output['features'][i]['attributes']['FireDiscoveryDateTime']
            marker = i
            i = i + 1
        else:
            i = i + 1
    mostRecentStart = timeConverter(output['features'][marker]['attributes']['FireDiscoveryDateTime']).split(" ")
    if(state):
        WildfireStateResponse["Most Recent Fire"] = output['features'][marker]['attributes']['IncidentName'] +" " + mostRecentStart[0]
    else:
        WildfireResponse["Most Recent Fire"] = output['features'][marker]['attributes']['IncidentName'] +" " + mostRecentStart[0]
    

def longestBurningFire(output, state):
     #longest burning fire
    marker = 0
    timeDifference = 0
    for i in range(len(output['features'])):
        start = str(output['features'][i]['attributes']['FireDiscoveryDateTime'])
        end = str(output['features'][i]['attributes']['FireOutDateTime'])
        if(start != "None" and end != "None"):
            if (timeDifference == 0):
                timeDifference = int(end) - int(start)
                marker = i
                i = i + 1
            elif (output['features'][i]['attributes']['FireOutDateTime'] - output['features'][i]['attributes']['FireDiscoveryDateTime'] > timeDifference):
                timeDifference = output['features'][i]['attributes']['FireOutDateTime'] - output['features'][i]['attributes']['FireDiscoveryDateTime']
                marker = i
                i = i + 1
            else:
                i = i + 1
        else:
            i = i + 1
     
    longestFireStart = timeConverter(output['features'][marker]['attributes']['FireDiscoveryDateTime']).split(" ")
    longestFireEnd = timeConverter(output['features'][marker]['attributes']['FireOutDateTime']).split(" ")
    if(state):
        WildfireStateResponse["Longest Fire"] = output['features'][marker]['attributes']['IncidentName'] + " " + longestFireStart[0] +" - " + longestFireEnd[0]
    else:
        WildfireResponse["Longest Fire"] = output['features'][marker]['attributes']['IncidentName'] + " " + longestFireStart[0] +" - " + longestFireEnd[0]


def averageFireDuration(output, state):       
     #Average Fire Duration
    totalDays = 0
    amountOfFiresWithStartEndDates = 0
    for j in range(len(output['features'])):
        #fire out 
        if(str(output['features'][j]['attributes']['FireOutDateTime']) != "None"):
            start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
            end = str(output['features'][j]['attributes']['FireOutDateTime'])
            startDateConvert = datetime.datetime.fromtimestamp(int(start[:-3])) 
            endDateConvert = datetime.datetime.fromtimestamp(int(end[:-3]))
            timeDifference = dateutil.relativedelta.relativedelta (endDateConvert, startDateConvert)
            totalDays = totalDays + timeDifference.days
            amountOfFiresWithStartEndDates = amountOfFiresWithStartEndDates + 1
        #fire containment
        elif(str(output['features'][j]['attributes']['ContainmentDateTime']) != "None"):
            start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
            end = str(output['features'][j]['attributes']['ContainmentDateTime'])
            startDateConvert = datetime.datetime.fromtimestamp(int(start[:-3])) 
            endDateConvert = datetime.datetime.fromtimestamp(int(end[:-3]))
            timeDifference = dateutil.relativedelta.relativedelta (endDateConvert, startDateConvert)
            totalDays = totalDays + timeDifference.days
            amountOfFiresWithStartEndDates = amountOfFiresWithStartEndDates + 1
        #fire control 
        elif(output['features'][j]['attributes']['ControlDateTime']):
            start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
            end = str(output['features'][j]['attributes']['ControlDateTime'])
            print(start)
            startDateConvert = datetime.datetime.fromtimestamp(int(start[:-3])) 
            endDateConvert = datetime.datetime.fromtimestamp(int(end[:-3]))
            timeDifference = dateutil.relativedelta.relativedelta (endDateConvert, startDateConvert)
            totalDays = totalDays + timeDifference.days
            amountOfFiresWithStartEndDates = amountOfFiresWithStartEndDates + 1  
      
    if(state):
        WildfireStateResponse["Average Days Until a Fire is Contained/Controlled/Out"] = str(int(totalDays/amountOfFiresWithStartEndDates))+" Day(s)"
        
    else:
        WildfireResponse["Average Days Until a Fire is Contained/Controlled/Out"] = str(int(totalDays/amountOfFiresWithStartEndDates))+" Day(s)"
        



def create_app(config=None):
    app = Flask(__name__)
    # See http://flask.pocoo.org/docs/latest/config/
    app.config.update(dict(DEBUG=True))
    app.config.update(config or {})
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

    # Setup cors headers to allow all domains
    # https://flask-cors.readthedocs.io/en/latest/
    CORS(app)

    # Definition of the routes. Put them into their own file. See also
    # Flask Blueprints: http://flask.pocoo.org/docs/latest/blueprints
    @app.route("/wildfire/county", methods=['GET'])
    def WildFireCounty():
        location = request.args.get("location").strip("+")
        state = request.args.get("state").strip("+")
        #url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+location+"'%20AND%20POOState%20%3D%20'US-"+state+"'&outFields=FireDiscoveryDateTime,FireOutDateTime,CpxName,IsCpxChild,POOState,ControlDateTime,ContainmentDateTime,DailyAcres,DiscoveryAcres,IncidentName&outSR=4326&f=json"
        url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+location+"'%20AND%20POOState%20%3D%20'US-"+state+"'%20AND%20%20(DailyAcres >= 0.1)%20&outFields=IncidentName,DailyAcres,ContainmentDateTime,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
        print(url)
        response_API = requests.get(url)
        
        output = json.loads(response_API.text)

        if(fireCheck(output)):
            print("fires available")
            #total fires
            getTotalFiresCounty(location, state)
            #contained fires
            getContainedFires(output, False)
            #total acres burned
            totalAcres(output, False)
            #most recent fire
            getMostRecentFire(output, False)
            #longest fire
            longestBurningFire(output, False)
            #average duration
            averageFireDuration(output, False)
        else:
            print("no fire history")
            WildfireResponse["Current Number of Put Out Fires"] = "No History"
            WildfireResponse["TotalAcres"] = "No History"
            WildfireResponse["Average Time Until Fire is Out"] = "No History"
            WildfireResponse["Most Recent Fire"] = "No History"
            WildfireResponse["Longest Fire"] = "No History"

        return jsonify(WildfireResponse)


    @app.route("/wildfire/stateonly", methods=['GET'])
    def WildFireState():
        state = request.args.get("location").strip("+")
        url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOState%20%3D%20'US-"+state+"'%20AND%20%20(DailyAcres >= 10)%20&outFields=IncidentName,DailyAcres,ContainmentDateTime,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
        print(url)
        response_API = requests.get(url)
        
        output = json.loads(response_API.text)

        #total fires
        getTotalFiresState(state)
        #contained fires
        getContainedFires(output, True)
        #total acres burned
        totalAcres(output, True)
        #most recent fire
        getMostRecentFire(output, True)
        #longest fire
        longestBurningFire(output, True)
        #average duration
        averageFireDuration(output, True)

        return jsonify(WildfireStateResponse)
    @app.route("/active", methods=['GET'])
    def ActiveFires():
        url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Current_WildlandFire_Perimeters/FeatureServer/0/query?where=1%3D1&outFields=irwin_DiscoveryAcres,irwin_InitialLongitude,irwin_POOCity,irwin_POOCounty,irwin_FireDiscoveryDateTime,irwin_IncidentName,irwin_InitialLatitude&outSR=4326&f=json"
        print(url)
        AllActiveFires = {}
        response_API = requests.get(url)
        output = json.loads(response_API.text)
        for i in range(len(output['features'])):
            AllActiveFires[i] = output['features'][i]['attributes']
        return(AllActiveFires)
    @app.route("/activecounty", methods=['GET'])
    def ActiveFiresForCounty():
        county = request.args.get("county").strip("+")
        state = request.args.get("state").strip("+")
        url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Current_WildlandFire_Perimeters/FeatureServer/0/query?where=irwin_POOCounty%20%3D%20'"+county+"'%20AND%20irwin_POOState%20%3D%20'US-"+state+"'&outFields=poly_IncidentName,irwin_FireDiscoveryDateTime,irwin_POOCity,irwin_POOCounty,irwin_DailyAcres,irwin_IncidentName,irwin_InitialLatitude,irwin_InitialLongitude,irwin_POOState&outSR=4326&f=json"
        response_API = requests.get(url)
        output = json.loads(response_API.text)
        if(len(output['features']) == 0):
            ActiveFireResponse["IncidientName"] = "No Active Fires"
            ActiveFireResponse["DiscoveryDate"] = "No Active Fires"
        for i in range(len(output['features'])):
            fireStartDate = output['features'][i]['attributes']["irwin_FireDiscoveryDateTime"]
            ActiveFireResponse["IncidientName"] = output['features'][i]['attributes']["irwin_IncidentName"]
            ActiveFireResponse["DiscoveryDate"] = timeConverter(fireStartDate)
            ActiveFireResponse["irwin_InitialLatitude"] = output['features'][i]['attributes']["irwin_InitialLatitude"]
            ActiveFireResponse["irwin_InitialLongitude"] = output['features'][i]['attributes']["irwin_InitialLongitude"]

            ActiveFireResponse["irwin_InitialLatitude"] = output['features'][i]['attributes']["irwin_InitialLatitude"]
            ActiveFireResponse["irwin_InitialLongitude"] = output['features'][i]['attributes']["irwin_InitialLongitude"]

        return jsonify(ActiveFireResponse)

    #This is Ahmad's code!
    @app.route("/wildfire/average", methods=['GET'])
    def averageGraphResponse():
        location = request.args.get("location").strip("+")
        state = request.args.get("state").strip("+")
        url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+location+"'%20AND%20POOState%20%3D%20'US-"+state+"'%20AND%20%20(DailyAcres >= 0.1)%20&outFields=IncidentName,DailyAcres,ContainmentDateTime,ControlDateTime,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
        print(url)
        response_API = requests.get(url)
        output = json.loads(response_API.text)
        dateStart = 1420088400 
        MonthDict = { 
        1 : "January",
        2 : "February",
        3 : "March",
        4 : "April",
        5 : "May",
        6 : "June",
        7 : "July",
        8 : "August",
        9 : "September",
        10 : "October",
        11 : "November",
        12 : "December"
        }
        today = datetime.datetime.now()
        endYear = today.year
        month = 1
        year = 2015
        while (endYear >= year):
            if(month % 2 != 0):
                averageMonth(dateStart, dateStart + 2678400, MonthDict[month], year, output)
                dateStart += 2678400
                month = month + 1
            elif(month == 2):
                averageMonth(dateStart, dateStart + 2419200, MonthDict[month], year, output)
                dateStart += 2419200
                month = month + 1
            else:
                averageMonth(dateStart, dateStart + 2592000, MonthDict[month], year, output)
                dateStart += 2592000
                if(month == 12): 
                    month = 1 
                    year = year + 1
                else:
                    month = month + 1

        print(WildfireAvgRes)
        return json.dumps(WildfireAvgRes)


    @app.route("/wildfire/acres", methods=['GET'])
    def totalAcresResponse():
        location = request.args.get("location").strip("+")
        state = request.args.get("state").strip("+")
        url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+location+"'%20AND%20POOState%20%3D%20'US-"+state+"'%20AND%20%20(DailyAcres >= 0.1)%20&outFields=IncidentName,DailyAcres,ContainmentDateTime,ControlDateTime,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
        print(url)
        response_API = requests.get(url)
        output = json.loads(response_API.text)
        dateStart = 1420088400
        MonthDict = { 
        1 : "January",
        2 : "February",
        3 : "March",
        4 : "April",
        5 : "May",
        6 : "June",
        7 : "July",
        8 : "August",
        9 : "September",
        10 : "October",
        11 : "November",
        12 : "December"
        }
        today = datetime.datetime.now()
        endYear = today.year
        month = 1
        year = 2015
        while (endYear >= year):
            if(month % 2 != 0):
                acresMonth(dateStart, dateStart + 2678400, MonthDict[month], year, output)
                dateStart += 2678400
                month = month + 1
            elif(month == 2):
                acresMonth(dateStart, dateStart + 2419200, MonthDict[month], year, output)
                dateStart += 2419200
                month = month + 1
            else:
                acresMonth(dateStart, dateStart + 2592000, MonthDict[month], year, output)
                dateStart += 2592000
                if(month == 12): 
                    month = 1 
                    year = year + 1
                else:
                    month = month + 1

    
        print(WildfireAcres)
        return json.dumps(WildfireAcres)


    #Number of fires graph

    @app.route("/wildfire/count", methods=['GET'])
    def NumberOfFiresGraph():
        location = request.args.get("location").strip("+")
        state = request.args.get("state").strip("+")
        url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+location+"'%20AND%20POOState%20%3D%20'US-"+state+"'%20AND%20%20(DailyAcres >= 0.1)%20&outFields=IncidentName,DailyAcres,ContainmentDateTime,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
        print(url)
        response_API = requests.get(url)    
        output = json.loads(response_API.text)
        #WildfireTotalResponse["Total Fires"] = output["count"]
        dateStart = 1420088400
        MonthDict = { 
        1 : "January",
        2 : "February",
        3 : "March",
        4 : "April",
        5 : "May",
        6 : "June",
        7 : "July",
        8 : "August",
        9 : "September",
        10 : "October",
        11 : "November",
        12 : "December"
        }
        today = datetime.datetime.now()
        endYear = today.year
        month = 1
        year = 2015
        while (endYear >= year):
            if(month % 2 != 0):
                countMonth(dateStart, dateStart + 2678400, MonthDict[month], year, output)
                dateStart += 2678400
                month = month + 1
            elif(month == 2):
                countMonth(dateStart, dateStart + 2419200, MonthDict[month], year, output)
                dateStart += 2419200
                month = month + 1
            else:
                countMonth(dateStart, dateStart + 2592000, MonthDict[month], year, output)
                dateStart += 2592000
                if(month == 12): 
                    month = 1 
                    year = year + 1
                else:
                    month = month + 1
    
        print(WildfireCount)
        return json.dumps(WildfireCount)
        

        
    @app.route("/wildfire/top10", methods=['GET'])
    def top10Acres():
        location = request.args.get("location").strip("+")
        state = request.args.get("state").strip("+")
        url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+location+"'%20AND%20POOState%20%3D%20'US-"+state+"'%20AND%20%20(DailyAcres >= 0.1)%20&outFields=IncidentName,DailyAcres&returnGeometry=false&outSR=4326&f=json"
        print(url)
        response_API = requests.get(url)
        output = json.loads(response_API.text)
        top10List = []
        top10 = {}
        sum = 0 
        copyDictionary = output['features'].copy()
        for i in range(len(copyDictionary)):
            if(copyDictionary[i]['attributes']['DailyAcres']):
                top10[(copyDictionary[i]['attributes']['IncidentName'])] = copyDictionary[i]['attributes']['DailyAcres']
                top10List.append(top10)
                top10 = {}    
        sortedAcres = sorted(
        output["features"], key=lambda x: x['attributes']["DailyAcres"], reverse=True
        
        )

        return sortedAcres[:10]

    @app.route("/wildfire/top10Duration", methods=['GET'])
    def top10Duration():
        location = request.args.get("location").strip("+")
        state = request.args.get("state").strip("+")
        url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+location+"'%20AND%20POOState%20%3D%20'US-"+state+"'%20AND%20%20(DailyAcres >= 0.1)%20&outFields=IncidentName,DailyAcres,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
        print(url)
        response_API = requests.get(url)
        output = json.loads(response_API.text)
        top10List = []
        top10 = {}
        totalDays = 0
        amountOfFiresWithStartEndDates = 0
        copyDictionary = output['features'].copy()
        for i in range(len(copyDictionary)):
            duration= 0
            name = ""
            if(str(copyDictionary[i]['attributes']['FireDiscoveryDateTime'])!= "None" and str(copyDictionary[i]['attributes']['FireOutDateTime'])!= "None"):
                start = str(copyDictionary[i]['attributes']['FireDiscoveryDateTime'])
                end = str(copyDictionary[i]['attributes']['FireOutDateTime'])
                duration = int(end[:-3]) - int(start[:-3])
                name = (copyDictionary[i]['attributes']['IncidentName'])
                top10[round(duration/86400)] = name

        return json.dumps(OrderedDict(sorted(top10.items(), reverse=True)))

        

    return app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8001))
    app = create_app()
    app.run(host="0.0.0.0", port=port)