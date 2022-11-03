// This is the table that gathers current AQI Values
// Use this as an example for other tables
// see airnow.py for the endpoint 
import { useEffect, useState } from "react";
import styles from "./app.module.css";
import axios from "axios"

interface Props {
  lat: number;
  lng: number;
}
//This returns a table from the wildfire API
//returns Date, Name, Acres and Cause when available
function CurrentAQI({ lat, lng }: Props) {
  if (lng < 0) {
    lng = lng * -1;
  }

  //request to get data from your python file:
  const [data, setData] = useState<any[]>([]);
  const url = "http://localhost:8000/aqi?lat=" + lat + "&lon=" + lng;
  console.log(url)
  useEffect(() => {
    axios.get(url)
      .then((response) => setData(response.data));
  }, []);
  //render all data here:
  return (
    <div>
      {data.map((item, index) => (
          <div className="w3-quarter w3-margin-right	">
            <div className="w3-container" style={{
            backgroundColor: (item.Category.Name == "Good") ? 'green' : (item.Category.Name == "Moderate" ? 'yellow': 'red'),
            color: (item.Category.Name == "Good") ? 'white' : (item.Category.Name == "Moderate" ? 'black': 'white'),
           }}>
              <div className="w3-left"><h1>{item.ParameterName}</h1></div>
              <div className="w3-center">
                <h1>{item.AQI}</h1>
              </div>
              <div className="w3-clear"></div>
              <h2>{item.Category.Name}</h2>
            </div>
          </div>
      ))
      }
    </div>
  );
}

export default CurrentAQI;