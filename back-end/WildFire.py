import datetime
from operator import contains
import requests, os
import json
import dateutil.relativedelta
from collections import OrderedDict
from flask import Flask, jsonify, request
from flask_cors import CORS
#https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOState%20%3D%20'US-CO'%20AND%20%20(FireDiscoveryDateTime >= DATE '2022-06-01 00:00:00')%20AND%20%20(DailyAcres >= 1)&outFields=IncidentName,DailyAcres,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json
#These dictionaries will house the JSON responses for the front-end
ActiveFireResponse = {}
WildfireResponse = {}
WildfireStateResponse = {}
WildfireAvgRes = {}
WildfireAcres = {}
WildfireRes = {}
WildfireCount = {}
WildfireTotalResponse = {}
WildfireAcres = {}
top10AcresRes = {}
top10DurationRes = {}

#Time converter for converting UNIX Time
def timeConverter(timeToConvert):
    formatTime = str(timeToConvert)[:-3]
    return str(datetime.datetime.fromtimestamp(int(formatTime)))

#Convert date into better format
def convertDate(currentDate):
    d = datetime.datetime.strptime(currentDate, '%Y-%m-%d')
    return d.strftime('%b %d, %Y')

#Convert seconds to time  
def convertSecondsToTime(seconds):
    seconds = seconds % (24 * 3600)
    hour = seconds // 3600
    seconds %= 3600
    minutes = seconds // 60
    seconds %= 60
     
    return "%d:%02d:%02d" % (hour, minutes, seconds)

'''
Fire stats table calculations
'''
#check that fires exist for a specific location
def fireCheck(output):
    if (len(output['features']) == 0):
        return False
    else:
        return True
#Count of active wildfires
def countOfActiveFires(county, state, stateOnly, test):
    if(stateOnly):
        if(test):
            jsonTestData = open('./TestData/wildfireCountTestData.json')
            countOutput = json.load(jsonTestData)
            jsonTestData.close()
        else:
            url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Current_WildlandFire_Locations/FeatureServer/0/query?where=POOState%20%3D%20'US-"+state+"'&returnGeometry=false&returnCountOnly=true&outSR=4326&f=json"
            count_response_API = requests.get(url)    
            countOutput = json.loads(count_response_API.text)
        WildfireStateResponse["Total Active Wildfires"] = countOutput["count"]
    else:
        if(test):
            jsonTestData = open('./TestData/wildfireCountTestData.json')
            countOutput = json.load(jsonTestData)
            jsonTestData.close()
        else:
            url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Current_WildlandFire_Locations/FeatureServer/0/query?where=POOCounty%20%3D%20'"+county+"'%20AND%20POOState%20%3D%20'US-"+state+"'&returnGeometry=false&returnCountOnly=true&outSR=4326&f=json"
            count_response_API = requests.get(url)    
            countOutput = json.loads(count_response_API.text)
        WildfireResponse["Total Active Wildfires"] = countOutput["count"]
#Get the count of wildfires
def getTotalFiresCounty(county, state, test):
    if(test):
        jsonTestData = open('./TestData/wildfireCountTestData.json')
        countOutput = json.load(jsonTestData)
        jsonTestData.close()
    else:
        countUrl = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+county+"'%20AND%20POOState%20%3D%20'US-"+state+"'&outFields=IncidentName,DailyAcres,ContainmentDateTime,FireDiscoveryDateTime&returnGeometry=false&returnCountOnly=true&outSR=4326&f=json"
        count_response_API = requests.get(countUrl)    
        countOutput = json.loads(count_response_API.text)
    WildfireResponse["Total Fires"] = countOutput["count"]
#count of wildfires for a state
def getTotalFiresState(state, test):
    if(test):
        jsonTestData = open('./TestData/wildfireCountTestData.json')
        countOutput = json.load(jsonTestData)
        jsonTestData.close()
    else:
        countUrl = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOState%20%3D%20'US-"+state+"'&outFields=IncidentName,DailyAcres,ContainmentDateTime,FireDiscoveryDateTime&returnGeometry=false&returnCountOnly=true&outSR=4326&f=json"
        count_response_API = requests.get(countUrl)    
        countOutput = json.loads(count_response_API.text)
    WildfireStateResponse["Total Fires"] = countOutput["count"]
