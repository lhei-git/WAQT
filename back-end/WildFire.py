import datetime
from operator import contains
import requests, os
import json

from flask import Flask, jsonify, request
from flask_cors import CORS

ActiveFireResponse = {}
WildfireResponse = {}

# states = {
#     "ALABAMA": "AL",
#     "ALASKA": "AK",
#     "ARIZONA": "AZ",
#     "ARKANSAS": "AR",
#     "CALIFORNIA": "CA",
#     "COLORADO": "CO",
#     "CONNECTICUT": "CT",
#     "DELAWARE": "DE",
#     "FLORIDA": "FL",
#     "GEORGIA": "GA",
#     "HAWAII": "HI",
#     "IDAHO": "ID",
#     "ILLINOIS": "IL",
#     "INDIANA": "IN",
#     "IOWA": "IA",
#     "KANSAS": "KS",
#     "KENTUCKY": "KY",
#     "LOUISIANA": "LA",
#     "MAINE": "ME",
#     "MARYLAND": "MD",
#     "MASSACHUSETTS": "MA",
#     "MICHIGAN": "MI",
#     "MINNESOTA": "MN",
#     "MISSISSIPPI": "MS",
#     "MISSOURI": "MO",
#     "MONTANA": "MT",
#     "NEBRASKA": "NE",
#     "NEVADA": "NV",
#     "NEW HAMPSHIRE": "NH",
#     "NEW JERSEY": "NJ",
#     "NEW MEXICO": "NM",
#     "NEW YORK": "NY",
#     "NORTH CAROLINA": "NC",
#     "NORTH DAKOTA": "ND",
#     "OHIO": "OH",
#     "OKLAHOMA": "OK",
#     "OREGON": "OR",
#     "PENNSYLVANIA": "PA",
#     "RHODE ISLAND": "RI",
#     "SOUTH CAROLINA": "SC",
#     "SOUTH DAKOTA": "SD",
#     "TENNESSEE": "TN",
#     "TEXAS": "TX",
#     "UTAH": "UT",
#     "VERMONT": "VT",
#     "VIRGINIA": "VA",
#     "WASHINGTON": "WA",
#     "WEST VIRGINIA": "WV",
#     "WISCONSIN": "WI",
#     "WYOMING": "WY",
# }

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

def fireControlCount(output):
    count = 0
    for i in range(len(output['features'])):
        if(output['features'][i]['attributes']['ControlDateTime'] != "None" ):
            count = count + 1
    WildfireResponse["Current Number of Controlled Fires"] = count

def fireContainedCount(output, type):
    count = 0
    for i in range(len(output['features'])):
        if(output['features'][i]['attributes']['ContainmentDateTime'] != "None"):
            count = count + 1
    WildfireResponse["Current Number of Contained Fires"] = count

def fireOutCount(output):
    count = 0
    for i in range(len(output['features'])):
        if(output['features'][i]['attributes']['FireOutDateTime'] != "None"):
            count = count + 1
    WildfireResponse["Current Number of Put Out Fires"] = count

def totalAcres(output):
    sum = 0 
    for i in range(len(output['features'])):
        print(output['features'][i]['attributes']['DailyAcres'])
        if(str(output['features'][i]['attributes']['DailyAcres']) != "None"):
            sum = sum + int(output['features'][i]['attributes']['DailyAcres'])
            i = i + 1
        else: 
            i = i + 1
    WildfireResponse["TotalAcres"] = sum

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
    mostRecentStart = timeConverter(output['features'][marker]['attributes']['FireDiscoveryDateTime']).split(" ")

    WildfireResponse["Most Recent Fire"] = output['features'][marker]['attributes']['IncidentName'] +" " + mostRecentStart[0]


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
     
    longestFireStart = timeConverter(output['features'][marker]['attributes']['FireDiscoveryDateTime']).split(" ")
    longestFireEnd = timeConverter(output['features'][marker]['attributes']['FireOutDateTime']).split(" ")

    WildfireResponse["Longest Fire"] = output['features'][marker]['attributes']['IncidentName'] + " " + longestFireStart[0] +" - " + longestFireEnd[0]


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

    formatted = convertSecondsToTime(avgDiff / amount).strip(":")
    WildfireResponse["Average Time Until Fire is Out"] = formatted[0] + " Day(s)"

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
        WildfireResponse.clear()
        location = request.args.get("location").strip("+")
        state = request.args.get("state").strip("+")
        #oldurl = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+location+"'%20AND%20%20(DailyAcres%20%3D%201%20OR%20DailyAcres%20%3D%202000)%20&outFields=DailyAcres,FireOutDateTime,FireDiscoveryDateTime,IncidentName&outSR=4326&f=json"
        url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+location+"'%20AND%20POOState%20%3D%20'US-"+state+"'&outFields=FireDiscoveryDateTime,FireOutDateTime,CpxName,IsCpxChild,POOState,ControlDateTime,ContainmentDateTime,DailyAcres,DiscoveryAcres,IncidentName&outSR=4326&f=json"
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
            print("fires available")
            #total fires
            fireOutCount(output)
            #total acres
            totalAcres(output)
            #avg time to put out
            averageFireDuration(output)
            #most recent fire
            getMostRecentFire(output)
            #longest fire
            longestBurningFire(output)
            
    
        else:
            print("no fire history")
        return jsonify(WildfireResponse)


    @app.route("/wildfire/stateonly", methods=['GET'])
    def WildFireState():
        WildfireResponse.clear()
        location = request.args.get("location").strip("+")
        url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOState%20%3D%20'US-"+location+"'%20AND%20%20(DailyAcres%20%3D%201%20OR%20DailyAcres%20%3D%202000)%20&outFields=DailyAcres,FireOutDateTime,FireDiscoveryDateTime,IncidentName&outSR=4326&f=json"
        print(url)
        response_API = requests.get(url)
        
        output = json.loads(response_API.text)
        print("fires available")
            #total fires
        fireOutCount(output)
            #total acres
        totalAcres(output)
            #avg time to put out
        averageFireDuration(output)
            #most recent fire
        getMostRecentFire(output)
            #longest fire
        longestBurningFire(output)
        getMostRecentFire(output)
        longestBurningFire(output)
        averageFireDuration(output)
        return jsonify(WildfireResponse)
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
        for i in range(len(output['features'])):
            fireStartDate = output['features'][i]['attributes']["irwin_FireDiscoveryDateTime"]
            ActiveFireResponse["IncidientName"] = output['features'][i]['attributes']["irwin_IncidentName"]
            ActiveFireResponse["DiscoveryDate"] = timeConverter(fireStartDate)
            ActiveFireResponse["irwin_InitialLatitude"] = output['features'][i]['attributes']["irwin_InitialLatitude"]
            ActiveFireResponse["irwin_InitialLongitude"] = output['features'][i]['attributes']["irwin_InitialLongitude"]

        return jsonify(ActiveFireResponse)
    return app
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8001))
    app = create_app()
    app.run(host="0.0.0.0", port=port)


