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
function CurrentAQI({lat, lng}: Props) {
  if (lng < 0) {
    lng = lng * -1;
}

  //request to get data from your python file:
  const [data, setData] = useState<any[]>([]);
  const url = "http://localhost:8000/aqi?lat="+lat+"&lon="+lng;
  console.log(url)
  useEffect(() => {
    axios.get(url)
      .then((response) => setData(response.data));
    }, []);
  //render all data here:
  return (
    <span>
    <div className={styles["basicTable"]}>
    <h3>Current Air Quality</h3>
      <table>
        <tr>
          {/* Headers */}
          <th>Pollutant</th>
          <th>AQI</th>
          <th>Level of Concern</th>
        </tr>
        {data.map((item, index) => (
          <tr key={index} style={{
            backgroundColor: (item.Category.Name == "Good") ? 'green' : 'yellow',
            color: (item.Category.Name == "Good") ? 'white' : 'black',
           }}>
            {/*a ? b : (c ? d : e) */}
            <td >{item.ParameterName}</td>
            <td >{item.AQI}</td>
            <td >{item.Category.Name}</td>
          </tr>
        ))
        }
      </table>
      <br />
      <p><b>PM2.5: </b>Fine particulates with a diameter of 2.5 μm or less.</p>
      <br />
      <p><b>PM10: </b>Particulates with a diameter of 10 μm or less.</p>
      <br />
      <p><b>Ozone: </b>Formed by the sun’s ultraviolet rays. Exposure can lead to skin cancer and similar complications.</p>
      <br />
    </div>
    </span>
  );
}

export default CurrentAQI;