#Get count of wildfires caused by humans
def getHumanCausedFires(county, state, stateOnly, test):
    if(stateOnly):
        if(test):
            jsonTestData = open('./TestData/wildfireCountTestData.json')
            countOutput = json.load(jsonTestData)
            jsonTestData.close()
        else:
            countUrl = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=FireCause%20%3D%20'HUMAN'%20AND%20POOState%20%3D%20'US-"+state+"'&outFields=FireCause&returnGeometry=false&returnCountOnly=true&outSR=4326&f=json"
            count_response_API = requests.get(countUrl)    
            countOutput = json.loads(count_response_API.text)
        WildfireStateResponse["Total Fires Caused by Humans"] = countOutput["count"]
    else:
        if(test):
            jsonTestData = open('./TestData/wildfireCountTestData.json')
            countOutput = json.load(jsonTestData)
            jsonTestData.close()
        else:
            countUrl = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=FireCause%20%3D%20'HUMAN'%20AND%20POOCounty%20%3D%20'"+county+"'%20AND%20POOState%20%3D%20'US-"+state+"'&outFields=FireCause&returnGeometry=false&returnCountOnly=true&outSR=4326&f=json"
            count_response_API = requests.get(countUrl)    
            countOutput = json.loads(count_response_API.text)
        WildfireResponse["Total Fires Caused by Humans"] = countOutput["count"]
#get the count of natural caused fires
def getNaturalCausedFires(county, state, stateOnly, test):
    if(stateOnly):
        if(test):
            jsonTestData = open('./TestData/wildfireCountTestData.json')
            countOutput = json.load(jsonTestData)
            jsonTestData.close()
        else:
            countUrl = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=FireCause%20%3D%20'NATURAL'%20AND%20POOState%20%3D%20'US-"+state+"'&outFields=FireCause&returnGeometry=false&returnCountOnly=true&outSR=4326&f=json"
            count_response_API = requests.get(countUrl)    
            countOutput = json.loads(count_response_API.text)
        WildfireStateResponse["Total Fires Caused by Nature"] = countOutput["count"]
    else:
        if(test):
            jsonTestData = open('./TestData/wildfireCountTestData.json')
            countOutput = json.load(jsonTestData)
            jsonTestData.close()
        else:
            countUrl = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=FireCause%20%3D%20'NATURAL'%20AND%20POOCounty%20%3D%20'"+county+"'%20AND%20POOState%20%3D%20'US-"+state+"'&outFields=FireCause&returnGeometry=false&returnCountOnly=true&outSR=4326&f=json"
            count_response_API = requests.get(countUrl)    
            countOutput = json.loads(count_response_API.text)
        WildfireResponse["Total Fires Caused by Nature"] = countOutput["count"]

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

#get the most recent fire by date
def getMostRecentFire(county, state, stateOnly, test):
    #most recent fire row
    try:
        if(stateOnly):
            if(test):
                jsonTestData = open('./TestData/wildfireTestData.json')
                output = json.load(jsonTestData)
                jsonTestData.close()
            else:
                #specific states that have a lot of wildfires 
                if(state == "CA" or state == "CO" or state == "MT" or state == "TX" or state == "MN" or state == "UT" or state == "OR" or state == "NV" or state == "OK" or  state == "WA"):
                    url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOState%20%3D%20'US-"+state+"'%20AND%20%20(FireDiscoveryDateTime >= DATE '2022-06-01 00:00:00')%20AND%20%20(DailyAcres >= 1)&outFields=IncidentName,DailyAcres,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
                else:
                    url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOState%20%3D%20'US-"+state+"'%20AND%20%20(FireDiscoveryDateTime >= DATE '2020-01-01 00:00:00')%20AND%20%20(DailyAcres >= 1)&outFields=IncidentName,DailyAcres,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
                response_API = requests.get(url)    
                output = json.loads(response_API.text)
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
            
            WildfireStateResponse["Most Recent Fire"] = str(output['features'][marker]['attributes']['IncidentName']).title() +" (" + convertDate(mostRecentStart[0]) + ")"

        else:
            if(test):
                jsonTestData = open('./TestData/wildfireTestData.json')
                output = json.load(jsonTestData)
                jsonTestData.close()
            else:
                if(state == "CA" or state == "CO" or state == "MT" or state == "TX" or state == "MN" or state == "UT" or state == "OR" or state == "NV" or state == "OK" or  state == "WA"):
                    url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+county+"'%20AND%20POOState%20%3D%20'US-"+state+"'%20AND%20%20(FireDiscoveryDateTime >= DATE '2022-06-01 00:00:00')%20AND%20%20(DailyAcres >= 1)&outFields=IncidentName,DailyAcres,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
                else:
                    url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+county+"'%20AND%20POOState%20%3D%20'US-"+state+"'%20AND%20%20(FireDiscoveryDateTime >= DATE '2022-01-01 00:00:00')%20AND%20%20(DailyAcres >= 1)&outFields=IncidentName,DailyAcres,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
                response_API = requests.get(url)    
                output = json.loads(response_API.text)
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
   
            WildfireResponse["Most Recent Fire"] = str(output['features'][marker]['attributes']['IncidentName']).title() +" (" + convertDate(mostRecentStart[0]) + ")"
    except Exception as e:
        print(e)
        WildfireResponse["Most Recent Fire"] = "Not Available"
        WildfireStateResponse["Most Recent Fire"] = "Not Available"

