import requests, os
import json

from flask import Flask, jsonify, make_response
from flask_cors import CORS

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
    @app.route("/", methods=['GET'])
    def WildFire():
       response_API = requests.get("https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=POOCounty%20%3D%20'SANDERS'&outFields=IncidentName,FireCause,DiscoveryAcres,CreatedOnDateTime_dt&outSR=4326&f=json")
       res = json.loads(response_API.text)
       return jsonify(res)

    def WildFireData(IncidentName, CalculatedAcres):
        options = {}
        options["url"] = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=1%3D1&outFields=CalculatedAcres,IncidentName&outSR=4326&f=json"
        options["Incident_Name"] = IncidentName
        options["Calculated_Acres"] = CalculatedAcres

    return app



if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8001))
    app = create_app()
    app.run(host="0.0.0.0", port=port)



