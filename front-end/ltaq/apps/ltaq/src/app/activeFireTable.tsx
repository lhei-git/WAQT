// App.js
import { useEffect, useState } from "react";
import styles from "./app.module.css";
import axios from "axios"
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
}

function ActiveFiresTable({county, state}: Props) {
  //This grabs all data from the active fire endpoint
  const url = "http://localhost:8001/mapmarkers?county="+county+"&state="+state
  console.log(url)
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);
  //hook to populate the array 
  useEffect(() => {
    axios.get(url).then(response => {
      setData(response.data);
      setLoading(false);
      console.log(data)
    });
  }, []);

  //if loading, display loading...
  if (isLoading) {
    return <div >Loading...</div>;
  }else if(data.length != 0){
    return (
      <>
      <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            
          >
      {/* table to render active wildfire data */}
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{fontSize: "2rem"}}>Fire Name</TableCell>
            <TableCell align="center" sx={{fontSize: "2rem"}}>Fire Start Date</TableCell>
            <TableCell align="center" sx={{fontSize: "2rem"}}>Fire Cause</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* only show most recent 5 wildfires */}
          {data.splice(0,5).map((item, index) => (
            <TableRow
              key={index}
            >
              <TableCell align="center" sx={{fontSize: "1.8rem"}}>{item.name}</TableCell>
              <TableCell align="center" sx={{fontSize: "1.8rem"}}>{item.date}</TableCell>
              <TableCell align="center" sx={{fontSize: "1.8rem"}}>{item.cause}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Grid>
    </>
    );
  }else{
    return (
      <h3 color="red">No current active wildfires </h3>
    )
    
  }
  
}

export default ActiveFiresTable;