#get the oldest wildfire
def getOldestFire(county, state, stateOnly, test):
    try:
        if(stateOnly):
            if(test):
                jsonTestData = open('./TestData/wildfireTestData.json')
                output = json.load(jsonTestData)
                jsonTestData.close()
            else:
                #specific states that have a lot of wildfires 
                if(state == "CA" or state == "TX"):
                    url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOState%20%3D%20'US-"+state+"'%20AND%20%20(FireDiscoveryDateTime <= DATE '2011-01-01 00:00:00')&outFields=IncidentName,DailyAcres,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
                else:
                    url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOState%20%3D%20'US-"+state+"'%20AND%20%20(FireDiscoveryDateTime <= DATE '2017-01-01 00:00:00')&outFields=IncidentName,DailyAcres,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
                response_API = requests.get(url)    
                output = json.loads(response_API.text)
            marker = 0
            mostRecent = output['features'][0]['attributes']['FireDiscoveryDateTime']
            for i in range(len(output['features'])):
                if(mostRecent > output['features'][i]['attributes']['FireDiscoveryDateTime']):
                    mostRecent = output['features'][i]['attributes']['FireDiscoveryDateTime']
                    marker = i
                    i = i + 1
                else:
                    i = i + 1
            mostRecentStart = timeConverter(output['features'][marker]['attributes']['FireDiscoveryDateTime']).split(" ")
            
            WildfireStateResponse["Oldest Fire"] = str(output['features'][marker]['attributes']['IncidentName']).title() +" (" + convertDate(mostRecentStart[0]) + ")"

        else:
            if(test):
                jsonTestData = open('./TestData/wildfireTestData.json')
                output = json.load(jsonTestData)
                jsonTestData.close()
            else:
                if(state == "CA" or state == "MT"):
                    url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+county+"'%20AND%20POOState%20%3D%20'US-"+state+"'%20AND%20%20(FireDiscoveryDateTime <= DATE '2014-06-01 00:00:00')&outFields=IncidentName,DailyAcres,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
                else:
                    url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+county+"'%20AND%20POOState%20%3D%20'US-"+state+"'%20AND%20%20(FireDiscoveryDateTime <= DATE '2017-01-01 00:00:00')&outFields=IncidentName,DailyAcres,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
                response_API = requests.get(url)    
                output = json.loads(response_API.text)
            marker = 0
            mostRecent = output['features'][0]['attributes']['FireDiscoveryDateTime']
            for i in range(len(output['features'])):
                if(mostRecent > output['features'][i]['attributes']['FireDiscoveryDateTime']):
                    mostRecent = output['features'][i]['attributes']['FireDiscoveryDateTime']
                    marker = i
                    i = i + 1
                else:
                    i = i + 1
            mostRecentStart = timeConverter(output['features'][marker]['attributes']['FireDiscoveryDateTime']).split(" ")
   
            WildfireResponse["Oldest Fire"] = str(output['features'][marker]['attributes']['IncidentName']).title() +" (" + convertDate(mostRecentStart[0]) + ")"
    except Exception as e:
        print(e)
        WildfireResponse["Oldest Fire"] = "Not Available"
        WildfireStateResponse["Oldest Fire"] = "Not Available"


