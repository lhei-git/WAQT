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
import { number } from 'prop-types';

//returns a graph which displays Data
//This data can be in a specific date range
interface Props {
  county: string;
  state: string;
}

//first run flag for initial data
let FIRSTRUN = true

//Wildfire graphs function
export default function WildFireGraphs({ county, state }: Props) {
  //flask endpoint urls
  const url = "http://localhost:8001/wildfire/count?location=" + county + "&state=" + state;
  const url2 = "http://localhost:8001/wildfire/acres?location=" + county + "&state=" + state;
  const url3 = "http://localhost:8001/wildfire/top10?location=" + county + "&state=" + state;
  const url4 = "http://localhost:8001/wildfire/average?location=" + county + "&state=" + state;
  const url5 = "http://localhost:8001/wildfire/top10Duration?location=" + county + "&state=" + state;



  console.log(url);
  //arrays that are used in hooks
  const [countData, setCountData] = useState<any[]>([]);
  const [filteredcountData, setFilteredCountData] = useState<any[]>([])
  const [countisLoading, setCountLoading] = useState(true);
  const [acresData, setAcresData] = useState<any[]>([]);
  const [filteredacresData, setFilteredAcresData] = useState<any[]>([]);
  const [acresisLoading, setAcresLoading] = useState(true);
  const [top10Data, setTop10Data] = useState<any[]>([]);
  const [filteredtop10Data, setFilteredTop10Data] = useState<any[]>([]);
  const [top10isLoading, setTop10Loading] = useState(true);
  const [averageData, setAverageData] = useState<any[]>([]);
  const [filteredaverageData, setFilteredAverageData] = useState<any[]>([]);
  const [averageisLoading, setAverageLoading] = useState(true);
  const [durationData, setDurationData] = useState<any[]>([]);
  const [filtereddurationData, setFilteredDurationData] = useState<any[]>([]);
  const [durationisLoading, setDurationLoading] = useState(true);

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
    setAnchorEl(null);
    setFilteredCountData(countData)
    setFilteredAcresData(acresData)
    setFilteredAverageData(averageData)
    setFilteredTop10Data(top10Data)
    setFilteredDurationData(durationData)
    setAnchorEl(null);
  }

  //data for a user specified year
  function filterTrendsYear(selectedYear: number) {
    console.log(selectedYear)
    const filteredcountDataTemp: any[] = [];
    const filteredacresDataTemp: any[] = [];
    const filteredaverageDataTemp: any[] = [];
    const filteredtop10DataTemp: any[] = [];
    const filtereddurationDataTemp: any[] = [];
    //populate temp arrays with the data for the specified year
    for (const key in countData) {
      if (key.includes(selectedYear.toString())) {
        filteredcountDataTemp[key] = countData[key]
      }
    }
    for (const key in acresData) {
      if (key.includes(selectedYear.toString())) {
        filteredacresDataTemp[key] = acresData[key]
      }
    }
    for (const key in averageData) {
      if (key.includes(selectedYear.toString())) {
        filteredaverageDataTemp[key] = averageData[key]
      }
    }
    for (const key in top10Data) {
      if (top10Data[key].includes(selectedYear.toString())) {
        filteredtop10DataTemp[key] = top10Data[key]
      }
    }
    for (const key in durationData) {
      if (durationData[key].includes(selectedYear.toString())) {
        filtereddurationDataTemp[key] = durationData[key]
      }
    }
    setFilteredCountData(filteredcountDataTemp)
    setFilteredAcresData(filteredacresDataTemp)
    setFilteredAverageData(filteredaverageDataTemp)
    setFilteredTop10Data(filteredtop10DataTemp)
    setFilteredDurationData(filtereddurationDataTemp)
    setAnchorEl(null);

  }


  //year range for drop down menu
  const currentYear: number = new Date().getFullYear();
  let year = currentYear
  const listOfYears: number[] = [];

  for (let index = 0; year >= 2015; index++) {
    listOfYears[index] = year
    year--
  }

  //flask endpoint hooks
  useEffect(() => {
    axios.get(url).then(response => {
      setCountData(response.data);
      console.log(countData);
      setCountLoading(false);
    });
  }, []);
  useEffect(() => {
    axios.get(url2).then(response => {
      setAcresData(response.data);
      console.log(acresData)
      setAcresLoading(false);
    });
  }, []);
  useEffect(() => {
    axios.get(url4).then(response => {
      setAverageData(response.data);
      console.log(averageData)
      setAverageLoading(false);
    });
  }, []);
  useEffect(() => {
    axios.get(url3).then(response => {
      setTop10Data(response.data);
      console.log(top10Data)
      setTop10Loading(false)
    });
  }, []);
  useEffect(() => {
    axios.get(url5).then(response => {
      setDurationData(response.data);
      console.log(durationData)
      setDurationLoading(false);
    });
  }, []);

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

  //if something is loading then display loading...
  if (countisLoading || acresisLoading || averageisLoading || top10isLoading || durationisLoading) {
    return (
      <p>Loading...</p>
    )
  } else {
    if (FIRSTRUN) {
      //set the data for the default year (the previous year)
      for (const key in countData) {
        if (key.includes((currentYear - 1).toString())) {
          filteredcountData[key] = countData[key]
        }
      }
      for (const key in acresData) {
        if (key.includes((currentYear - 1).toString())) {
          filteredacresData[key] = acresData[key]
        }
      }
      for (const key in averageData) {
        if (key.includes((currentYear - 1).toString())) {
          filteredaverageData[key] = averageData[key]
        }
      }
      for (const value in top10Data) {
        if (top10Data[value].includes((currentYear - 1).toString())) {
          filteredtop10Data[value] = top10Data[value]
        }
      }
      for (const value in durationData) {
        if (durationData[value].includes((currentYear - 1).toString())) {
          filtereddurationData[value] = durationData[value]
        }
      }
      FIRSTRUN = false
    }

    //render all charts
    return (
      <>
        {Object.keys(countData).length > 1 || Object.keys(acresData).length > 1 || Object.keys(averageData).length > 1 || Object.keys(top10Data).length > 1 || Object.keys(durationData).length > 1 ?
          <>
            <h1><TrendingUpIcon fontSize='large' /> Historical Wildfire Trends</h1>
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
        {/* count */}
        {Object.keys(countData).length > 1 ?
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <div>
              <h3><b>Number Of Fires Per Month</b></h3>
              <h5><a href="https://data-nifc.opendata.arcgis.com">Source: National Interagency Fire Center <LaunchIcon fontSize="small" /></a></h5>
            </div>
            <div className={styles["graph"]}>

              <Line
                data={{
                  labels: Object.keys(filteredcountData),
                  datasets: [
                    {
                      data: Object.values(filteredcountData),
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
        {/* acres per month */}
        {Object.keys(countData).length > 1 ?
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <div>
              <h3><b>Total Monthly Acres</b></h3>
              <h5><a href="https://data-nifc.opendata.arcgis.com">Source: National Interagency Fire Center <LaunchIcon fontSize="small" /></a></h5>
            </div>
            <div className={styles["graph"]}>
              <Line
                data={{
                  labels: Object.keys(filteredacresData),
                  datasets: [
                    {
                      backgroundColor: ["#3e95cd"],
                      borderColor: ["#3e95cd"],
                      data: Object.values(filteredacresData),
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
        {Object.keys(averageData).length > 1 ?
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <div>
              <h3><b>Average Fire Duration (Days) In Each Month</b></h3>
              <h5><a href="https://data-nifc.opendata.arcgis.com">Source: National Interagency Fire Center <LaunchIcon fontSize="small" /></a></h5>
            </div>
            <div className={styles["graph"]}>
              <Line
                data={{
                  labels: Object.keys(filteredaverageData),
                  datasets: [
                    {
                      backgroundColor: ["#3e95cd"],
                      borderColor: ["#3e95cd"],
                      data: Object.values(filteredaverageData),
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

        {/* top 10 fires by duration */}
        {Object.keys(durationData).length > 1 ?
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <div>
              <h3><b>Top 10 Fires by Duration</b></h3>
              <h5>Beginning January 2015</h5>
              <h5><a href="https://data-nifc.opendata.arcgis.com">Source: National Interagency Fire Center <LaunchIcon fontSize="small" /></a></h5>
            </div>
            <div className={styles["graph"]}>
              <Bar
                data={{
                  labels: Object.values(filtereddurationData).reverse(),
                  datasets: [
                    {
                      label: 'Top 10 Fire Duration',
                      backgroundColor: ["#3e95cd"],
                      data: Object.keys(filtereddurationData).reverse(),
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
        {/* top 10 acres */}
        {Object.keys(top10Data).length > 1 ?
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <div>
              <h3><b>Top 10 Fires by Total Acres Burned</b></h3>
              <h5>Beginning January 2015</h5>
              <h5><a href="https://data-nifc.opendata.arcgis.com">Source: National Interagency Fire Center <LaunchIcon fontSize="small" /></a></h5>
            </div>
            <div className={styles["graph"]}>
              <Bar
                data={{
                  labels: Object.values(filteredtop10Data).reverse(),
                  datasets: [
                    {
                      label: 'Top 10 Acres',
                      backgroundColor: ["#3e95cd"],
                      data: Object.keys(filteredtop10Data).reverse(),
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