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

'''
Fire stats table calculations
'''
#check that fires exist for a specific location
def fireCheck(output):
    try:
        if (len(output['features']) == 0):
            return False
        else:
            return True
    except Exception as e:
        print("Fire Check Function: " + e)
#Count of active wildfires
def countOfActiveFires(county, state, stateOnly, test):
    try:
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
    except Exception as e:
        print("Active Fire Count Function: " + e)
#Get the count of wildfires
def getTotalFiresCounty(county, state, test):
    try:
        if(test):
            jsonTestData = open('./TestData/wildfireCountTestData.json')
            countOutput = json.load(jsonTestData)
            jsonTestData.close()
        else:
            countUrl = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+county+"'%20AND%20POOState%20%3D%20'US-"+state+"'&outFields=IncidentName,DailyAcres,ContainmentDateTime,FireDiscoveryDateTime&returnGeometry=false&returnCountOnly=true&outSR=4326&f=json"
            count_response_API = requests.get(countUrl)    
            countOutput = json.loads(count_response_API.text)
        WildfireResponse["Total Fires"] = "{:,}".format(int(countOutput["count"]))
        return int(countOutput["count"])
    except Exception as e:
        print("Total Fires County Function: " + e)
#count of wildfires for a state
def getTotalFiresState(state, test):
    try:
        if(test):
            jsonTestData = open('./TestData/wildfireCountTestData.json')
            countOutput = json.load(jsonTestData)
            jsonTestData.close()
        else:
            countUrl = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOState%20%3D%20'US-"+state+"'&outFields=IncidentName,DailyAcres,ContainmentDateTime,FireDiscoveryDateTime&returnGeometry=false&returnCountOnly=true&outSR=4326&f=json"
            count_response_API = requests.get(countUrl)    
            countOutput = json.loads(count_response_API.text)
        WildfireStateResponse["Total Fires"] = "{:,}".format(int(countOutput["count"]))
        return int(countOutput["count"])
    except Exception as e:
        print("Total Fire State Function: " + e)    
#Get count of wildfires caused by humans
def getHumanCausedFires(county, state, stateOnly, test):
    try:
        if(stateOnly):
            if(test):
                jsonTestData = open('./TestData/wildfireCountTestData.json')
                countOutput = json.load(jsonTestData)
                jsonTestData.close()
            else:
                countUrl = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=FireCause%20%3D%20'HUMAN'%20AND%20POOState%20%3D%20'US-"+state+"'&outFields=FireCause&returnGeometry=false&returnCountOnly=true&outSR=4326&f=json"
                count_response_API = requests.get(countUrl)    
                countOutput = json.loads(count_response_API.text)
            WildfireStateResponse["Total Fires Caused by Humans"] = "{:,}".format(int(countOutput["count"]))
        else:
            if(test):
                jsonTestData = open('./TestData/wildfireCountTestData.json')
                countOutput = json.load(jsonTestData)
                jsonTestData.close()
            else:
                countUrl = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=FireCause%20%3D%20'HUMAN'%20AND%20POOCounty%20%3D%20'"+county+"'%20AND%20POOState%20%3D%20'US-"+state+"'&outFields=FireCause&returnGeometry=false&returnCountOnly=true&outSR=4326&f=json"
                count_response_API = requests.get(countUrl)    
                countOutput = json.loads(count_response_API.text)
            WildfireResponse["Total Fires Caused by Humans"] = "{:,}".format(int(countOutput["count"]))
    except Exception as e:
        print("Human caused fire Function: " + e)
#get the count of natural caused fires
def getNaturalCausedFires(county, state, stateOnly, test):
    try:
        if(stateOnly):
            if(test):
                jsonTestData = open('./TestData/wildfireCountTestData.json')
                countOutput = json.load(jsonTestData)
                jsonTestData.close()
            else:
                countUrl = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=FireCause%20%3D%20'NATURAL'%20AND%20POOState%20%3D%20'US-"+state+"'&outFields=FireCause&returnGeometry=false&returnCountOnly=true&outSR=4326&f=json"
                count_response_API = requests.get(countUrl)    
                countOutput = json.loads(count_response_API.text)
            WildfireStateResponse["Total Fires Caused by Nature"] = "{:,}".format(int(countOutput["count"]))
        else:
            if(test):
                jsonTestData = open('./TestData/wildfireCountTestData.json')
                countOutput = json.load(jsonTestData)
                jsonTestData.close()
            else:
                countUrl = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=FireCause%20%3D%20'NATURAL'%20AND%20POOCounty%20%3D%20'"+county+"'%20AND%20POOState%20%3D%20'US-"+state+"'&outFields=FireCause&returnGeometry=false&returnCountOnly=true&outSR=4326&f=json"
                count_response_API = requests.get(countUrl)    
                countOutput = json.loads(count_response_API.text)
            WildfireResponse["Total Fires Caused by Nature"] = "{:,}".format(int(countOutput["count"]))
    except Exception as e:
        print("Natural caused fire Function: " + e)

