import React, { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import styles from './app.module.css';
Chart.register(...registerables);
import Grid from '@mui/material/Unstable_Grid2';
import LaunchIcon from '@mui/icons-material/Launch';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import HelpIcon from '@mui/icons-material/Help';
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { brotliDecompress } from 'zlib';
//returns a graph which displays Data
//This data can be in a specific date range
interface Props {
  county: string;
  state: string;
}
//first run flag for data filtering
let FIRSTRUN = true;

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
//styles for the aqi color boxes in the modals
const goodBoxStyle = {
  fill: 'green',
  strokeWidth: 3,
}
const moderateBoxStyle = {
  fill: 'yellow',
  strokeWidth: 3,
}
const sensistiveBoxStyle = {
  fill: 'orange',
  strokeWidth: 3,
}
const unhealthyBoxStyle = {
  fill: 'red',
  strokeWidth: 3,
}
const veryunhealthyBoxStyle = {
  fill: 'purple',
  strokeWidth: 3,
}
const hazardBoxStyle = {
  fill: 'brown',
  strokeWidth: 3,
}

export default function AirQualityGraphs({ county, state }: Props) {
  //url information
  const url =
    'http://localhost:8000/trends?county=' + county + '&state=' + state;
  console.log(url);
  //data array of objects
  const [data, setData] = useState<any[]>([]);
  const [dataFilter25, setDataFilter25] = useState<any[]>([]);
  const [dataFilter10, setDataFilter10] = useState<any[]>([]);
  const [dataFilterOzone, setDataFilterOzone] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);

  //hook to obtain the data from the flask endpoint
  useEffect(() => {
    axios.get(url).then((response) => {
      setData(response.data);
      setLoading(false);
      console.log(data);
    });
  }, []);

  //year range for drop down menu
  const currentYear: number = new Date().getFullYear();
  let year = currentYear;
  const listOfYears: number[] = [];

  for (let index = 0; year >= 2015; index++) {
    listOfYears[index] = year;
    year--;
  }
  
  //drop down menu functions
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  //handle when the user closes it
  const handleClose = () => {
    setAnchorEl(null);
  };

  //data for a user specified year
  function filterTrendsYear(selectedYear1: number, selectedYear2: number) {
    const filterDataTemp25: any[] = [];
    const filterDataTemp10: any[] = [];
    const filterDataTempOzone: any[] = [];
    let i = selectedYear1
    while(i <= selectedYear2) {
      for (const key in data['PM25']) {
        if (key.includes(i.toString())) {
          filterDataTemp25[key] = data['PM25'][key];
        }
      }
      for (const key in data['PM10']) {
        if (key.includes(i.toString())) {
          filterDataTemp10[key] = data['PM10'][key];
        }
      }
      for (const key in data['Ozone']) {
        if (key.includes(i.toString())) {
          filterDataTempOzone[key] = data['Ozone'][key];
        }
      }
      i++
    }

    setDataFilter25(filterDataTemp25);
    setDataFilter10(filterDataTemp10);
    setDataFilterOzone(filterDataTempOzone);
    setAnchorEl(null);
  }
  //modal hooks
  const [openModal, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);

  const [openModal2, setOpen2] = useState(false);
  const handleOpen2 = () => setOpen2(true);
  const handleModalClose2 = () => setOpen2(false);

  const [openModal3, setOpen3] = useState(false);
  const handleOpen3 = () => setOpen3(true);
  const handleModalClose3 = () => setOpen3(false);

  //handles for the year range user input
  
  const [selectedYear1, setSelectedYear1] = useState(2021)
  const [selectedYear2, setSelectedYear2] = useState(2021)

  //set selected year here
  const handleChange1 = (event: SelectChangeEvent) => {
    setSelectedYear1(event.target.value as unknown as number);
  };

  const handleChange2 = (event: SelectChangeEvent) => {
    setSelectedYear2(event.target.value as unknown as number);
  };
  //only show later years in selection box
  function checkYear(year) {
    return year >= selectedYear1;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  } else if (
    // checker if no data is available
    Object.keys(data['PM25']).length == 0 &&
    Object.keys(data['PM10']).length == 0 &&
    Object.keys(data['Ozone']).length == 0) {
      return <p>No Data Available</p>
  } else {
    if (FIRSTRUN) {
      //set the data for the default year (the previous year)
      for (const key in data['PM25']) {
        if (key.includes((currentYear - 1).toString())) {
          dataFilter25[key] = data['PM25'][key];
        }
      }
      for (const key in data['PM10']) {
        if (key.includes((currentYear - 1).toString())) {
          dataFilter10[key] = data['PM10'][key];
        }
      }
      for (const key in data['Ozone']) {
        if (key.includes((currentYear - 1).toString())) {
          dataFilterOzone[key] = data['Ozone'][key];
        }
      }
      FIRSTRUN = false;
    }
    console.log(dataFilter25);

    return (
      <>
        {Object.keys(data['PM25']).length > 1 ||
        Object.keys(data['PM10']).length > 1 ||
        Object.keys(data['Ozone']).length > 1 ? 
          <>
          {/* this is for the year range drop down menus, using MUI */}
            <div className={styles['divCenter']}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel htmlFor="start-select">Start Year</InputLabel>
              <Select
                labelId="start-year"
                id="start-year"
                value={selectedYear1.toString()}
                label="start-year"
                onChange={handleChange1}
              >
                {/* map all years here */}
                {listOfYears.map((item) => (
                  <MenuItem
                  value = {item}
                  >
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel htmlFor="end-select">End Year</InputLabel>
              <Select
                labelId="end-year"
                id="end-year"
                value={selectedYear2.toString()}
                label="end-year"
                onChange={handleChange2}
              >
                {/* map years that are past the first selected year */}
                {listOfYears.filter(checkYear).map((item) => (
                  <MenuItem
                  value = {item}                 
                  >
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            </div>
            <div className={styles['divCenter']}>
              <Button variant="outlined" 
              onClick={() => filterTrendsYear(selectedYear1, selectedYear2)}>
                Submit
                </Button>
            </div>
          
      </>
    : <></>}
        {/* render all graphs here */}
        {/* this uses the charts js library
          Each graph is in a grid and is rendered using the filtered data
          https://www.chartjs.org/
          Graphs will not render if there is no data
        */}
        {Object.keys(data["PM25"]).length > 1 ?
        <>
        <div>
              <h3><b>Highest PM 2.5 Values Per Quarter</b><Button onClick={handleOpen}>{<HelpIcon />}</Button></h3>
              <h4>Unit: Micrograms/cubic meter</h4>
              <h5>Source: <a href="https://www.epa.gov/aqs">EPA AQS <LaunchIcon fontSize="small" /></a></h5>
            </div>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            
            <div className={styles["graph"]}>

              <Line
                data={{
                  labels: Object.keys(dataFilter25),
                  datasets: [
                    {
                      data: Object.values(dataFilter25),
                      backgroundColor: ["#5e87f5"],
                      borderColor: ["#5e87f5"],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                      labels: {
                        color: "#5e87f5",
                      },
                    },
                    title: {
                      display: true,
                    },
                  },
                  scales: {
                    y: {
                      ticks: {
                        color: 'black',
                        font: {
                          size: 14,
                          weight: 'bold'
                      }
                      }
                    },
                    x: {
                      ticks: {
                        color: 'black',
                        font: {
                          size: 14,
                          weight: 'bold'
                      }
                      }
                    },
                  }
                }}
              />
            </div>
          </Grid>
          </>
          : <></>}
          <Modal
            open={openModal}
            onClose={handleModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                PM 2.5 AQI Information:
              </Typography>
              <Typography id="modal-modal-description">
                  <p><svg width="20" height="20"><rect width="20" height="20" style={goodBoxStyle}/></svg>{" Good (<= 12.0 ug/m3)"}</p>
                  <p><svg width="20" height="20"><rect width="20" height="20" style={moderateBoxStyle}/></svg>{" Moderate (12.1-35.4 ug/m3"}</p>
                  <p><svg width="20" height="20"><rect width="20" height="20" style={sensistiveBoxStyle}/></svg>{" Unhealthy for Sensitive Groups (35.5-55.4 ug/m3)"}</p>
                  <p><svg width="20" height="20"><rect width="20" height="20" style={unhealthyBoxStyle}/></svg>{" Unhealthy (55.5-150.4 ug/m3)"}</p>
                  <p><svg width="20" height="20"><rect width="20" height="20" style={veryunhealthyBoxStyle}/></svg>{" Very Unhealthy (150.5-250.4ug/m3)"}</p>
                  <p><svg width="20" height="20"><rect width="20" height="20" style={hazardBoxStyle}/></svg>{" Hazardous (>=250.5 ug/m3)"}</p>
              </Typography>
              <Typography align="center">
                    <Button onClick={handleModalClose}>{<CloseIcon fontSize="medium"/>}</Button>
              </Typography>
            </Box>
          </Modal> 
        <div className="pagebreak"> </div> {/*For page printing*/}
        {Object.keys(data["PM10"]).length > 1 ?
        <>
        <div>
              <h3><b>Highest PM 10 Values Per Quarter</b><Button onClick={handleOpen2}>{<HelpIcon />}</Button></h3>
              <h4>Unit: Micrograms/cubic meter</h4>
              <h5>Source: <a href="https://www.epa.gov/aqs">EPA AQS <LaunchIcon fontSize="small" /></a></h5>
            </div>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <div className={styles["graph"]}>
              <Line
                data={{
                  labels: Object.keys(dataFilter10),
                  datasets: [
                    {
                      backgroundColor: ["#3d4b91"],
                      borderColor: ["#3d4b91"],
                      data: Object.values(dataFilter10),
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                      labels: {
                        color: "#3d4b91",
                      },
                    },
                    title: {
                      display: true,
                    },
                  },
                  scales: {
                    y: {
                      ticks: {
                        color: 'black',
                        font: {
                          size: 14,
                          weight: 'bold'
                      }
                      }
                    },
                    x: {
                      ticks: {
                        color: 'black',
                        font: {
                          size: 14,
                          weight: 'bold'
                      }
                      }
                    },
                  }
                }}
              />
            </div>
          </Grid>
          </>
          : <></>}
          
        {/* pop up modal for AQI information*/}
          <Modal
            open={openModal2}
            onClose={handleModalClose2}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                PM 10 AQI Information:
              </Typography>
              <Typography id="modal-modal-description">
                  <p><svg width="20" height="20"><rect width="20" height="20" style={goodBoxStyle}/></svg>{" Good (<=54 ug/m3)"}</p>
                  <p><svg width="20" height="20"><rect width="20" height="20" style={moderateBoxStyle}/></svg>{" Moderate (55-154 ug/m3)"}</p>
                  <p><svg width="20" height="20"><rect width="20" height="20" style={sensistiveBoxStyle}/></svg>{" Unhealthy for Sensitive Groups (155-254 ug/m3)"}</p>
                  <p><svg width="20" height="20"><rect width="20" height="20" style={unhealthyBoxStyle}/></svg>{" Unhealthy (255-354 ug/m3)"}</p>
                  <p><svg width="20" height="20"><rect width="20" height="20" style={veryunhealthyBoxStyle}/></svg>{" Very Unhealthy (355-424 ug/m3)"}</p>
                  <p><svg width="20" height="20"><rect width="20" height="20" style={hazardBoxStyle}/></svg>{" Hazardous (>=425 ug/m3)"}</p>
              </Typography>
              <Typography align="center">
                    <Button onClick={handleModalClose2}>{<CloseIcon fontSize="medium"/>}</Button>
              </Typography>
            </Box>
          </Modal> 
        <div className="pagebreak"> </div> {/*For page printing*/}
        {Object.keys(data["Ozone"]).length > 1 ?
        <>
        <div>
              <h3><b>Highest Ozone Values Per Quarter</b><Button onClick={handleOpen3}>{<HelpIcon />}</Button></h3>
              <h4>Unit: Parts per million</h4>
              <h5>Source: <a href="https://www.epa.gov/aqs">EPA AQS <LaunchIcon fontSize="small" /></a></h5>
            </div>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <div className={styles["graph"]}>
              <Line
                data={{
                  labels: Object.keys(dataFilterOzone),
                  datasets: [
                    {
                      backgroundColor: ["#2d2c5e"],
                      borderColor: ["#2d2c5e"],
                      data: Object.values(dataFilterOzone),
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                      labels: {
                        color: "#2d2c5e",
                      },
                    },
                    title: {
                      display: true,
                    },
                  },
                  scales: {
                    y: {
                      ticks: {
                        color: 'black',
                        font: {
                          size: 14,
                          weight: 'bold'
                      }
                      }
                    },
                    x: {
                      ticks: {
                        color: 'black',
                        font: {
                          size: 14,
                          weight: 'bold'
                      }
                      }
                    },
                  }
                }}
              />
            </div>
          </Grid>
          </>
          : <></>}
        <div>
           {/* pop up modal for AQI information*/}
          <Modal
            open={openModal3}
            onClose={handleModalClose3}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Ozone AQI Information:
              </Typography>
              <Typography id="modal-modal-description">
                  <p><svg width="20" height="20"><rect width="20" height="20" style={goodBoxStyle}/></svg>{" Good (<=.054 ppm)"}</p>
                  <p><svg width="20" height="20"><rect width="20" height="20" style={moderateBoxStyle}/></svg>{" Moderate (.055-.070 ppm)"}</p>
                  <p><svg width="20" height="20"><rect width="20" height="20" style={sensistiveBoxStyle}/></svg>{" Unhealthy for Sensitive Groups (.071-.085 ppm)"}</p>
                  <p><svg width="20" height="20"><rect width="20" height="20" style={unhealthyBoxStyle}/></svg>{" Unhealthy (.086-.105 ppm)"}</p>
                  <p><svg width="20" height="20"><rect width="20" height="20" style={veryunhealthyBoxStyle}/></svg>{" Very Unhealthy (.106-.200 ppm)"}</p>
                  <p><svg width="20" height="20"><rect width="20" height="20" style={hazardBoxStyle}/></svg>{" Hazardous (>=.405 ppm)"}</p>
              </Typography>
              <Typography align="center">
                    <Button onClick={handleModalClose3}>{<CloseIcon fontSize="medium"/>}</Button>
              </Typography>
            </Box>
          </Modal> 
          
      </div>
      </>
    );
  }
}
