#Example file for testing only 
#Do not use in final product
import requests, os
# Do not push API_KEY to GitHub
API_KEY = ""
# how to call the air now api
def downloadData():
        # API parameters
        options = {}
        options["url"] = "https://airnowapi.org/aq/data/"
        options["start_date"] = "2014-09-23"
        options["start_hour_utc"] = "22"
        options["end_date"] = "2014-09-23"
        options["end_hour_utc"] = "23"
        options["parameters"] = "o3,pm25"
        options["bbox"] = "-90.806632,24.634217,-71.119132,45.910790"
        options["data_type"] = "a"
        options["format"] = "application/json"
        options["ext"] = "json"
        options["api_key"] = API_KEY

        # API request URL
        REQUEST_URL = options["url"] \
                    + "?startdate=" + options["start_date"] \
                    + "t" + options["start_hour_utc"] \
                    + "&enddate=" + options["end_date"] \
                    + "t" + options["end_hour_utc"] \
                    + "&parameters=" + options["parameters"] \
                    + "&bbox=" + options["bbox"] \
                    + "&datatype=" + options["data_type"] \
                    + "&format=" + options["format"] \
                    + "&api_key=" + options["api_key"]
        r = requests.get(REQUEST_URL)
        with open("output.txt",'wb') as f:
            f.write(r.content)
downloadData()
# how to delete file
if os.path.exists("output.txt"):
  print("FOUND!!")
  os.remove("output.txt")
else:
  print("The file does not exist")