#get total acres burned
def totalAcres(county, state, stateOnly, test):
    try:
        if(stateOnly):
            if(test):
                jsonTestData = open('./TestData/wildfireTestData.json')
                output = json.load(jsonTestData)
                jsonTestData.close()
            else:
                if(state == "CA" or state == "CO" or state == "MT" or state == "TX" or state == "MN" or state == "UT" or state == "OR" or state == "NV" or state == "OK" or  state == "WA"):
                    url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOState%20%3D%20'US-"+state+"'%20AND(DailyAcres >= 100)&outFields=IncidentName,ControlDateTime,ContainmentDateTime,DailyAcres,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
                else:
                    url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOState%20%3D%20'US-"+state+"'%20AND(DailyAcres >= 1)&outFields=IncidentName,ControlDateTime,ContainmentDateTime,DailyAcres,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
                response_API = requests.get(url)    
                output = json.loads(response_API.text)
        else:
            if(test):
                jsonTestData = open('./TestData/wildfireTestData.json')
                output = json.load(jsonTestData)
                jsonTestData.close()
            else:
                url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+county+"'%20AND%20POOState%20%3D%20'US-"+state+"'%20AND(DailyAcres > 1)&outFields=IncidentName,ControlDateTime,ContainmentDateTime,DailyAcres,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
                response_API = requests.get(url)    
                output = json.loads(response_API.text)
        sum = 0 
        for i in range(len(output['features'])):
            if(str(output['features'][i]['attributes']['DailyAcres']) != "None"):
                sum = sum + int(output['features'][i]['attributes']['DailyAcres'])
                i = i + 1
            else: 
                i = i + 1
        if(stateOnly):
            WildfireStateResponse["Total Acres Burned"] = "{:,}".format(sum)
        else:
            WildfireResponse["Total Acres Burned"] = "{:,}".format(sum)
        return sum
    except Exception as e:
        print(e)

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
def averageFireDuration(output, numberOfFires, state):       
     #Average Fire Duration
    try:
        totalDays = 0
        for j in range(len(output['features'])):
            #fire out 
            if(str(output['features'][j]['attributes']['FireOutDateTime']) != "None"):
                start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                end = str(output['features'][j]['attributes']['FireOutDateTime'])
                duration = (float(end[:-3])-float(start[:-3]))/(60*60*24)
                if(duration >= 1):
                    totalDays = totalDays + duration

            #fire containment
            elif(str(output['features'][j]['attributes']['ContainmentDateTime']) != "None"):
                start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                end = str(output['features'][j]['attributes']['ContainmentDateTime'])
                duration = (float(end[:-3])-float(start[:-3]))/(60*60*24)
                if(duration >= 1):
                    totalDays = totalDays + duration
            #fire control 
            elif(output['features'][j]['attributes']['ControlDateTime']):
                start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                end = str(output['features'][j]['attributes']['ControlDateTime'])
                duration = (float(end[:-3])-float(start[:-3]))/(60*60*24)
                if(duration >= 1):
                    totalDays = totalDays + duration    
        if(state):
            calc = int(totalDays/numberOfFires)
            if(calc > 1):
                text = str(calc) + " Days"
            elif(calc == 1):
                text = str(calc) + " Day"
            else:
                text = " < 1" +" Day"
            WildfireStateResponse["Average Fire Duration"] = text
            
        else:
            calc = int(totalDays/numberOfFires)
            if(calc > 1):
                text = str(calc) + " Days"
            elif(calc == 1):
                text = str(calc) + " Day"
            else:
                text = " < 1" +" Day"
            WildfireResponse["Average Fire Duration"] = text
    except Exception as e:
        print("Avg duration Function: " + e)

"""
Trend graph calculations
"""

