// This is the table that gathers current AQI Values
// Use this as an example for other tables
// see airnow.py for the endpoint 
import { useEffect, useRef, useState } from "react";
import styles from "./aqi.module.css";
import axios from "axios"
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import LaunchIcon from '@mui/icons-material/Launch';
import HelpIcon from '@mui/icons-material/Help';
import CloseIcon from '@mui/icons-material/Close';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardHeader,
  CardActions
} from "@material-ui/core/";

//props that will take the lat and lon
interface Props {
  lat: number;
  lng: number;
}

//styling for the modal
//https://mui.com/material-ui/react-modal/
const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

let highestAqi = -1
//This returns a table from the wildfire API
//returns Date, Name, Acres and Cause when available
function CurrentAQI({ lat, lng }: Props) {
  if (lng < 0) {
    lng = lng * -1;
  }
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const modalClose = useRef()
  //request to get data from your python file:
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);
  const url = "http://localhost:8000/aqi?lat=" + lat + "&lon=" + lng;
  console.log(url)
  useEffect(() => {
    axios.get(url).then(response => {
      setData(response.data);
      setLoading(false);
      console.log(data)
    });
  }, []);

  //render all data here:
  if (isLoading) {
    return (
      <p>Loading...</p>
    )
  } else {
    data.map((item, index) => (
      // set hightest AQI for modal
      (item.Category.Name == "Good" && highestAqi <= 0) ? highestAqi = 0 :
        (item.Category.Name == "Moderate" && highestAqi <= 1) ? highestAqi = 1 :
          (item.Category.Name == "Unhealthy for Sensitive Groups" && highestAqi <= 2) ? highestAqi = 2 :
            (item.Category.Name == "Unhealthy" && highestAqi <= 3) ? highestAqi = 3 :
              (item.Category.Name == "Very Unhealthy" && highestAqi <= 4) ? highestAqi = 4 :
                (item.Category.Name == "Hazardous" && highestAqi <= 5) ? highestAqi = 5 : highestAqi = highestAqi

    ))
    return (
      <>
        {/* current aqi text */}
        <div className={styles["centerText"]}>
          <h1><b><WbSunnyIcon /> Current AQI: {
            (highestAqi == 0) ? "Good" :
              (highestAqi == 1) ? "Moderate" :
                (highestAqi == 2) ? "Unhealthy for Sensitive Groups" :
                  (highestAqi == 3) ? "Unhealthy" :
                    (highestAqi == 4) ? "Very Unhealthy" :
                      (highestAqi == 5) ? "Hazardous" : "Not Available"
          }</b>
            {/* modal button */}
            <Button onClick={handleOpen}>{<HelpIcon />}</Button>

          </h1>
          {/* modal content */}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Current AQI Information:
              </Typography>
              <Typography id="modal-modal-description">
                {(highestAqi == 0) ? "Good AQI is 0 - 50. Air quality is considered satisfactory, and air pollution poses little or no risk." :
                  (highestAqi == 1) ? "Moderate AQI is 51 - 100. Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people. For example, people who are unusually sensitive to ozone may experience respiratory symptoms." :
                    (highestAqi == 2) ? "Unhealthy for Sensitive Groups AQI is 101 - 150. Although general public is not likely to be affected at this AQI range, people with lung disease, older adults and children are at a greater risk from exposure to ozone, whereas persons with heart and lung disease, older adults and children are at greater risk from the presence of particles in the air." :
                      (highestAqi == 3) ? "Unhealthy AQI is 151 - 200. Everyone may begin to experience some adverse health effects, and members of the sensitive groups may experience more serious effects." :
                        (highestAqi == 4) ? "Very Unhealthy AQI is 201 - 300. This would trigger a health alert signifying that everyone may experience more serious health effects." :
                          (highestAqi == 5) ? "Hazardous AQI greater than 300. This would trigger health warnings of emergency conditions. The entire population is more likely to be affected." : "Current AQI information is not available at this time."}
              {<p><a href="/about#AQI" target={"_blank"} >  More Info <LaunchIcon fontSize="small"/> </a></p>}
              </Typography>
              <Typography align="center">
                    <Button onClick={handleClose}>{<CloseIcon fontSize="medium"/>}</Button>
                    </Typography>
            </Box>
          </Modal>
        </div>
        <div>
          {/* boxes that house the current AQI values */}
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            {data.map((item) => (
              <Grid 
              key={item.ParameterName}
              >
                 {/*styled cards based off what the AQI is for that card*/}
                <Card style={{backgroundColor: (item.Category.Name == "Good") ? 'green' : (item.Category.Name == "Moderate" ? 'yellow' : 'red'), textAlign: "center", minWidth: 200, marginLeft:20, marginBottom:10}}>
                  <CardHeader
                    title={item.ParameterName == "O3" ? "Ozone" : item.ParameterName}
                    style={{color: (item.Category.Name == "Good") ? 'white' : (item.Category.Name == "Moderate" ? 'black' : 'white')}}
                  />
                  <CardContent
                  style={{color: (item.Category.Name == "Good") ? 'white' : (item.Category.Name == "Moderate" ? 'black' : 'white')}}>
                    <Typography variant="h4">
                    {item.AQI}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

        </div>
         {/* Sources*/}
        <div className={styles["centerText"]}>
          <br/>
        <p className={styles['source']}> <a className='source' href = "https://www.airnow.gov/" target="_blank"> Source: Air Now <LaunchIcon fontSize="small"/></a></p>
        <p className={styles['source']}> <a className='source' href = "/about#AirQualityMeasurements" target="_blank"> More Information on AQI <LaunchIcon fontSize="small"/></a></p>
        </div>


      </>
    );
  }
}

export default CurrentAQI;