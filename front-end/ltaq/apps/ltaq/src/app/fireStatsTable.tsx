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
  let dataAvalable = false
  useEffect(() => {
    axios.get(url)
      .then((response) => setData(response.data));
    }, []);

  useEffect(() => {
    axios.get(url2)
      .then((response) => setStateData(response.data));
    }, []);
  console.log(data)
  console.log(stateData)
  if (data && stateData) {
    return (
      <>
      <h3>Current and Historical Fire Data</h3>
      <div className={styles['row']}>
        <div className={styles['column']}>
        <table>
          <tr>
            <th>Fire Statistics</th>
            <th>Location</th>
          </tr>
          {Object.keys(data).map((key) => {
                return (
                  <tr > {key}:
                    <td>
                      {data[key]}
                    </td>
                    <td>

                    </td>
                    <hr />
                  </tr>
                );
              })}
        </table>
        </div>
        <div className={styles['column']}>
          <table>
              {/* access json data using each key you need, this will be dynamically allocated */}
              <td><b>State Fire Statistics</b></td>
              {Object.keys(stateData).map((key) => {
                return (
                  <tr key={key}>
                    <td>
                      {stateData[key]}
                    </td>

                    <hr />
                  </tr>
                );
              })}
          </table>
        </div>
      </div>
      </>
    );
  }else{
    return (
      <h3>Fire Data Not Available For This Location</h3>
    )
    
  }

    
  
}

export default FireStatsTable;