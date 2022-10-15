// This is the table that gathers current AQI Values
// Use this as an example for other tables
// see airnow.py for the endpoint 
import { useEffect, useState } from "react";
import styles from "./app.module.css";
import axios from "axios"

//This returns a table from the wildfire API
//returns Date, Name, Acres and Cause when available
function CurrentAQI() {

  //request to get data from your python file:
  const [data, setData] = useState<any[]>([]);
  const lat = 36.6002;
  const lon = 121.8947;
  const url = "http://localhost:8000/aqi?lat="+lat+"&lon="+lon;
  console.log(url)
  useEffect(() => {
    axios.get(url)
      .then((response) => setData(response.data));
    }, []);
  //render all data here:
  return (
    <span>
    <div className={styles["basicTable"]}>
      <tbody>
        <tr>
          {/* Headers */}
          <th>Pollutant</th>
          <th>AQI</th>
          <th>Level of Concern</th>
        </tr>
        {data.map((item, index) => (
          <tr key={index}>
            {/* access json data using each key you need, this will be dynamically allocated */}
            <td>{item.ParameterName}</td>
            <td>{item.AQI}</td>
            <td>{item.Category.Name}</td>
          </tr>
        ))
        }
      </tbody>
    </div>
    </span>
  );
}

export default CurrentAQI;