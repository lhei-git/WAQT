// App.js
import { useEffect, useState } from "react";
import styles from "./app.module.css";

function BasicFireInfo() {

  const [data, setData] = useState<any[]>([]);

  const fetchData = () => {
    fetch(`http://127.0.0.1:8001/`)
      .then((response) => response.json())
      .then((actualData) => {
        setData(actualData.features.slice(0,10));
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    fetchData();
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
        ))}
      </tbody>
    </div>
  );
}

export default BasicFireInfo;