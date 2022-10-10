import { useEffect, useState } from "react";
import styles from "./app.module.css";
import {userLocation} from './searchLocation'

//This returns a table from the wildfire API
//returns Date, Name, Acres and Cause when available
function BasicFireInfo() {

  const [data, setData] = useState<any[]>([]);
  const url = 'http://127.0.0.1:8001/search?location='+userLocation;
  console.log(url)
  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((actualData) => {
        setData(actualData.features.slice(0,10));
      })
      .catch((err) => {
        console.log(err.message);
      });
       
    }, []);
  
  return (
    <div className={styles["basicTable"]}>
      <tbody>
        <tr>
          <th>Total Fires</th>
          <th>Contained Fires</th>
          <th>Under Control</th>
          <th>Total Acres</th>
          <th>Most Recent Fire</th>
          <th>Longest Burning</th>
          <th>Fire Complexity</th>
          <th>Average Fire Duration</th>
         

        </tr>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.attributes.Containment}</td>
            <td>{item.attributes.Controlled}</td>
            <td>{item.attributes.AcresBurned}</td>
            <td>{item.attributes.MostRecent}</td>
            <td>{item.attributes.FireComplexity}</td>
            <td>{item.attributes.Duration}</td>

          </tr>
        ))
        }
      </tbody>
    </div>
  );
}

export default BasicFireInfo;