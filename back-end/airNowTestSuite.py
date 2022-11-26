import requests
import json

from airnow import airNowEndpoint 

'''
Air Quality Test Suite

To test each endpoint, each endpoint will have a special test version that
loads custom JSON data. The functionality is the same but it does not call the API
due to the data changing. 
'''

#Test currentAqi endpoint
#localhost:8000/aqi/test
def testCurrentAQI():
    response = requests.get("http://localhost:8000/aqi/test")
    jsonTestData = open('./TestData/currentAQIResponse.json')
    data = json.load(jsonTestData)
    jsonTestData.close()
    assert json.loads(response.text) == data

def testGetTrends():
    response = requests.get("http://localhost:8000/trends/test")
    jsonTestData = open('./TestData/aqiTrendResponse.json')
    data = json.load(jsonTestData)
    jsonTestData.close()
    print(json.loads(response.text))
    assert json.loads(response.text) == data

