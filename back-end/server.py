import datetime
import requests, os
import json

from flask import Flask, jsonify, request
from flask_cors import CORS


WildfireResponse = {}

states = {
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

def timeConverter(timeToConvert):
    formatTime = str(timeToConvert)[:-3]
    return str(datetime.datetime.fromtimestamp(int(formatTime)))

def convertSecondsToTime(seconds):
    seconds = seconds % (24 * 3600)
    hour = seconds // 3600
    seconds %= 3600
    minutes = seconds // 60
    seconds %= 60
     
    return "%d:%02d:%02d" % (hour, minutes, seconds)

def fireCheck(output):
    if (len(output['features']) == 0):
        return False
    else:
        return True
def getMostRecentFire(output):
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
    mostRecentStart = output['features'][marker]['attributes']['FireDiscoveryDateTime']
    mostRecentEnd = output['features'][marker]['attributes']['FireOutDateTime']
    WildfireResponse["MostRecentFireName"] = output['features'][marker]['attributes']['IncidentName']
    WildfireResponse["MostRecentFireStart"] = timeConverter(mostRecentStart)
    if(mostRecentEnd):
        WildfireResponse["MostRecentFireEnd"] = timeConverter(mostRecentEnd)
    else:
        WildfireResponse["MostRecentFireEnd"] = "Active"

def longestBurningFire(output):
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
    WildfireResponse["LongestFireName"] = output['features'][marker]['attributes']['IncidentName']
    longestFireStart = output['features'][marker]['attributes']['FireDiscoveryDateTime']
    longestFireEnd = output['features'][marker]['attributes']['FireOutDateTime']
    WildfireResponse["LongestStartDate"] = timeConverter(longestFireStart)
    WildfireResponse["LongestEndDate"] = timeConverter(longestFireEnd)

def averageFireDuration(output):       
     #Average Fire Duration
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

def create_app(config=None):
    app = Flask(__name__)
    # See http://flask.pocoo.org/docs/latest/config/
    app.config.update(dict(DEBUG=True))
    app.config.update(config or {})

    # Setup cors headers to allow all domains
    # https://flask-cors.readthedocs.io/en/latest/
    CORS(app)

    # Definition of the routes. Put them into their own file. See also
    # Flask Blueprints: http://flask.pocoo.org/docs/latest/blueprints
    @app.route("/wildfire/county", methods=['GET'])
    def WildFireCounty():
        location = request.args.get("location").strip("+")
        state = request.args.get("state").strip("+")
        #oldurl = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+location+"'%20AND%20%20(DailyAcres%20%3D%201%20OR%20DailyAcres%20%3D%202000)%20&outFields=DailyAcres,FireOutDateTime,FireDiscoveryDateTime,IncidentName&outSR=4326&f=json"
        url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+location+"'%20AND%20POOState%20%3D%20'US-"+states.get(state.upper())+"'&outFields=FireDiscoveryDateTime,FireOutDateTime,CpxName,IsCpxChild,POOState,ControlDateTime,ContainmentDateTime,DailyAcres,DiscoveryAcres,IncidentName&outSR=4326&f=json"
        print(url)
        response_API = requests.get(url)
        
        output = json.loads(response_API.text)
        # count = len(output['features'])
        # print(output['features'][0]['attributes']['FireDiscoveryDateTime'])
        # print(output['features'][count-1]['attributes']['FireDiscoveryDateTime'])
        
        # WildfireResponse["FireCount"] = count 
        # WildfireResponse["StartDate"] = (output['features'][0]['attributes']['FireDiscoveryDateTime'])
        # WildfireResponse["EndDate"] = (output['features'][count-1]['attributes']['FireDiscoveryDateTime'])
        #print(output['features'][0]['attributes']['FireDiscoveryDateTime'])
        if(fireCheck(output)):
            count = len(output['features'])
            print(output['features'][0]['attributes']['FireDiscoveryDateTime'])
            print(output['features'][count-1]['attributes']['FireDiscoveryDateTime'])
            print(output['features'][count-1]['attributes']['ContainmentDateTime'])
            print(output['features'][count-1]['attributes']['ControlDateTime'])

            WildfireResponse["FireCount"] = count 
            WildfireResponse["Contained"] = count
            WildfireResponse['UnderControl'] = count
            WildfireResponse["StartDate"] = timeConverter(output['features'][0]['attributes']['FireDiscoveryDateTime'])
            WildfireResponse["EndDate"] = timeConverter(output['features'][count-1]['attributes']['FireDiscoveryDateTime'])

#total acres
            sum = 0 
            for i in range(len(output['features'])):
                print(output['features'][i]['attributes']['DailyAcres'])
            if(isinstance(output['features'][i]['attributes']['DailyAcres'], int)):
                sum = sum + output['features'][i]['attributes']['DailyAcres']
                i = i + 1
            else: 
                i = i + 1
            WildfireResponse["TotalAcres"] = sum

            WildfireResponse["FiresAvailable"] = True
            print("fires available")
            getMostRecentFire(output)
            longestBurningFire(output)
            averageFireDuration(output)
    
        else:

            print("no fire history")
            WildfireResponse["FiresAvailable"] = False
            WildfireResponse["AverageDuration"] = "No History"
            WildfireResponse["LongestEndDate"] = "No History"
            WildfireResponse["LongestFireName"] = "No History"
            WildfireResponse["LongestStartDate"] = "No History"
            WildfireResponse["MostRecentFireEnd"] = "No History"
            WildfireResponse["MostRecentFireName"] = "No History"
            WildfireResponse["MostRecentFireStart"] = "No History"
            WildfireResponse["FireCount"] = "No History"
            WildfireResponse["Contained"] = "No History"
            WildfireResponse["UnderControl"] = "No History"
            WildfireResponse["TotalAcres"] = "No History"
            WildfireResponse["StartDate"] = "No History"
            WildfireResponse["EndDate"] = "No History"

        return jsonify(WildfireResponse)
           
    @app.route("/wildfire/stateonly", methods=['GET'])
    def WildFireState():
        location = request.args.get("location").strip("+")
        print(states.get(location.upper()))
        url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOState%20%3D%20'US-"+states.get(location.upper())+"'%20AND%20%20(DailyAcres%20%3D%201%20OR%20DailyAcres%20%3D%202000)%20&outFields=DailyAcres,FireOutDateTime,FireDiscoveryDateTime,IncidentName&outSR=4326&f=json"
        print(url)
        response_API = requests.get(url)
        
        output = json.loads(response_API.text)
        # count = len(output['features'])
        # print(output['features'][0]['attributes']['FireDiscoveryDateTime'])
        # print(output['features'][count-1]['attributes']['FireDiscoveryDateTime'])
        
        # WildfireResponse["FireCount"] = count 
        # WildfireResponse["StartDate"] = (output['features'][0]['attributes']['FireDiscoveryDateTime'])
        # WildfireResponse["EndDate"] = (output['features'][count-1]['attributes']['FireDiscoveryDateTime'])
        #print(output['features'][0]['attributes']['FireDiscoveryDateTime'])

        getMostRecentFire(output)
        longestBurningFire(output)
        averageFireDuration(output)
        return jsonify(WildfireResponse)

    WildfireRes = {}
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

    @app.route("/wildfire/average", methods=['GET'])
    def averageGraphResponse():
        location = request.args.get("location").strip("+")
        state = request.args.get("state").strip("+")
        url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+location+"'%20AND%20POOState%20%3D%20'US-"+states.get(state.upper())+"'&outFields=FireDiscoveryDateTime,FireOutDateTime,CpxName,IsCpxChild,POOState,ControlDateTime,ContainmentDateTime,DailyAcres,DiscoveryAcres,IncidentName&outSR=4326&f=json"
        print(url)
        response_API = requests.get(url)
        output = json.loads(response_API.text)
        dateStart2015 = 1420088400
        dateEnd2015 = 1451538000
        avg2015 = 0
        counts2015 = 0
        for j in range(len(output['features'])):
            print(str(output['features'][j]['attributes']['FireOutDateTime']))
            if (str(output['features'][j]['attributes']['FireOutDateTime'])!= "None"):
                str(output['features'][j]['attributes']['FireOutDateTime'])
                start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                end = str(output['features'][j]['attributes']['FireOutDateTime'])
                if (int(end[:-3]) < dateEnd2015 and int(start[:-3]) > dateStart2015):
                    avg2015 += int(end[:-3]) - int (start[:-3])
                    counts2015 = j
                    print("hello")
                    j = j + 1
                else:
                    j = j + 1
            else: 
                j = j + 1

        if(counts2015 != 0):
            format = convertSecondsToTime(avg2015/counts2015).split(":")
            WildfireRes[2015] = int(format[0])

        #Avg 2016
        dateStart2016 = 1451624400
        dateEnd2016 = 1483160400
        avg2016 = 0
        counts2016 = 0
        for j in range(len(output['features'])):
            print(str(output['features'][j]['attributes']['FireOutDateTime']))
            if (str(output['features'][j]['attributes']['FireOutDateTime'])!= "None"):
                str(output['features'][j]['attributes']['FireOutDateTime'])
                start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                end = str(output['features'][j]['attributes']['FireOutDateTime'])
                if (int(end[:-3]) < dateEnd2016 and int(start[:-3]) > dateStart2016):
                    avg2016 += int(end[:-3]) - int (start[:-3])
                    counts2016 = j
                    print("hello")
                    j = j + 1
                else:
                    j = j + 1
            else: 
                j = j + 1

        if(counts2016 != 0):
            format = convertSecondsToTime(avg2016/counts2016).split(":")
            WildfireRes[2016] = int(format[0])


        #Avg2017
        dateStart2017 = 1483246800
        dateEnd2017 = 1514696400
        avg2017 = 0
        counts2017 = 0
        for j in range(len(output['features'])):
            print(str(output['features'][j]['attributes']['FireOutDateTime']))
            if (str(output['features'][j]['attributes']['FireOutDateTime'])!= "None"):
                str(output['features'][j]['attributes']['FireOutDateTime'])
                start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                end = str(output['features'][j]['attributes']['FireOutDateTime'])
                if (int(end[:-3]) < dateEnd2017 and int(start[:-3]) > dateStart2017):
                    avg2017 += int(end[:-3]) - int (start[:-3])
                    counts2017 = j
                    print("hello")
                    j = j + 1
                else:
                    j = j + 1
            else: 
                j = j + 1

        if(counts2017 != 0):
            format = convertSecondsToTime(avg2017/counts2017).split(":")
            WildfireRes[2017] = int(format[0])

    
    #Avg2018

        dateStart2018 = 1514782800
        dateEnd2018 = 1546232400
        avg2018 = 0
        counts2018 = 0
        for j in range(len(output['features'])):
            print(str(output['features'][j]['attributes']['FireOutDateTime']))
            if (str(output['features'][j]['attributes']['FireOutDateTime'])!= "None"):
                str(output['features'][j]['attributes']['FireOutDateTime'])
                start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                end = str(output['features'][j]['attributes']['FireOutDateTime'])
                if (int(end[:-3]) < dateEnd2018 and int(start[:-3]) > dateStart2018):
                    avg2018 += int(end[:-3]) - int (start[:-3])
                    counts2018 = j
                    print("hello")
                    j = j + 1
                else:
                    j = j + 1
            else: 
                j = j + 1

        if(counts2018 != 0):
            format = convertSecondsToTime(avg2018/counts2018).split(":")
            WildfireRes[2018] = int(format[0])

    
    #Avg2019

        dateStart2019 = 1546318800
        dateEnd2019 = 1577768400
        avg2019 = 0
        counts2019 = 0
        for j in range(len(output['features'])):
            print(str(output['features'][j]['attributes']['FireOutDateTime']))
            if (str(output['features'][j]['attributes']['FireOutDateTime'])!= "None"):
                str(output['features'][j]['attributes']['FireOutDateTime'])
                start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                end = str(output['features'][j]['attributes']['FireOutDateTime'])
                if (int(end[:-3]) < dateEnd2019 and int(start[:-3]) > dateStart2019):
                    avg2019 += int(end[:-3]) - int (start[:-3])
                    counts2019 = j
                    print("hello")
                    j = j + 1
                else:
                    j = j + 1
            else: 
                j = j + 1

        if(counts2019 != 0):
            format = convertSecondsToTime(avg2019/counts2019).split(":")
            WildfireRes[2019] = int(format[0])

    
    #Avg2020

        dateStart2020 = 1577854800
        dateEnd2020 = 1609390800
        avg2020 = 0
        counts2020 = 0
        for j in range(len(output['features'])):
            print(str(output['features'][j]['attributes']['FireOutDateTime']))
            if (str(output['features'][j]['attributes']['FireOutDateTime'])!= "None"):
                str(output['features'][j]['attributes']['FireOutDateTime'])
                start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                end = str(output['features'][j]['attributes']['FireOutDateTime'])
                if (int(end[:-3]) < dateEnd2020 and int(start[:-3]) > dateStart2020):
                    avg2020 += int(end[:-3]) - int (start[:-3])
                    counts2020 = j
                    print("hello")
                    j = j + 1
                else:
                    j = j + 1
            else: 
                j = j + 1

        if(counts2020 != 0):
            format = convertSecondsToTime(avg2020/counts2020).split(":")
            WildfireRes[2020] = int(format[0])


    #Avg2021

        dateStart2021 = 1609477200
        dateEnd2021 = 1640926800
        avg2021 = 0
        counts2021 = 0
        for j in range(len(output['features'])):
            print(str(output['features'][j]['attributes']['FireOutDateTime']))
            if (str(output['features'][j]['attributes']['FireOutDateTime'])!= "None"):
                str(output['features'][j]['attributes']['FireOutDateTime'])
                start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                end = str(output['features'][j]['attributes']['FireOutDateTime'])
                if (int(end[:-3]) < dateEnd2021 and int(start[:-3]) > dateStart2021):
                    avg2021 += int(end[:-3]) - int (start[:-3])
                    counts2021 = j
                    print("hello")
                    j = j + 1
                else:
                    j = j + 1
            else: 
                j = j + 1

        if(counts2021 != 0):
            format = convertSecondsToTime(avg2021/counts2021).split(":")
            WildfireRes[2021] = int(format[0])


    #Avg2022

        dateStart2022 = 1641013200
        dateEnd2022 = 1672462800
        avg2022 = 0
        counts2022 = 0
        for j in range(len(output['features'])):
            print(str(output['features'][j]['attributes']['FireOutDateTime']))
            if (str(output['features'][j]['attributes']['FireOutDateTime'])!= "None"):
                str(output['features'][j]['attributes']['FireOutDateTime'])
                start = str(output['features'][j]['attributes']['FireDiscoveryDateTime'])
                end = str(output['features'][j]['attributes']['FireOutDateTime'])
                if (int(end[:-3]) < dateEnd2022 and int(start[:-3]) > dateStart2022):
                    avg2022 += int(end[:-3]) - int (start[:-3])
                    counts2022 = j
                    print("hello")
                    j = j + 1
                else:
                    j = j + 1
            else: 
                j = j + 1

        if(counts2022 != 0):
            format = convertSecondsToTime(avg2022/counts2022).split(":")
            WildfireRes[2022] = int(format[0])


        print(WildfireRes)
        return jsonify(WildfireRes)


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
    

    def NumberOfFiresGraph(Result, output):
        if(fireCheck(output)):
            count = len(output['features'])
            WildfireResponse["FireCount"] = count 
            WildfireRes[2022] = Result

    return app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8001))
    app = create_app()
    app.run(host="0.0.0.0", port=port)