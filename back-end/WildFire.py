import datetime
import requests, os
import json

from flask import Flask, jsonify, request
from flask_cors import CORS


API_KEY = ""

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
    @app.route("/Wildfire", methods=['GET'])
    def WildFire():
        location = request.args.get("county").strip("+")
        print(location)
        url = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'"+location+"'%20AND%20%20(DailyAcres%20%3D%201%20OR%20DailyAcres%20%3D%202000)%20&outFields=DailyAcres,FireOutDateTime,FireDiscoveryDateTime,IncidentName&outSR=4326&f=json"
        response_API = requests.get(url)
        WildfireResponse = {}
        output = json.loads(response_API.text)
        # count = len(output['features'])
        # print(output['features'][0]['attributes']['FireDiscoveryDateTime'])
        # print(output['features'][count-1]['attributes']['FireDiscoveryDateTime'])
        

        # WildfireResponse["FireCount"] = count 
        # WildfireResponse["StartDate"] = (output['features'][0]['attributes']['FireDiscoveryDateTime'])
        # WildfireResponse["EndDate"] = (output['features'][count-1]['attributes']['FireDiscoveryDateTime'])
        #print(output['features'][0]['attributes']['FireDiscoveryDateTime'])

        #most recent fire row
        mostRecentFireDate = output['features'][len(output['features'])-1]['attributes']['FireDiscoveryDateTime']
        
        WildfireResponse["MostRecentFireDate"] = timeConverter(mostRecentFireDate)
        WildfireResponse["MostRecentFireName"] = output['features'][len(output['features'])-1]['attributes']['IncidentName']

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
        return jsonify(WildfireResponse)

    return app



if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8001))
    app = create_app()
    app.run(host="0.0.0.0", port=port)



