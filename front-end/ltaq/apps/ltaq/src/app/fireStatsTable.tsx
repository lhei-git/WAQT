import { useEffect, useState } from "react";
import styles from "./app.module.css";
import axios from "axios"
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import LaunchIcon from '@mui/icons-material/Launch';

//This returns a table from the wildfire API
//returns Date, Name, Acres and Cause when available
interface Props {
  county: string;
  state: string;
  fullName: string;
}
function FireStatsTable({ county, state, fullName }: Props) {
  //TODO: get data from map
  const url = 'http://localhost:8001/wildfire/county?location=' + county + '&state=' + state
  const url2 = 'http://localhost:8001/wildfire/stateonly?location=' + state
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
        <h1><LocalFireDepartmentIcon fontSize="large" />Current and Historical Fire Data</h1>
        <div className={styles['row']}>
          <div className={styles['column']}> 
            <table>
              <tr className={styles['head']}>
                <th>Fire Statistics</th>
                <th>{fullName}</th>
                <th>{state}</th>
              </tr>
              {Object.keys(data).map((key) => {
                return (
                  <tr > {key}
                    <td>
                      {data[key]}
                    </td>
                    <td>
                    {stateData[key]}
                    </td>
                    <hr />
                  </tr>
                );
              })}
              
            </table>
            <p>*Based on all wildfire contained/controlled/out dates</p>
            <p> <a href = "https://www.nifc.gov/"> Source: National Interagency Fire Agency <LaunchIcon fontSize="small"/></a></p>
          </div>
       
        </div>
      </>
    );
  } else {
    return (
      <h3>Fire Data Not Available For This Location</h3>
    )
  }
}

export default FireStatsTable;