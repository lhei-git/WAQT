import { useEffect, useState } from "react";
import styles from "./app.module.css";
import axios from "axios"
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import LaunchIcon from '@mui/icons-material/Launch';
import Grid from '@mui/material/Unstable_Grid2';

//This returns a table from the wildfire API
//returns Date, Name, Acres and Cause when available
interface Props {
  county: string;
  state: string;
  fullName: string;
}
//state names
const StateAbbrv = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "FL": "Florida",
    "GA": "Georgia",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New JERSEY",
    "NM": "NEW Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PA": "Pennsylvania",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming",
}

//this function creates the current and historical data table
function FireStatsTable({ county, state, fullName }: Props) {
  //urls for location and it's state endpoints
  const url = 'http://localhost:8001/wildfire/county?location=' + county + '&state=' + state
  const url2 = 'http://localhost:8001/wildfire/stateonly?location=' + state
  console.log(url)
  let formattedName = fullName.split(",")
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
      setLoading(false)
  }, []);
  console.log(data)
  console.log(stateData)
  if (isLoading) {
    return <div >Loading...</div>;
  }
  else if (data && stateData) {
    return (
      <>
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            paddingBottom={50}
          >
        
        <div className={styles['row']}>
          <div className={styles['column']}> 
            <table>
              <tr className={styles['head']}>
                <th>Fire Statistics</th>
                <th>{formattedName[0]}</th>
                <th>{StateAbbrv[state]}</th>
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
            <p> <a href = "https://www.nifc.gov/"> Source: National Interagency Fire Agency <LaunchIcon fontSize="small"/></a></p>
          </div>
       
        </div>
        </Grid>
      </>
    );
  } else {
    return (
      <h3>Fire Data Not Available For This Location</h3>
    )
  }
}

export default FireStatsTable;