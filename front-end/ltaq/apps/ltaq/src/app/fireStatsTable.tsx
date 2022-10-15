// App.js
import { useEffect, useState } from "react";
import styles from "./app.module.css";
import axios from "axios"

//This returns a table from the wildfire API
//returns Date, Name, Acres and Cause when available
function FireStatsTable() {

  const [data, setData] = useState<any[]>([]);
  const url = 'http://localhost:8001/Wildfire?county=LOS+ANGELES'
  console.log(url)
  useEffect(() => {
    axios.get(url)
      .then((response) => setData(response.data));
    }, []);
  
  return (
    <div className={styles["basicTable"]}>
      <tbody>
        <tr>
          <td>{data}</td>
        </tr>
        {data.map((item, index) => (
          <tr key={index}>
            <td>"Most Recent Fire Date"</td>
            <td>{item.MostRecentFireDate}</td>
          </tr>
        ))
        }
        {data.map((item, index) => (
          <tr key={index}>
            <td>"Longest Fire Name"</td>
            <td>{item.LongestFireName}</td>
          </tr>
        ))
        }
        {data.map((item, index) => (
          <tr key={index}>
            <td>"Longest Fire Start Date"</td>
            <td>{item.LongestStartDate}</td>
          </tr>
        ))
        }
        {data.map((item, index) => (
          <tr key={index}>
            <td>"Longest Fire End Date"</td>
            <td>{item.LongestEndDate}</td>
          </tr>
        ))
        }
        {data.map((item, index) => (
          <tr key={index}>
            <td>"Average Fire Duration"</td>
            <td>{item.AverageDuration}</td>
          </tr>
        ))
        }
      </tbody>
    </div>
  );
}

export default FireStatsTable;