#Ahmad's code from server.py
#Average Month
def averageMonth(dateStart, dateEnd, month, year, output):
    try:
        totalDays = 0
        amountOfFiresWithStartEndDates = 0
        for j in range(len(output['features'])):
            #fire out 
            if(str(output['features'][j]['attributes']['FireOutDateTime']) != "None"):
                start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                end = str(output['features'][j]['attributes']['FireOutDateTime'])
                if (int(end[:-3]) < dateEnd and int(start[:-3]) > dateStart):
                    duration = (float(end[:-3])-float(start[:-3]))/(60*60*24)
                    if(duration >= 1):
                        totalDays = totalDays + duration
                        amountOfFiresWithStartEndDates = amountOfFiresWithStartEndDates + 1
            #fire containment
            elif(str(output['features'][j]['attributes']['ContainmentDateTime']) != "None"):
                start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                end = str(output['features'][j]['attributes']['ContainmentDateTime'])
                if (int(end[:-3]) < dateEnd and int(start[:-3]) > dateStart):
                    duration = (float(end[:-3])-float(start[:-3]))/(60*60*24)
                    if(duration >= 1):
                        totalDays = totalDays + duration
                        amountOfFiresWithStartEndDates = amountOfFiresWithStartEndDates + 1
            #fire control 
            elif(output['features'][j]['attributes']['ControlDateTime']):
                start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                end = str(output['features'][j]['attributes']['ControlDateTime'])
                if (int(end[:-3]) < dateEnd and int(start[:-3]) > dateStart):
                    duration = (float(end[:-3])-float(start[:-3]))/(60*60*24)
                    if(duration >= 1):
                        totalDays = totalDays + duration
                        amountOfFiresWithStartEndDates = amountOfFiresWithStartEndDates + 1  

        if(amountOfFiresWithStartEndDates !=0 and totalDays != 0 ):
            if(round(float(totalDays/amountOfFiresWithStartEndDates)!=0)):
                WildfireAvgRes[month + " " + str(year)] = str(round(float(totalDays/amountOfFiresWithStartEndDates)))
    except Exception as e:
        print("average/month Function: " + e)  

#Ahmad's Code
def acresMonth(dateStart, dateEnd, month, year, output):
    try:
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
    except Exception as e:
        print("acres/month Function: " + e)

