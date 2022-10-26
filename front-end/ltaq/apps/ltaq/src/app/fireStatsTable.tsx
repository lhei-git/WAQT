import { useEffect, useState } from "react";
import styles from "./app.module.css";
import axios from "axios"

//This returns a table from the wildfire API
//returns Date, Name, Acres and Cause when available
interface Props {
  county: string;
  state: string;
}
function FireStatsTable({county, state}: Props) {
  //TODO: get data from map
  const url = 'http://localhost:8001/wildfire/county?location='+county+'&state='+state
  const url2 = 'http://localhost:8001/wildfire/stateonly?location='+state
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
      
      <div className={styles['row']}>
      <div className={styles['column']}>
        <table>
          <tr>
            {/* Headers */}
            <th></th>
            <th>{county}</th>
            <th>{state}</th>
          </tr>
          <tr > 
            {/* access json data using each key you need, this will be dynamically allocated */}
            <td>Total Fires</td>
            <td>{data[0].FireCount}</td>
            <td>{stateData[0].FireCount}</td>
          </tr>
          <tr > 
            {/* access json data using each key you need, this will be dynamically allocated */}
            <td>Contained Fires</td>
            <td>{data[0].Contained}</td>
            <td>{stateData[0].Contained}</td>
          </tr>
          <tr > 
            {/* access json data using each key you need, this will be dynamically allocated */}
            <td>Controlled Fires</td>
            <td>{data[0].UnderControl}</td>
            <td>{stateData[0].UnderControl}</td>
          </tr>
          <tr > 
            {/* access json data using each key you need, this will be dynamically allocated */}
            <td>Total Acres</td>
            <td>{data[0].TotalAcres}</td>
            <td>{stateData[0].TotalAcres}</td>
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
            <td>{data[0].MostRecentFireStart}</td>
            <td>{stateData[0].MostRecentFireStart}</td>
          </tr>
          <tr > 
            {/* access json data using each key you need, this will be dynamically allocated */}
            <td>Most Recent Fire End Date</td>
            <td>{data[0].MostRecentFireEnd}</td>
            <td>{stateData[0].MostRecentFireEnd}</td>
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
        </table>
      </div>
    </div>
    );
  }

    
  
}

export default FireStatsTable;