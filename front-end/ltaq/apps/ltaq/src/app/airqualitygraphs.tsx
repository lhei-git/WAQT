import React, { useEffect, useRef, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import styles from "./app.module.css";
Chart.register(...registerables);
import Grid from '@mui/material/Unstable_Grid2';
import LaunchIcon from '@mui/icons-material/Launch';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import HelpIcon from '@mui/icons-material/Help';
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import aqiImage1 from "./aqiGraphs1.jpg";
import aqiImage2 from "./aqiGraphs2.jpg";
//returns a graph which displays Data
//This data can be in a specific date range
interface Props {
  county: string;
  state: string;
}
//first run flag for data filtering
let FIRSTRUN = true

//styling for the modal
//https://mui.com/material-ui/react-modal/
const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
export default function AirQualityGraphs({ county, state }: Props) {
  //url information
  const url = "http://localhost:8000/trends?county=" + county + "&state=" + state;
  console.log(url);
  //data array of objects
  const [data, setData] = useState<any[]>([]);
  const [dataFilter25, setDataFilter25] = useState<any[]>([]); 
  const [dataFilter10, setDataFilter10] = useState<any[]>([]); 
  const [dataFilterOzone, setDataFilterOzone] = useState<any[]>([]); 
  const [isLoading, setLoading] = useState(true);

  //hook to obtain the data from the flask endpoint
  useEffect(() => {
    axios.get(url).then(response => {
      setData(response.data);
      setLoading(false);
      console.log(data)
    });
  }, []);

  //year range for drop down menu
  const currentYear: number = new Date().getFullYear();
  let year = currentYear
  const listOfYears: number[] = [];

  for (let index = 0; year >= 2015; index++) {
    listOfYears[index] = year
    year--
  }
  //drop down menu styling
  //https://mui.com/material-ui/react-menu/
  const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  ))(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color:
        theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
      boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      '& .MuiMenu-list': {
        padding: '4px 0',
      },
      '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        '&:active': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  }));
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

  //when the user wants to see all data
  function allData() {
    setDataFilter25(data["PM25"])
    setDataFilter10(data["PM10"])
    setDataFilterOzone(data["Ozone"])
    setAnchorEl(null);
  }

  //data for a user specified year
  function filterTrendsYear(selectedYear: number) {
    console.log(selectedYear)
    const filterDataTemp25: any[] = [];
    const filterDataTemp10: any[] = [];
    const filterDataTempOzone: any[] = [];

    for (const key in data["PM25"]) {
      if (key.includes(selectedYear.toString())) {
        filterDataTemp25[key] = data["PM25"][key]
      }
    }
    for (const key in data["PM10"]) {
      if (key.includes(selectedYear.toString())) {
        filterDataTemp10[key] = data["PM10"][key]
      }
    }
    for (const key in data["Ozone"]) {
      if (key.includes(selectedYear.toString())) {
        filterDataTempOzone[key] = data["Ozone"][key]
      }
    }

    setDataFilter25(filterDataTemp25)
    setDataFilter10(filterDataTemp10)
    setDataFilterOzone(filterDataTempOzone)
    setAnchorEl(null);

  }
 
  const [openModal, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleModalClose = () => setOpen(false);

  const [openModal2, setOpen2] = useState(false);
  const handleOpen2 = () => setOpen2(true);
  const handleModalClose2 = () => setOpen2(false);
  

  if (isLoading) {
    return (
      <p>Loading...</p>
    )
  } else {

    if (FIRSTRUN) {
      //set the data for the default year (the previous year)
      for (const key in data["PM25"]) {
        if (key.includes((currentYear - 1).toString())) {
          dataFilter25[key] = data["PM25"][key]
        }
      }
      for (const key in data["PM10"]) {
        if (key.includes((currentYear - 1).toString())) {
          dataFilter10[key] = data["PM10"][key]
        }
      }
      for (const key in data["Ozone"]) {
        if (key.includes((currentYear - 1).toString())) {
          dataFilterOzone[key] = data["Ozone"][key]
        }
      }
      FIRSTRUN = false
    }
    console.log(dataFilter25)

    return (
      <>
      {Object.keys(data["PM25"]).length > 1 || Object.keys(data["PM10"]).length > 1 || Object.keys(data["Ozone"]).length > 1 ?
      <div>
      <h1><TrendingUpIcon fontSize='large' /> Historical Air Quality Measurements</h1>
      <div className={styles["divCenter"]}>
              <Button
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                disableElevation
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
              >
                Select Year
              </Button>
              <StyledMenu
                MenuListProps={{
                  'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={() => allData()} disableRipple>
                  2015 - {currentYear} 
                </MenuItem>
                {listOfYears.map((item) => (
                  <MenuItem onClick={() => filterTrendsYear(item)} disableRipple>
                    {item}
                  </MenuItem>
                ))

                }
              </StyledMenu>
            </div>
           {/* modal content */}
      <Modal
            open={openModal}
            onClose={handleModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                AQI Information:
              </Typography>
              <Typography id="modal-modal-description">
                <img src={aqiImage1} />
              </Typography>
              <Typography align="center">
                    <Button onClick={handleModalClose}>{<CloseIcon fontSize="medium"/>}</Button>
              </Typography>
            </Box>
          </Modal> 
      </div>
    : <></>}
      
        {Object.keys(data["PM25"]).length > 1 ?
        <>
        <div>
              <h3><b>Highest PM 2.5 Values Per Quarter</b><Button onClick={handleOpen}>{<HelpIcon />}</Button></h3>
              <h4>Unit: Micrograms/cubic meter</h4>
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
                }}
              />
            </div>

          </Grid>
          <h5>Source: <a href="https://www.epa.gov/aqs">EPA AQS <LaunchIcon fontSize="small" /></a></h5>
          </>
          : <></>}
        {Object.keys(data["PM10"]).length > 1 ?
        <>
        <div>
              <h3><b>Highest PM 10 Values Per Quarter</b><Button onClick={handleOpen}>{<HelpIcon />}</Button></h3>
              <h4>Unit: Micrograms/cubic meter</h4>
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
                }}
              />
            </div>
          </Grid>
          <h5>Source: <a href="https://www.epa.gov/aqs">EPA AQS <LaunchIcon fontSize="small" /></a></h5>
          </>
          : <></>}
        {Object.keys(data["Ozone"]).length > 1 ?
        <>
        <div>
              <h3><b>Highest Ozone Values Per Quarter</b><Button onClick={handleOpen2}>{<HelpIcon />}</Button></h3>
              <h4>Unit: Parts per million</h4>
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
                }}
              />
            </div>
          </Grid>
          <h5>Source: <a href="https://www.epa.gov/aqs">EPA AQS <LaunchIcon fontSize="small" /></a></h5>
          </>
          : <></>}
        <div>
          <Modal
            open={openModal2}
            onClose={handleModalClose2}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                AQI Information:
              </Typography>
              <Typography id="modal-modal-description">
                <img src={aqiImage2} />
              </Typography>
              <Typography align="center">
                    <Button onClick={handleModalClose2}>{<CloseIcon fontSize="medium"/>}</Button>
              </Typography>
            </Box>
          </Modal> 
      </div>
      </>
    );
  }

}