#Ahmad's Code
def countMonth(dateStart, dateEnd, month, year, output):
    try:
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
    except Exception as e:
        print("Count/Month Function: " + e)

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
            url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+location+"'%20AND%20POOState%20%3D%20'US-"+state+"'%20AND(DailyAcres > 1)AND(FireDiscoveryDateTime >= DATE '2003-01-01 00:00:00')AND(FireOutDateTime>= DATE '2003-01-01 00:00:00' OR ContainmentDateTime>= DATE '2003-01-01 00:00:00' OR ControlDateTime>= DATE '2003-01-01 00:00:00')&outFields=IncidentName,ControlDateTime,ContainmentDateTime,DailyAcres,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
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
            numberOfFires = getTotalFiresCounty(location, state, unitTesting)
            #fire cause
            getHumanCausedFires(location, state, False, unitTesting)
            getNaturalCausedFires(location, state, False, unitTesting)
            #total acres burned
            totalAcresSum = totalAcres(location, state, False, unitTesting)
            #avt acres burned per fire
            WildfireResponse["Average Acres Burned Per Fire"] = int(totalAcresSum / numberOfFires)
            #longest fire
            longestBurningFire(output, False)
            #average duration
            averageFireDuration(output, numberOfFires, False)


            
        else:
            print("no fire history")
            WildfireResponse["Total Active Wildfires"] = "Not Available"
            WildfireResponse["Most Recent Fire"] = "Not Available"
            WildfireResponse["Oldest Fire"] = "Not Available"
            WildfireResponse["Total Fires"] = "Not Available"
            WildfireResponse["Total Fires Caused by Humans"] = "Not Available"
            WildfireResponse["Total Fires Caused by Nature"] = "Not Available"
            WildfireResponse["Total Acres Burned"] = "Not Available"
            WildfireResponse["Average Acres Burned Per Fire"] = "Not Available"
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
            url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOState%20%3D%20'US-"+state+"'%20AND(DailyAcres > 1)AND(FireDiscoveryDateTime >= DATE '2015-01-01 00:00:00')AND(FireOutDateTime>= DATE '2015-01-01 00:00:00' OR ContainmentDateTime>= DATE '2015-01-01 00:00:00' OR ControlDateTime>= DATE '2015-01-01 00:00:00')&outFields=IncidentName,ControlDateTime,ContainmentDateTime,DailyAcres,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
            #print(url)
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
            numberOfFires = getTotalFiresState(state, unitTesting)
            #fire cause
            getHumanCausedFires("None", state, True, unitTesting)
            getNaturalCausedFires("None", state, True, unitTesting)
            #total acres burned
            totalAcresSum = totalAcres("None", state, True, unitTesting)
            WildfireStateResponse["Average Acres Burned Per Fire"] = int(totalAcresSum / numberOfFires)    
            #longest fire
            longestBurningFire(output, True)
            #average duration
            averageFireDuration(output, numberOfFires, True)
        else:
            print("no fire history")
            WildfireStateResponse["Total Active Wildfires"] = "Not Available"
            WildfireStateResponse["Most Recent Fire"] = "Not Available"
            WildfireStateResponse["Oldest Fire"] = "Not Available"
            WildfireStateResponse["Total Fires"] = "Not Available"
            WildfireStateResponse["Total Fires Caused by Humans"] = "Not Available"
            WildfireStateResponse["Total Fires Caused by Nature"] = "Not Available"
            WildfireStateResponse["Total Acres Burned"] = "Not Available"
            WildfireStateResponse["Average Acres Burned Per Fire"] = "Not Available"
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
                #print(url)
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
                url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+location+"'%20AND%20POOState%20%3D%20'US-"+state+"'%20AND(DailyAcres > 1)AND(FireDiscoveryDateTime >= DATE '2015-01-01 00:00:00')AND(FireOutDateTime>= DATE '2015-01-01 00:00:00' OR ContainmentDateTime>= DATE '2015-01-01 00:00:00' OR ControlDateTime>= DATE '2015-01-01 00:00:00')&outFields=IncidentName,ControlDateTime,ContainmentDateTime,DailyAcres,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
                #print(url)
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
                #print(url)
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
        except Exception as e:
            print("Total Acres graph Function: " + e)

    #Ahmad's Code
    @app.route("/wildfire/count", methods=['GET'])
    def NumberOfFiresGraph():
        try:
            location = request.args.get("location").strip("+")
            state = request.args.get("state").strip("+")
            test = request.args.get("test")
            if(test == "true"):
                jsonTestData = open('./TestData/wildfireTestData.json')
                output = json.load(jsonTestData)
                jsonTestData.close()
            else:
                url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+location+"'%20AND%20POOState%20%3D%20'US-"+state+"'%20AND%20%20(DailyAcres >= 0.1)%20&outFields=IncidentName,DailyAcres,ContainmentDateTime,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
                #print(url)
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
        except Exception as e:
            print("Number of Fires Graph Function: " + e)
    
    #Ahmad's Code
    @app.route("/wildfire/top10", methods=['GET'])
    def top10Acres():
        try:
            location = request.args.get("location").strip("+")
            state = request.args.get("state").strip("+")
            test = request.args.get("test")
            if(test == "true"):
                jsonTestData = open('./TestData/wildfireTestData.json')
                output = json.load(jsonTestData)
                jsonTestData.close()
            else:
                url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+location+"'%20AND%20POOState%20%3D%20'US-"+state+"'%20AND(DailyAcres > 1)AND(FireDiscoveryDateTime >= DATE '2015-01-01 00:00:00')AND(FireOutDateTime>= DATE '2015-01-01 00:00:00' OR ContainmentDateTime>= DATE '2015-01-01 00:00:00' OR ControlDateTime>= DATE '2015-01-01 00:00:00')&outFields=IncidentName,ControlDateTime,ContainmentDateTime,DailyAcres,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
                #print(url)
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
            res = dict(list(OrderedDict(sorted(top10AcresRes.items(), reverse=True)).items())[0: 10])
            return json.dumps(res)
        except Exception as e:
            print("Top10 Acres Function: " + e)
    
    

    #Ahmad's Code
    @app.route("/wildfire/top10Duration", methods=['GET'])
    def top10Duration():
        try:
            location = request.args.get("location").strip("+")
            state = request.args.get("state").strip("+")
            test = request.args.get("test")
            if(test == "true"):
                jsonTestData = open('./TestData/wildfireTestData.json')
                output = json.load(jsonTestData)
                jsonTestData.close()
            else:
                url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+location+"'%20AND%20POOState%20%3D%20'US-"+state+"'%20AND(DailyAcres > 1)AND(FireDiscoveryDateTime >= DATE '2015-01-01 00:00:00')AND(FireOutDateTime>= DATE '2015-01-01 00:00:00' OR ContainmentDateTime>= DATE '2015-01-01 00:00:00' OR ControlDateTime>= DATE '2015-01-01 00:00:00')&outFields=IncidentName,ControlDateTime,ContainmentDateTime,DailyAcres,FireDiscoveryDateTime,FireOutDateTime&returnGeometry=false&outSR=4326&f=json"
                #print(url)
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

            res = dict(list(OrderedDict(sorted(top10DurationRes.items(), reverse=True)).items())[0: 10])
            return json.dumps(res)
        except Exception as e:
            print("Top10 Duration Function: " + e)
    return app
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8001))
    app = create_app()
    app.run(host="0.0.0.0", port=port)
else:
    gunicorn_app = create_app()




