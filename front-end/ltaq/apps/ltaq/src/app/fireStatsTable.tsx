import { useEffect, useState } from "react";
import styles from "./app.module.css";
import axios from "axios"
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import LaunchIcon from '@mui/icons-material/Launch';
import Grid from '@mui/material/Unstable_Grid2';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
            
          >
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center"  sx={{fontSize: "2rem"}}>Fire Statistics</TableCell>
            <TableCell align="center" sx={{fontSize: "2rem"}}>{formattedName[0]}</TableCell>
            <TableCell align="center" sx={{fontSize: "2rem"}}>{StateAbbrv[state]}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(data).map((key) => (
            <TableRow
              key={key}
            >
              <TableCell align="center" sx={{fontSize: "1.8rem"}}>{key}</TableCell>
              <TableCell align="center" sx={{fontSize: "1.8rem"}}>{data[key]}</TableCell>
              <TableCell align="center" sx={{fontSize: "1.8rem"}}>{stateData[key]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>


    <p> <a href = "https://www.nifc.gov/"> Source: National Interagency Fire Agency <LaunchIcon fontSize="small"/></a></p>
          
       
        
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