// App.js
import { useEffect, useState } from "react";
import styles from "./app.module.css";
import axios from "axios"

//This returns a table from the wildfire API
//returns Date, Name, Acres and Cause when available

function FireStatsTable() {
  //TODO: get data from map
  const county = 'Wayne'
  const state = 'Michigan'
  const url = 'http://localhost:8001/wildfire/county?location='+county
  const url2 = 'http://localhost:8001/wildfire/state?location='+state
  console.log(url)
  const [data, setData] = useState<any[]>([]);
  const [stateData, setStateData] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(url).then(response => {
      data.push(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get(url2).then(response => {
      stateData.push(response.data);
      setLoading(false);
    });
  }, []);
  
  if (isLoading) {
    return <div >Loading...</div>;
  }else{
    return (
      <div className={styles["basicTable"]}>
          <tr>
            {/* Headers */}
            <th></th>
            <th>{county}</th>
            <th>{state}</th>
          </tr>
          <tr > 
            {/* access json data using each key you need, this will be dynamically allocated */}
            <td>Most Recent Fire Name</td>
            <td>{data[0].MostRecentFireName}</td>
            <td>{stateData[0].MostRecentFireName}</td>
          </tr>
          <tr > 
            {/* access json data using each key you need, this will be dynamically allocated */}
            <td>Most Recent Fire Start Date</td>
            <td>{data[0].MostRecentFireDate}</td>
            <td>{stateData[0].MostRecentFireDate}</td>
          </tr>
          <tr > 
            {/* access json data using each key you need, this will be dynamically allocated */}
            <td>Longest Burning Fire Name</td>
            <td>{data[0].LongestFireName}</td>
            <td>{stateData[0].LongestFireName}</td>
          </tr>
          <tr > 
            {/* access json data using each key you need, this will be dynamically allocated */}
            <td>Longest Burning Fire Start Date</td>
            <td>{data[0].LongestStartDate}</td>
            <td>{stateData[0].LongestStartDate}</td>
          </tr>
          <tr > 
            {/* access json data using each key you need, this will be dynamically allocated */}
            <td>Longest Burning End Date</td>
            <td>{data[0].LongestEndDate}</td>
            <td>{stateData[0].LongestEndDate}</td>
          </tr>
          <tr > 
            {/* access json data using each key you need, this will be dynamically allocated */}
            <td>Average Fire Duration</td>
            <td>{data[0].AverageDuration}</td>
            <td>{stateData[0].AverageDuration}</td>
          </tr>
        
      </div>
    );
  }

    
  

  
}

export default FireStatsTable;