#get the longest wildfire by duration
def longestBurningFire(output, state):
     #longest burning fire
    try:
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

        #the dates come in as unix time, so these methods convert it into more readable dates
        longestFireStart = str(output['features'][marker]['attributes']['FireDiscoveryDateTime'])
        longestFireEnd = str(output['features'][marker]['attributes']['FireOutDateTime'])
        longestStartDateConvert = datetime.datetime.fromtimestamp(int(longestFireStart[:-3])) 
        longestEndDateConvert = datetime.datetime.fromtimestamp(int(longestFireEnd[:-3]))
        timeDifference = dateutil.relativedelta.relativedelta (longestEndDateConvert, longestStartDateConvert)

        multiYearFormat = str(timeDifference.years) + " Years " if int(timeDifference.years) > 1 else ""
        yearFormat = multiYearFormat if int(timeDifference.years) != 1 else str(timeDifference.years) + " Year "

        multiMonthFormat = str(timeDifference.months) + " Months " if int(timeDifference.months) > 1 else ""
        monthFormat = multiMonthFormat if int(timeDifference.months) != 1 else str(timeDifference.months) + " Month "

        multiDayFormat = str(timeDifference.days) + " Days" if int(timeDifference.days) > 1 else ""
        dayFormat = multiDayFormat if int(timeDifference.days) != 1 else str(timeDifference.days) + " Day "
                
        if(state):
            WildfireStateResponse["Longest Wildfire Duration"] = str(output['features'][marker]['attributes']['IncidentName']).title() + ": "+ yearFormat + monthFormat + dayFormat
        else:
            WildfireResponse["Longest Wildfire Duration"] = str(output['features'][marker]['attributes']['IncidentName']).title() + ": " + yearFormat + monthFormat + dayFormat
    except:
         WildfireStateResponse["Longest Wildfire Duration"] = "Not Available"
         WildfireResponse["Longest Wildfire Duration"] = "Not Available"
#average wildfire duration 
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
            #print(timeDifference.days)
            totalDays = totalDays + timeDifference.days
            totalDays = totalDays + (timeDifference.months * 30)
            totalDays = totalDays + (timeDifference.years * 365)
            amountOfFiresWithStartEndDates = amountOfFiresWithStartEndDates + 1
        #fire containment
        elif(str(output['features'][j]['attributes']['ContainmentDateTime']) != "None"):
            start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
            end = str(output['features'][j]['attributes']['ContainmentDateTime'])
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
            #print(start)
            startDateConvert = datetime.datetime.fromtimestamp(int(start[:-3])) 
            endDateConvert = datetime.datetime.fromtimestamp(int(end[:-3]))
            timeDifference = dateutil.relativedelta.relativedelta (endDateConvert, startDateConvert)
            totalDays = totalDays + timeDifference.days
            totalDays = totalDays + (timeDifference.months * 30)
            totalDays = totalDays + (timeDifference.years * 365)            
            amountOfFiresWithStartEndDates = amountOfFiresWithStartEndDates + 1   
    if(state):
        WildfireStateResponse["Average Fire Duration"] = str(int(totalDays/amountOfFiresWithStartEndDates))+" Day(s)"
        
    else:
        WildfireResponse["Average Fire Duration"] = str(int(totalDays/amountOfFiresWithStartEndDates))+" Day(s)"


"""
Trend graph calculations
"""

#Ahmad's code from server.py
#Average Month
def averageMonth(dateStart, dateEnd, month, year, output):
    totalDays = 0
    amountOfFiresWithStartEndDates = 0
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

#Ahmad's Code
def acresMonth(dateStart, dateEnd, month, year, output):
    sum = 0
    for j in range(len(output['features'])):
         #print(str(output['features'][j]['attributes']['DailyAcres']))
         if (str(output['features'][j]['attributes']['DailyAcres'])!= "None"):
             str(output['features'][j]['attributes']['DailyAcres'])
             start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
             end = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
             if (int(end[:-3]) < dateEnd and int(start[:-3]) > dateStart):
                 sum = sum + int(output['features'][j]['attributes']['DailyAcres'])

    if(sum !=0):
        WildfireAcres[month + " " + str(year)] = sum

