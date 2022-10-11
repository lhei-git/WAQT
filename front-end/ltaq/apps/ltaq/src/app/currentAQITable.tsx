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
  const url = "http://localhost:8000/aqi";
  console.log(url)
  useEffect(() => {
    axios.get(url)
      .then((response) => setData(response.data));
    }, []);
  //render all data here:
  return (
    <div className={styles["basicTable"]}>
      <tbody>
        <tr>
          <th>AQI</th>
          <th>Value</th>
          <th>Level of Concern</th>
        </tr>
        {data.map((item, index) => (
          <tr key={index}>
            {/* access json data using each key you need */}
            <td>{item.ParameterName}</td>
            <td>{item.AQI}</td>
            <td>{item.Category.Name}</td>
          </tr>
        ))
        }
      </tbody>
    </div>
  );
}

export default CurrentAQI;