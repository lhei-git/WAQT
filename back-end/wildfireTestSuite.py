import requests
import json

from WildFire import create_app 

"""
Air Quality Test Suite

To test each endpoint, each endpoint will have a special test version that
loads custom JSON data. The functionality is the same but it does not call the API
due to the data changing. 

Command to run all tests: python3 -m pytest .\wildfireTestSuite.py
"""

def testWildfireCounty():
    response = requests.get("http://localhost:8001/wildfire/county?location=Macomb&state=MI&test=true")
    jsonTestData = open('./TestData/wildfireTestResponse.json')
    data = json.load(jsonTestData)
    jsonTestData.close()
    assert json.loads(response.text) == data

def testWildfireState():
    response = requests.get("http://localhost:8001/wildfire/stateonly?location=MI&test=true")
    jsonTestData = open('./TestData/wildfireTestResponse.json')
    data = json.load(jsonTestData)
    jsonTestData.close()
    assert json.loads(response.text) == data

def testActiveWildfires():
    response = requests.get("http://localhost:8001/mapmarkers?county=Los+Angeles&state=CA&test=true")
    jsonTestData = open('./TestData/activeWildfireTestResponse.json')
    data = json.load(jsonTestData)
    jsonTestData.close()
    assert json.loads(response.text) == data

def testTotalAcresPerMonth():
    response = requests.get("http://localhost:8001/wildfire/acres?location=Los+Angeles&state=CA&test=true")
    jsonTestData = open('./TestData/wildfireAcresTestResponse.json')
    data = json.load(jsonTestData)
    jsonTestData.close()
    assert json.loads(response.text) == data

def testCountPerMonth():
    response = requests.get("http://localhost:8001/wildfire/count?location=Los+Angeles&state=CA&test=true")
    jsonTestData = open('./TestData/wildfireCountTestResponse.json')
    data = json.load(jsonTestData)
    jsonTestData.close()
    assert json.loads(response.text) == data

def testTop10():
    response = requests.get("http://localhost:8001/wildfire/top10?location=Los+Angeles&state=CA&test=true")
    jsonTestData = open('./TestData/wildfireTop10TestResponse.json')
    data = json.load(jsonTestData)
    jsonTestData.close()
    assert json.loads(response.text) == data

def testTop10Duration():
    response = requests.get("http://localhost:8001/wildfire/top10Duration?location=Los+Angeles&state=CA&test=true")
    jsonTestData = open('./TestData/wildfireTop10DurationTestResponse.json')
    data = json.load(jsonTestData)
    jsonTestData.close()
    assert json.loads(response.text) == data