#Ahmad's Code
def countMonth(dateStart, dateEnd, month, year, output):
    total = 0
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
#Ahmad's Code
def AverageGraph(output):
        avgDiff = 0
        amount = 0
        for j in range(len(output['features'])):
            start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
            end = str(output['features'][j]['attributes']['FireOutDateTime'])
            if(start != "None" and end != "None"):
                avgDiff += (int(end[:-3]) - int(start[:-3]))
                amount = j
                j = j + 1
            else:
                j = j + 1
      
        WildfireResponse["AverageDuration"] = convertSecondsToTime(avgDiff / amount)
        return convertSecondsToTime(avgDiff / amount)

#Ahmad's Code
def TotalAcresGraph(Result, output):
        sum = 0 
        for i in range(len(output['features'])):
            print(output['features'][i]['attributes']['DailyAcres'])
            if(isinstance(output['features'][i]['attributes']['DailyAcres'], int)):
                sum = sum + output['features'][i]['attributes']['DailyAcres']
                i = i + 1
            else: 
                    i = i + 1
                    WildfireRes[2022] = Result
        WildfireResponse["TotalAcres"] = sum

#Ahmad's Code 
def NumberOfFiresGraph(Result, output):
        if(fireCheck(output)):
            count = len(output['features'])
            WildfireResponse["FireCount"] = count 
            WildfireRes[2022] = Result

