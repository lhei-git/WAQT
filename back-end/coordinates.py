import requests, os
import json
from flask import Flask, jsonify, request


def coordinates(config=None):
    app = Flask(__name__)


#route for url to connect
    @app.route("/search", methods=['GET'])

    def downloadData():
            # API request URL
            city = request.args.get("City")
            URL = "https://geocode.maps.co/search?q="+str(city)
            print(URL)
            response = requests.get(URL)
            res = json.loads(response.text)
            lat = res[0]['lat']
            lon = res[0]['lon']
            print (lat, lon)
            output = {"Lat" : lat, "Lon" : lon}
            return jsonify(output)
    return app 


# extracts and prints the latitude and longitude coordinates 


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8002))
    app = coordinates()
    app.run(host="0.0.0.0", port=port)
    