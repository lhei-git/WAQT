import re
import requests, os
import json

from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime


API_KEY = ""


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
        response_API = requests.get("https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=1%3D1&outFields=CalculatedAcres,DailyAcres,IncidentName,FireOutDateTime,FireDiscoveryDateTime,ControlDateTime,ContainmentDateTime,DiscoveryAcres&outSR=4326&f=json")
        WildfireResponse = {}
        output = json.loads(response_API.text)
        count = len(output['features'])
        print(output['features'][0]['attributes']['FireDiscoveryDateTime'])
        print(output['features'][count-1]['attributes']['FireDiscoveryDateTime'])
        print(output['features'][count-1]['attributes']['ContainmentDateTime'])
        print(output['features'][count-1]['attributes']['ControlDateTime'])


        WildfireResponse["FireCount"] = count 
        WildfireResponse["Contained"] = count
        WildfireResponse['UnderControl'] = count
        WildfireResponse["StartDate"] = (output['features'][0]['attributes']['FireDiscoveryDateTime'])
        WildfireResponse["EndDate"] = (output['features'][count-1]['attributes']['FireDiscoveryDateTime'])

#total acres

        sum = 0 
        for i in range(len(output['features'])):
            print(output['features'][i]['attributes']['DailyAcres'])
            if (isinstance(output['features'][i]['attributes']['DailyAcres'], int)):
                sum = sum + output['features'][i]['attributes']['DailyAcres']
                i = i + 1
            else: 
                i = i + 1
        WildfireResponse["TotalAcres"] = sum


        return json.dumps(WildfireResponse)


#1 url keep same function
    
    @app.route("/WildfireData", methods=['GET'])
    def WildFireData(IncidentName, CalculatedAcres, DailyAcres, ContainmentDateTime, ControlDateTime, DiscoveryAcres, FireDiscoveryDateTime, FireOutDateTime ):
        options = {}
        options["url"] = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=1%3D1&outFields=CalculatedAcres,DailyAcres,IncidentName,FireOutDateTime,FireDiscoveryDateTime,ControlDateTime,ContainmentDateTime,DiscoveryAcres&outSR=4326&f=json"
        options["Incident_Name"] = IncidentName
        options["Calculated_Acres"] = CalculatedAcres
        options["Daily_Acres"]= DailyAcres
        options["Containment_Date_Time"] = ContainmentDateTime
        options["Control_Date_Time"] = ControlDateTime
        options["Discovery_Acres"] = DiscoveryAcres
        options["Fire_Discovery_Date_Time"] = FireDiscoveryDateTime
        options["Fire_Out_Date_Time"] = FireOutDateTime


        return json.dumps(response_API)

    return app

   

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app = create_app()
    app.run(host="0.0.0.0", port=port)