"""
Flask endpoints
"""
#This houses the actual endpoints used for the front-end to connect to
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
    #This get's the wildfire location for that location's county
    @app.route("/wildfire/county", methods=['GET'])
    def WildFireCounty():
        location = request.args.get("location").strip("+")
        state = request.args.get("state").strip("+")
        test = request.args.get("test")
        unitTesting = False
        if(test == "true"):
            jsonTestData = open('./TestData/wildfireTestData.json')
            output = json.load(jsonTestData)
            jsonTestData.close()
            unitTesting = True
        else:
            #url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+location+"'%20AND%20POOState%20%3D%20'US-"+state+"'&outFields=FireDiscoveryDateTime,FireOutDateTime,CpxName,IsCpxChild,POOState,ControlDateTime,ContainmentDateTime,DailyAcres,DiscoveryAcres,IncidentName&outSR=4326&f=json"
            url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+location+"'%20AND%20POOState%20%3D%20'US-"+state+"'%20AND%20%20(DailyAcres >= .01)%20&outFields=IncidentName,DailyAcres,ContainmentDateTime,ControlDateTime,FireDiscoveryDateTime,FireOutDateTime,FireCause,IsCpxChild&returnGeometry=false&outSR=4326&f=json"
            #print(url)
            response_API = requests.get(url)
            
            output = json.loads(response_API.text)
        

        if(fireCheck(output)):
            print("fires available")
            #active fires
            countOfActiveFires(location, state, False, unitTesting)
            #most recent fire
            getMostRecentFire(location, state, False, unitTesting)
            #oldest fire
            getOldestFire(location, state, False, unitTesting)
            #total fires
            getTotalFiresCounty(location, state, unitTesting)
            #fire cause
            getHumanCausedFires(location, state, False, unitTesting)
            getNaturalCausedFires(location, state, False, unitTesting)
            #total acres burned
            totalAcres(output, False)
            #longest fire
            longestBurningFire(output, False)
            #average duration
            averageFireDuration(output, False)


            
        else:
            print("no fire history")
            WildfireResponse["Total Active Wildfires"] = "Not Available"
            WildfireResponse["Most Recent Fire"] = "Not Available"
            WildfireResponse["Oldest Fire"] = "Not Available"
            WildfireResponse["Total Fires"] = "Not Available"
            WildfireResponse["Total Fires Caused by Humans"] = "Not Available"
            WildfireResponse["Total Fires Caused by Nature"] = "Not Available"
            WildfireResponse["Total Acres Burned"] = "Not Available"
            WildfireResponse["Longest Wildfire Duration"] = "Not Available"
            WildfireResponse["Average Fire Duration"] = "Not Available"

        return json.dumps(WildfireResponse)

    #This endpoint grabs the wildfire information for the location's state
    @app.route("/wildfire/stateonly", methods=['GET'])
    def WildFireState():
        state = request.args.get("location").strip("+")
        test = request.args.get("test")
        unitTesting = False
        if(test == "true"):
            jsonTestData = open('./TestData/wildfireTestData.json')
            output = json.load(jsonTestData)
            jsonTestData.close()
            unitTesting = True
        else:
            url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOState%20%3D%20'US-"+state+"'%20AND%20%20(DailyAcres >= 10)%20&outFields=IncidentName,DailyAcres,ContainmentDateTime,ControlDateTime,FireDiscoveryDateTime,FireOutDateTime,FireCause,IsCpxChild&returnGeometry=false&outSR=4326&f=json"
            print(url)
            response_API = requests.get(url)
        
            output = json.loads(response_API.text)

        if(fireCheck(output)):
            print("fires available")
            #active fires
            countOfActiveFires("None", state, True, unitTesting)
            #most recent fire
            getMostRecentFire("None", state, True, unitTesting)
            #oldest fire
            getOldestFire("None", state, True, unitTesting)
            #total fires
            getTotalFiresState(state, unitTesting)
            #fire cause
            getHumanCausedFires("None", state, True, unitTesting)
            getNaturalCausedFires("None", state, True, unitTesting)
            #total acres burned
            totalAcres(output, True)
            #longest fire
            longestBurningFire(output, True)
            #average duration
            averageFireDuration(output, True)
        else:
            print("no fire history")
            WildfireStateResponse["Total Active Wildfires"] = "Not Available"
            WildfireStateResponse["Most Recent Fire"] = "Not Available"
            WildfireStateResponse["Oldest Fire"] = "Not Available"
            WildfireStateResponse["Total Fires"] = "Not Available"
            WildfireStateResponse["Total Fires Caused by Humans"] = "Not Available"
            WildfireStateResponse["Total Fires Caused by Nature"] = "Not Available"
            WildfireStateResponse["Total Acres Burned"] = "Not Available"
            WildfireStateResponse["Longest Wildfire Duration"] = "Not Available"
            WildfireStateResponse["Average Fire Duration"] = "Not Available"

        return json.dumps(WildfireStateResponse)
        
    #This grabs all active wildfires (if any)
    @app.route("/mapmarkers", methods=['GET'])
    def ActiveFiresForMap():
        try:
            currentActiveFiresMap = []
            activeDictionaryMap = {}
            county = request.args.get("county").strip("+")
            state = request.args.get("state").strip("+")
            test = request.args.get("test")
            if(test == "true"):
                jsonTestData = open('./TestData/activeWildfireTestData.json')
                output = json.load(jsonTestData)
                jsonTestData.close()
            else:
                url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Current_WildlandFire_Locations/FeatureServer/0/query?where=POOCounty%20%3D%20'"+county+"'%20AND%20POOState%20%3D%20'US-"+state+"'&outFields=InitialLongitude,InitialLatitude,POOCounty,FireDiscoveryDateTime,FireCause,IncidentName&returnGeometry=false&outSR=4326&f=json"
                print(url)
                response_API = requests.get(url)
                output = json.loads(response_API.text)
            for i in range(len(output['features'])):
                fireStart = timeConverter(output['features'][i]['attributes']["FireDiscoveryDateTime"]).split(" ")
                activeDictionaryMap["irwin_InitialLatitude"] = output['features'][i]['attributes']["InitialLatitude"]
                activeDictionaryMap["irwin_InitialLongitude"] = output['features'][i]['attributes']["InitialLongitude"]
                activeDictionaryMap["name"] = str(output['features'][i]['attributes']["IncidentName"]).title()
                activeDictionaryMap["date"] = convertDate(fireStart[0])
                activeDictionaryMap["cause"] = output['features'][i]['attributes']["FireCause"]
                currentActiveFiresMap.append(activeDictionaryMap)
                activeDictionaryMap = {} 
        except Exception as e:
            print(e)

        return json.dumps(list(reversed(currentActiveFiresMap)))

    #Ahmad's Code
     #This is Ahmad's code!
    @app.route("/wildfire/average", methods=['GET'])
    def averageGraphResponse():
        try:
            location = request.args.get("location").strip("+")
            state = request.args.get("state").strip("+")
            test = request.args.get("test")
            if(test == "true"):
                jsonTestData = open('./TestData/wildfireTestData.json')
                output = json.load(jsonTestData)
                jsonTestData.close()
            else:
                url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+location+"'%20AND%20POOState%20%3D%20'US-"+state+"'%20AND%20%20(DailyAcres >= 0.1)%20&outFields=IncidentName,DailyAcres,ContainmentDateTime,ControlDateTime,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
                print(url)
                response_API = requests.get(url)
                output = json.loads(response_API.text)
            dateStart = 1420088400 
            MonthDict = { 
            1 : "Jan",
            2 : "Feb",
            3 : "Mar",
            4 : "April",
            5 : "May",
            6 : "June",
            7 : "July",
            8 : "Aug",
            9 : "Sept",
            10 : "Oct",
            11 : "Nov",
            12 : "Dec"
            }
            today = datetime.datetime.now()
            endYear = today.year
            month = 1
            year = 2015
            WildfireAvgRes.clear()
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
        except Exception as e:
            print(e)
        return json.dumps(WildfireAvgRes)

    #Ahmad's Code
    @app.route("/wildfire/acres", methods=['GET'])
    def totalAcresResponse():
        location = request.args.get("location").strip("+")
        state = request.args.get("state").strip("+")
        test = request.args.get("test")
        if(test == "true"):
            jsonTestData = open('./TestData/wildfireTestData.json')
            output = json.load(jsonTestData)
            jsonTestData.close()
        else:
            url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+location+"'%20AND%20POOState%20%3D%20'US-"+state+"'%20AND%20%20(DailyAcres >= 0.1)%20&outFields=IncidentName,DailyAcres,ContainmentDateTime,ControlDateTime,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
            print(url)
            response_API = requests.get(url)
            output = json.loads(response_API.text)
        dateStart = 1420088400
        MonthDict = { 
        1 : "Jan",
        2 : "Feb",
        3 : "Mar",
        4 : "April",
        5 : "May",
        6 : "June",
        7 : "July",
        8 : "Aug",
        9 : "Sept",
        10 : "Oct",
        11 : "Nov",
        12 : "Dec"
        }
        today = datetime.datetime.now()
        endYear = today.year
        month = 1
        year = 2015
        WildfireAcres.clear()
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

    
        #print(WildfireAcres)
        return json.dumps(WildfireAcres)

    #Ahmad's Code
    @app.route("/wildfire/count", methods=['GET'])
    def NumberOfFiresGraph():
        location = request.args.get("location").strip("+")
        state = request.args.get("state").strip("+")
        test = request.args.get("test")
        if(test == "true"):
            jsonTestData = open('./TestData/wildfireTestData.json')
            output = json.load(jsonTestData)
            jsonTestData.close()
        else:
            url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+location+"'%20AND%20POOState%20%3D%20'US-"+state+"'%20AND%20%20(DailyAcres >= 0.1)%20&outFields=IncidentName,DailyAcres,ContainmentDateTime,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
            print(url)
            response_API = requests.get(url)    
            output = json.loads(response_API.text)
        #WildfireTotalResponse["Total Fires"] = output["count"]
        dateStart = 1420088400
        MonthDict = { 
        1 : "Jan",
        2 : "Feb",
        3 : "Mar",
        4 : "April",
        5 : "May",
        6 : "June",
        7 : "July",
        8 : "Aug",
        9 : "Sept",
        10 : "Oct",
        11 : "Nov",
        12 : "Dec"
        }
        today = datetime.datetime.now()
        endYear = today.year
        month = 1
        year = 2015
        WildfireCount.clear()
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
    
        #print(WildfireCount)
        return json.dumps(WildfireCount)
    
    #Ahmad's Code
    @app.route("/wildfire/top10", methods=['GET'])
    def top10Acres():
        location = request.args.get("location").strip("+")
        state = request.args.get("state").strip("+")
        test = request.args.get("test")
        if(test == "true"):
            jsonTestData = open('./TestData/wildfireTestData.json')
            output = json.load(jsonTestData)
            jsonTestData.close()
        else:
            url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+location+"'%20AND%20POOState%20%3D%20'US-"+state+"'%20AND%20%20(DailyAcres >= 10)%20AND(FireDiscoveryDateTime >= DATE '2015-01-01 00:00:00')&outFields=IncidentName,FireDiscoveryDateTime,DailyAcres&returnGeometry=false&outSR=4326&f=json"
            print(url)
            response_API = requests.get(url)
            output = json.loads(response_API.text)
        
        top10AcresRes.clear()
        
        copyDictionary = output['features'].copy()
        for i in range(len(copyDictionary)):
            duration= 0
            name = ""
            if(str(copyDictionary[i]['attributes']['DailyAcres'])!= "None"):
                startYear = timeConverter(copyDictionary[i]['attributes']['FireDiscoveryDateTime']).split("-")
                acres = int(copyDictionary[i]['attributes']['DailyAcres'])
                name = str(copyDictionary[i]['attributes']['IncidentName']).capitalize() + " " + startYear[0]
                top10AcresRes[acres] = name
        res = dict(list(OrderedDict(sorted(top10AcresRes.items(), reverse=True)).items()))
        return json.dumps(res)
    
    

    #Ahmad's Code
    @app.route("/wildfire/top10Duration", methods=['GET'])
    def top10Duration():
        location = request.args.get("location").strip("+")
        state = request.args.get("state").strip("+")
        test = request.args.get("test")
        if(test == "true"):
            jsonTestData = open('./TestData/wildfireTestData.json')
            output = json.load(jsonTestData)
            jsonTestData.close()
        else:
            url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+location+"'%20AND%20POOState%20%3D%20'US-"+state+"'%20AND%20%20(DailyAcres >= 10)%20AND(FireDiscoveryDateTime >= DATE '2015-01-01 00:00:00')&outFields=IncidentName,ControlDateTime,ContainmentDateTime,DailyAcres,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
            print(url)
            response_API = requests.get(url)
            output = json.loads(response_API.text)
        top10DurationRes.clear()
        copyDictionary = output['features'].copy()
        for i in range(len(copyDictionary)):
            duration= 0
            name = ""
            if(str(copyDictionary[i]['attributes']['FireDiscoveryDateTime'])!= "None" ):
                start = str(copyDictionary[i]['attributes']['FireDiscoveryDateTime'])
                if(str(copyDictionary[i]['attributes']['FireOutDateTime'])!= "None"):
                    end = str(copyDictionary[i]['attributes']['FireOutDateTime'])
                    duration = int(end[:-3]) - int(start[:-3])
                    startYear = timeConverter(copyDictionary[i]['attributes']['FireDiscoveryDateTime']).split("-")
                    name = (str(copyDictionary[i]['attributes']['IncidentName']).capitalize() + " " + startYear[0])
                    top10DurationRes[round(duration/86400)] = name
                elif(str(copyDictionary[i]['attributes']['ContainmentDateTime'])!= "None"):
                    end = str(copyDictionary[i]['attributes']['ContainmentDateTime'])
                    duration = int(end[:-3]) - int(start[:-3])
                    startYear = timeConverter(copyDictionary[i]['attributes']['FireDiscoveryDateTime']).split("-")
                    name = (str(copyDictionary[i]['attributes']['IncidentName']).capitalize() + " " + startYear[0])
                    top10DurationRes[round(duration/86400)] = name
                elif(str(copyDictionary[i]['attributes']['ControlDateTime'])!= "None"):
                    end = str(copyDictionary[i]['attributes']['ControlDateTime'])
                    duration = int(end[:-3]) - int(start[:-3])
                    startYear = timeConverter(copyDictionary[i]['attributes']['FireDiscoveryDateTime']).split("-")
                    name = (str(copyDictionary[i]['attributes']['IncidentName']).capitalize() + " " + startYear[0])
                    top10DurationRes[round(duration/86400)] = name 

        res = dict(list(OrderedDict(sorted(top10DurationRes.items(), reverse=True)).items()))
        return json.dumps(res)
    return app
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8001))
    app = create_app()
    app.run(host="0.0.0.0", port=port)




