import requests, os, json, urllib.request, ssl
from flask import Flask, jsonify
from flask_cors import CORS

ssl._create_default_https_context = ssl._create_unverified_context

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
       with urllib.request.urlopen("https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=1%3D1&outFields=CalculatedAcres,IncidentName&outSR=4326&f=json") as url:
        res = json.load(url)
        print(res)
       return res

    #To be updated once we have more specific data parameters
    def WildFireData(IncidentName, CalculatedAcres):
        options = {}
        options["url"] = "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Fire_History_Locations_Public/FeatureServer/0/query?where=1%3D1&outFields=CalculatedAcres,IncidentName&outSR=4326&f=json"
        options["Incident_Name"] = IncidentName
        options["Calculated_Acres"] = CalculatedAcres

    return app


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app = create_app()
    app.run(host="0.0.0.0", port=port)