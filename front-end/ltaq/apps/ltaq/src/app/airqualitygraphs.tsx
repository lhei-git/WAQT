import React, { useEffect, useState } from 'react';
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
//returns a graph which displays Data
//This data can be in a specific date range
interface Props {
  county: string;
  state: string;
}
//first run flag for data filtering
let FIRSTRUN = true

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
      <>
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
      </>
    : <></>}
      
        {Object.keys(data["PM25"]).length > 1 ?
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <div>
              <h3><b>Highest PM 2.5 Values Per Quarter</b></h3>
              <h5>Beginning Q1 2015</h5>
              <h5>Unit of Measurement: Micrograms/cubic meter (LC)</h5>
              <h5><a href="https://www.epa.gov/aqs">Source: Environmental Protection Agency Air Quality System <LaunchIcon fontSize="small" /></a></h5>
            </div>
            <div className={styles["graph"]}>

              <Line
                data={{
                  labels: Object.keys(dataFilter25),
                  datasets: [
                    {
                      data: Object.values(dataFilter25),
                      backgroundColor: ["#3e95cd"],
                      borderColor: ["#3e95cd"],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                      labels: {
                        color: 'rgb(255, 99, 132)',
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
          : <></>}
        {Object.keys(data["PM10"]).length > 1 ?
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <div>
              <h3><b>Highest PM 10 Values Per Quarter</b></h3>
              <h5>Beginning Q1 2015</h5>
              <h5>Unit of Measurement: Micrograms/cubic meter (25 C)</h5>
              <h5><a href="https://www.epa.gov/aqs">Source: Environmental Protection Agency Air Quality System <LaunchIcon fontSize="small" /></a></h5>
            </div>
            <div className={styles["graph"]}>
              <Line
                data={{
                  labels: Object.keys(dataFilter10),
                  datasets: [
                    {
                      backgroundColor: ["#3e95cd"],
                      borderColor: ["#3e95cd"],
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
                        color: 'rgb(255, 99, 132)',
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
          : <></>}
        {Object.keys(data["Ozone"]).length > 1 ?
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <div>
              <h3><b>Highest Ozone Values Per Quarter</b></h3>
              <h5>Beginning Q1 2015</h5>
              <h5>Unit of Measurement: Parts per million</h5>
              <h5><a href="https://www.epa.gov/aqs">Source: Environmental Protection Agency Air Quality System <LaunchIcon fontSize="small" /></a></h5>
            </div>
            <div className={styles["graph"]}>
              <Line
                data={{
                  labels: Object.keys(dataFilterOzone),
                  datasets: [
                    {
                      backgroundColor: ["#3e95cd"],
                      borderColor: ["#3e95cd"],
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
                        color: 'rgb(255, 99, 132)',
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
          : <></>}
      </>
    );
  }

}