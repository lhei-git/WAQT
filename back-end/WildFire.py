import datetime
from operator import contains
import requests, os
import json
import dateutil.relativedelta

from flask import Flask, jsonify, request
from flask_cors import CORS

ActiveFireResponse = {}
WildfireResponse = {}
WildfireStateResponse = {}
WildfireAvgRes = {}
WildfireAcres = {}

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
    WildfireStateResponse["Total Fires"] = countOutput["count"]

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
        WildfireStateResponse["Most Recent Fire"] = str(output['features'][marker]['attributes']['IncidentName']).title() +" " + mostRecentStart[0]
    else:
        WildfireResponse["Most Recent Fire"] = str(output['features'][marker]['attributes']['IncidentName']).title() +" " + mostRecentStart[0]
    

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

    
    longestFireStart = str(output['features'][marker]['attributes']['FireDiscoveryDateTime'])
    longestFireEnd = str(output['features'][marker]['attributes']['FireOutDateTime'])
    longestStartDateConvert = datetime.datetime.fromtimestamp(int(longestFireStart[:-3])) 
    longestEndDateConvert = datetime.datetime.fromtimestamp(int(longestFireEnd[:-3]))
    timeDifference = dateutil.relativedelta.relativedelta (longestEndDateConvert, longestStartDateConvert)
            
    if(state):
        WildfireStateResponse["Longest Wildfire Duration"] = str(output['features'][marker]['attributes']['IncidentName']).title() + ": "+ str(timeDifference.years) + " Years "  + str(timeDifference.months) + " Months " + str(timeDifference.days) + " Days"
    else:
        WildfireResponse["Longest Wildfire Duration"] = str(output['features'][marker]['attributes']['IncidentName']).title() + ": " + str(timeDifference.years) + " Years " +str(timeDifference.months) + " Months " + str(timeDifference.days) + " Days"


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

#This is Ahmad's code from server.py


