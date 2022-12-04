import { useEffect, useState } from "react";
import axios from "axios"
import LaunchIcon from '@mui/icons-material/Launch';
import Grid from '@mui/material/Unstable_Grid2';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styles from './app.module.css';

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
  //use state arrays to house the data
  const [data, setData] = useState<any[]>([]);
  const [stateData, setStateData] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);
  let dataAvalable = false
  //hook for city/county data
  useEffect(() => {
    axios.get(url)
      .then((response) => setData(response.data));
  }, []);
  //hook for state data
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
      {/*Grid for responsiveness */}
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            
          >
      {/* table component to render fire stats table */}
      <TableContainer style={{backgroundColor: 'white', opacity: '0.75'}} component={Paper}>
      <Table sx={{ minWidth: 300}}  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center"  sx={{fontSize: "2rem", fontWeight: 'bold'}}>Fire Statistics</TableCell>
            <TableCell align="center" sx={{fontSize: "2rem", fontWeight: 'bold'}}>{formattedName[0]}</TableCell>
            <TableCell align="center" sx={{fontSize: "2rem", fontWeight: 'bold'}}>{StateAbbrv[state]}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* map all data onto the table */}
          {Object.keys(data).map((key) => (
            <TableRow
              key={key}
            >
              <TableCell align="center" sx={{fontSize: "1.8rem", fontWeight: 'bold'}}>{key}</TableCell>
              <TableCell align="center" sx={{fontSize: "1.8rem", fontWeight: 'bold'}}>{data[key]}</TableCell>
              <TableCell align="center" sx={{fontSize: "1.8rem", fontWeight: 'bold'}}>{stateData[key]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

  {/* Sources*/}
    <p className={styles['source']}> <a className='source' href = "https://www.nifc.gov/"> Source: National Interagency Fire Agency <LaunchIcon fontSize="small"/></a></p>
          
       
        
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