// App.js
import { useEffect, useState } from "react";
import styles from "./app.module.css";
import axios from "axios"

//This returns a table from the wildfire API
//returns Date, Name, Acres and Cause when available

function ActiveFiresTable() {
  //TODO: get data from map
  const county = 'Perry'
  const url = 'http://localhost:8001/active?location=Perry'+county
  console.log(url)
  const [data, setData] = useState<any[]>([]);
  const [stateData, setStateData] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(url).then(response => {
      setData(response.data);
      setLoading(false);
    });
  }, []);

  
  if (isLoading) {
    return <div >Loading...</div>;
  }else{
    return (
      
      <div className={styles['row']}>
      <div className={styles['column']}>
        <table>
          <tr>
            {/* Headers */}
            <th>Fire Name</th>
            <th>County</th>
          </tr>
          <tr>
            <th>{data[0].IncidentName}</th>
            <th>{data[0].POOCounty}</th>
          </tr>
        </table>
      </div>
    </div>
    );
  }
  
}

export default ActiveFiresTable;