#Ahmad's code from server.py
def acresMonthCalculator(dateStart, dateEnd, month, year, output):
    sum = 0
    for j in range(len(output['features'])):
        print(str(output['features'][j]['attributes']['DailyAcres']))
        if (str(output['features'][j]['attributes']['DailyAcres'])!= "None"):
            str(output['features'][j]['attributes']['DailyAcres'])
            start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
            end = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
            if (int(end[:-3]) < dateEnd and int(start[:-3]) > dateStart):
                sum = sum + int(output['features'][j]['attributes']['DailyAcres'])

                j = j + 1
            else:
                j = j + 1
        else: 
            j = j + 1

    WildfireAcres[month + " " + str(year)] = sum        


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
        url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+location+"'%20AND%20POOState%20%3D%20'US-"+state+"'%20AND%20%20(DailyAcres >= 0.1)%20&outFields=IncidentName,DailyAcres,ContainmentDateTime,ControlDateTime,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
        #print(url)
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
            #acres per month
        else:
            print("no fire history")
            WildfireResponse["Total Fires"] = "Not Available"
            WildfireResponse["Current Number of Contained Fires"] = "Not Available"
            WildfireResponse["Total Acres Burned"] = "Not Available"
            WildfireResponse["Most Recent Fire"] = "Not Available"
            WildfireResponse["Longest Wildfire Duration"] = "Not Available"
            WildfireResponse["Average Days Until a Fire is Contained/Controlled/Out"] = "Not Available"

        return jsonify(WildfireResponse)


    @app.route("/wildfire/stateonly", methods=['GET'])
    def WildFireState():
        state = request.args.get("location").strip("+")
        url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOState%20%3D%20'US-"+state+"'%20AND%20%20(DailyAcres >= 10)%20&outFields=IncidentName,DailyAcres,ContainmentDateTime,ControlDateTime,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
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
        county = request.args.get("county").strip("+")
        state = request.args.get("state").strip("+")
        currentActiveFires = []
        activeDictionary = {}
        url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Current_WildlandFire_Locations/FeatureServer/0/query?where=POOCounty%20%3D%20'"+county+"'%20AND%20POOState%20%3D%20'US-"+state+"'&outFields=POOCounty,FireDiscoveryDateTime,FireCause,IncidentName&returnGeometry=false&outSR=4326&f=json"
        response_API = requests.get(url)
        output = json.loads(response_API.text)
        if(len(output['features']) == 0):
            activeDictionary["name"] = "No Active Fires"
            activeDictionary["cpx"] = "No Active Fires"
        else:
            for i in range(len(output['features'])):
                fireStart = timeConverter(output['features'][i]['attributes']["FireDiscoveryDateTime"]).split(" ")        
                activeDictionary["name"] = str(output['features'][i]['attributes']["IncidentName"]).title()
                activeDictionary["date"] = fireStart[0]
                activeDictionary["cause"] = output['features'][i]['attributes']["FireCause"]
                currentActiveFires.append(activeDictionary)
                activeDictionary = {} 
            
        
        return json.dumps(list(reversed(currentActiveFires)))

    @app.route("/mapmarkers", methods=['GET'])
    def ActiveFiresForMap():
        currentActiveFiresMap = []
        activeDictionaryMap = {}
        county = request.args.get("county").strip("+")
        state = request.args.get("state").strip("+")
        url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Current_WildlandFire_Locations/FeatureServer/0/query?where=POOCounty%20%3D%20'"+county+"'%20AND%20POOState%20%3D%20'US-"+state+"'&outFields=InitialLongitude,InitialLatitude&returnGeometry=false&outSR=4326&f=json"
        print(url)
        response_API = requests.get(url)
        output = json.loads(response_API.text)
        for i in range(len(output['features'])):
            activeDictionaryMap["irwin_InitialLatitude"] = output['features'][i]['attributes']["InitialLatitude"]
            activeDictionaryMap["irwin_InitialLongitude"] = output['features'][i]['attributes']["InitialLongitude"]
            currentActiveFiresMap.append(activeDictionaryMap)
            activeDictionaryMap = {} 

        return json.dumps(currentActiveFiresMap)


    @app.route("/wildfire/acres", methods=['GET'])
    def totalAcresResponse():
        location = request.args.get("location").strip("+")
        state = request.args.get("state").strip("+")
        url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+location+"'%20AND%20POOState%20%3D%20'US-"+state+"'%20AND%20%20(DailyAcres >= 0.1)%20&outFields=IncidentName,DailyAcres,ContainmentDateTime,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
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
            acresMonthCalculator(dateStart, dateStart + 2764800, MonthDict[month], year, output)
            dateStart += 2764800
            if(month == 12): 
                month = 1 
                year = year + 1
            else:
                month = month + 1
    
        print(WildfireAcres)
        return json.dumps(WildfireAcres)


    #This is Ahmad's code!
    @app.route("/wildfire/average", methods=['GET'])
    def averageGraphResponse():
        location = request.args.get("location").strip("+")
        state = request.args.get("state").strip("+")
        url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+location+"'%20AND%20POOState%20%3D%20'US-"+state+"'&outFields=FireDiscoveryDateTime,FireOutDateTime,CpxName,IsCpxChild,POOState,ControlDateTime,ContainmentDateTime,DailyAcres,DiscoveryAcres,IncidentName&outSR=4326&f=json"
        print(url)
        response_API = requests.get(url)
        output = json.loads(response_API.text)
        dateStart2015 = 1420088400
        dateEnd2015 = 1451538000
        avg2015 = 0
        counts2015 = 0
        for j in range(len(output['features'])):
            #print(str(output['features'][j]['attributes']['FireOutDateTime']))
            if (str(output['features'][j]['attributes']['FireOutDateTime'])!= "None"):
                str(output['features'][j]['attributes']['FireOutDateTime'])
                start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                end = str(output['features'][j]['attributes']['FireOutDateTime'])
                if (int(end[:-3]) < dateEnd2015 and int(start[:-3]) > dateStart2015):
                    avg2015 += int(end[:-3]) - int (start[:-3])
                    counts2015 = j
                    #print("hello")
                    j = j + 1
                else:
                    j = j + 1
            else: 
                j = j + 1

        if(counts2015 != 0):
            format = convertSecondsToTime(avg2015/counts2015).split(":")
            WildfireAvgRes[2015] = int(format[0])
        else:
            WildfireAvgRes[2015] = -1
        #Avg 2016
        dateStart2016 = 1451624400
        dateEnd2016 = 1483160400
        avg2016 = 0
        counts2016 = 0
        for j in range(len(output['features'])):
            #print(str(output['features'][j]['attributes']['FireOutDateTime']))
            if (str(output['features'][j]['attributes']['FireOutDateTime'])!= "None"):
                str(output['features'][j]['attributes']['FireOutDateTime'])
                start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                end = str(output['features'][j]['attributes']['FireOutDateTime'])
                if (int(end[:-3]) < dateEnd2016 and int(start[:-3]) > dateStart2016):
                    avg2016 += int(end[:-3]) - int (start[:-3])
                    counts2016 = j
                    #print("hello")
                    j = j + 1
                else:
                    j = j + 1
            else: 
                j = j + 1

        if(counts2016 != 0):
            format = convertSecondsToTime(avg2016/counts2016).split(":")
            WildfireAvgRes[2016] = int(format[0])
        else:
            WildfireAvgRes[2016] = -1

        #Avg2017
        dateStart2017 = 1483246800
        dateEnd2017 = 1514696400
        avg2017 = 0
        counts2017 = 0
        for j in range(len(output['features'])):
            #print(str(output['features'][j]['attributes']['FireOutDateTime']))
            if (str(output['features'][j]['attributes']['FireOutDateTime'])!= "None"):
                str(output['features'][j]['attributes']['FireOutDateTime'])
                start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                end = str(output['features'][j]['attributes']['FireOutDateTime'])
                if (int(end[:-3]) < dateEnd2017 and int(start[:-3]) > dateStart2017):
                    avg2017 += int(end[:-3]) - int (start[:-3])
                    counts2017 = j
                    #print("hello")
                    j = j + 1
                else:
                    j = j + 1
            else: 
                j = j + 1

        if(counts2017 != 0):
            format = convertSecondsToTime(avg2017/counts2017).split(":")
            WildfireAvgRes[2017] = int(format[0])
        else:
            WildfireAvgRes[2017] = -1
    
    #Avg2018

        dateStart2018 = 1514782800
        dateEnd2018 = 1546232400
        avg2018 = 0
        counts2018 = 0
        for j in range(len(output['features'])):
            #print(str(output['features'][j]['attributes']['FireOutDateTime']))
            if (str(output['features'][j]['attributes']['FireOutDateTime'])!= "None"):
                str(output['features'][j]['attributes']['FireOutDateTime'])
                start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                end = str(output['features'][j]['attributes']['FireOutDateTime'])
                if (int(end[:-3]) < dateEnd2018 and int(start[:-3]) > dateStart2018):
                    avg2018 += int(end[:-3]) - int (start[:-3])
                    counts2018 = j
                    #print("hello")
                    j = j + 1
                else:
                    j = j + 1
            else: 
                j = j + 1

        if(counts2018 != 0):
            format = convertSecondsToTime(avg2018/counts2018).split(":")
            WildfireAvgRes[2018] = int(format[0])
        else:
            WildfireAvgRes[2018] = -1
    
    #Avg2019

        dateStart2019 = 1546318800
        dateEnd2019 = 1577768400
        avg2019 = 0
        counts2019 = 0
        for j in range(len(output['features'])):
            #print(str(output['features'][j]['attributes']['FireOutDateTime']))
            if (str(output['features'][j]['attributes']['FireOutDateTime'])!= "None"):
                str(output['features'][j]['attributes']['FireOutDateTime'])
                start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                end = str(output['features'][j]['attributes']['FireOutDateTime'])
                if (int(end[:-3]) < dateEnd2019 and int(start[:-3]) > dateStart2019):
                    avg2019 += int(end[:-3]) - int (start[:-3])
                    counts2019 = j
                    #print("hello")
                    j = j + 1
                else:
                    j = j + 1
            else: 
                j = j + 1

        if(counts2019 != 0):
            format = convertSecondsToTime(avg2019/counts2019).split(":")
            WildfireAvgRes[2019] = int(format[0])
        else:
            WildfireAvgRes[2019] = -1
    
    #Avg2020

        dateStart2020 = 1577854800
        dateEnd2020 = 1609390800
        avg2020 = 0
        counts2020 = 0
        for j in range(len(output['features'])):
            #print(str(output['features'][j]['attributes']['FireOutDateTime']))
            if (str(output['features'][j]['attributes']['FireOutDateTime'])!= "None"):
                str(output['features'][j]['attributes']['FireOutDateTime'])
                start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                end = str(output['features'][j]['attributes']['FireOutDateTime'])
                if (int(end[:-3]) < dateEnd2020 and int(start[:-3]) > dateStart2020):
                    avg2020 += int(end[:-3]) - int (start[:-3])
                    counts2020 = j
                    #print("hello")
                    j = j + 1
                else:
                    j = j + 1
            else: 
                j = j + 1

        if(counts2020 != 0):
            format = convertSecondsToTime(avg2020/counts2020).split(":")
            WildfireAvgRes[2020] = int(format[0])
        else:
            WildfireAvgRes[2020] = -1

    #Avg2021

        dateStart2021 = 1609477200
        dateEnd2021 = 1640926800
        avg2021 = 0
        counts2021 = 0
        for j in range(len(output['features'])):
            #print(str(output['features'][j]['attributes']['FireOutDateTime']))
            if (str(output['features'][j]['attributes']['FireOutDateTime'])!= "None"):
                str(output['features'][j]['attributes']['FireOutDateTime'])
                start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                end = str(output['features'][j]['attributes']['FireOutDateTime'])
                if (int(end[:-3]) < dateEnd2021 and int(start[:-3]) > dateStart2021):
                    avg2021 += int(end[:-3]) - int (start[:-3])
                    counts2021 = j
                    #print("hello")
                    j = j + 1
                else:
                    j = j + 1
            else: 
                j = j + 1

        if(counts2021 != 0):
            format = convertSecondsToTime(avg2021/counts2021).split(":")
            WildfireAvgRes[2021] = int(format[0])
        else:
            WildfireAvgRes[2021] = -1

    #Avg2022

        dateStart2022 = 1641013200
        dateEnd2022 = 1672462800
        avg2022 = 0
        counts2022 = 0
        for j in range(len(output['features'])):
            #print(str(output['features'][j]['attributes']['FireOutDateTime']))
            if (str(output['features'][j]['attributes']['FireOutDateTime'])!= "None"):
                str(output['features'][j]['attributes']['FireOutDateTime'])
                start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                end = str(output['features'][j]['attributes']['FireOutDateTime'])
                if (int(end[:-3]) < dateEnd2022 and int(start[:-3]) > dateStart2022):
                    avg2022 += int(end[:-3]) - int (start[:-3])
                    counts2022 = j
                    #print("hello")
                    j = j + 1
                else:
                    j = j + 1
            else: 
                j = j + 1

        if(counts2022 != 0):
            format = convertSecondsToTime(avg2022/counts2022).split(":")
            WildfireAvgRes[2022] = int(format[0])
        else:
            WildfireAvgRes[2022] = -1


        print(WildfireAvgRes)
        return jsonify(WildfireAvgRes)

    return app
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8001))
    app = create_app()
    app.run(host="0.0.0.0", port=port)


