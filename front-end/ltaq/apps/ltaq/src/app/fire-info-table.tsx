// App.js
import { useEffect, useState } from "react";
import styles from "./app.module.css";
import {userLocation} from './searchLocation'

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
          <th>Date</th>
          <th>Name</th>
          <th>Cause</th>
          <th>Acres</th>
        </tr>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.attributes.CreatedOnDateTime_dt}</td>
            <td>{item.attributes.IncidentName}</td>
            <td>{item.attributes.FireCause}</td>
            <td>{item.attributes.DiscoveryAcres}</td>
          </tr>
        ))
        }
      </tbody>
    </div>
  );
}

export default BasicFireInfo;