import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import styles from './app.module.css';
Chart.register(...registerables);
import Grid from '@mui/material/Unstable_Grid2';
import LaunchIcon from '@mui/icons-material/Launch';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

//returns a graph which displays Data
//This data can be in a specific date range
interface Props {
  county: string;
  state: string;
}

//first run flag for initial data
let FIRSTRUN = true;

//Wildfire graphs function
export default function WildFireGraphs({ county, state }: Props) {
  //flask endpoint urls
  const url =
    'http://localhost:8001/wildfire/count?location=' +
    county +
    '&state=' +
    state;
  const url2 =
    'http://localhost:8001/wildfire/acres?location=' +
    county +
    '&state=' +
    state;
  const url3 =
    'http://localhost:8001/wildfire/top10?location=' +
    county +
    '&state=' +
    state;
  const url4 =
    'http://localhost:8001/wildfire/average?location=' +
    county +
    '&state=' +
    state;
  const url5 =
    'http://localhost:8001/wildfire/top10Duration?location=' +
    county +
    '&state=' +
    state;

  console.log(url);
  //arrays that are used in hooks
  const [countData, setCountData] = useState<any[]>([]);
  const [filteredcountData, setFilteredCountData] = useState<any[]>([]);
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
    setFilteredCountData(countData);
    setFilteredAcresData(acresData);
    setFilteredAverageData(averageData);
    setAnchorEl(null);
  }

  //data for a user specified year
  function filterTrendsYear(selectedYear1: number, selectedYear2: number) {
    const filteredcountDataTemp: any[] = [];
    const filteredacresDataTemp: any[] = [];
    const filteredaverageDataTemp: any[] = [];
    //populate temp arrays with the data for the specified year
    let i = selectedYear1
    while(i <= selectedYear2) {
      for (const key in countData) {
        if (key.includes(i.toString())) {
          filteredcountDataTemp[key] = countData[key];
        }
      }
      for (const key in acresData) {
        if (key.includes(i.toString())) {
          filteredacresDataTemp[key] = acresData[key];
        }
      }
      for (const key in averageData) {
        if (key.includes(i.toString())) {
          filteredaverageDataTemp[key] = averageData[key];
        }
      }
      i++
    }
    setFilteredCountData(filteredcountDataTemp);
    setFilteredAcresData(filteredacresDataTemp);
    setFilteredAverageData(filteredaverageDataTemp);
    setAnchorEl(null);
  }

  //handelers for the year selection range
  const [selectedYear1, setSelectedYear1] = useState(2021)
  const [selectedYear2, setSelectedYear2] = useState(2021)

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

  //year range for drop down menu
  const currentYear: number = new Date().getFullYear();
  let year = currentYear;
  const listOfYears: number[] = [];

  for (let index = 0; year >= 2015; index++) {
    listOfYears[index] = year;
    year--;
  }

  //flask endpoint hooks
  useEffect(() => {
    axios.get(url).then((response) => {
      setCountData(response.data);
      console.log(countData);
      setCountLoading(false);
    });
  }, []);
  useEffect(() => {
    axios.get(url2).then((response) => {
      setAcresData(response.data);
      console.log(acresData);
      setAcresLoading(false);
    });
  }, []);
  useEffect(() => {
    axios.get(url4).then((response) => {
      setAverageData(response.data);
      console.log(averageData);
      setAverageLoading(false);
    });
  }, []);
  useEffect(() => {
    axios.get(url3).then((response) => {
      setTop10Data(response.data);
      console.log(top10Data);
      setTop10Loading(false);
    });
  }, []);
  useEffect(() => {
    axios.get(url5).then((response) => {
      setDurationData(response.data);
      console.log(durationData);
      setDurationLoading(false);
    });
  }, []);


  //if something is loading then display loading...
  if (
    countisLoading ||
    acresisLoading ||
    averageisLoading ||
    top10isLoading ||
    durationisLoading
  ) {
    return <p>Loading...</p>;
  } else if (
        Object.keys(countData).length == 0 &&
        Object.keys(acresData).length == 0 &&
        Object.keys(averageData).length == 0 &&
        Object.keys(top10Data).length == 0 &&
        Object.keys(durationData).length == 0 ) {
          return <p>No Data Available</p>
  } else {
    if (FIRSTRUN) {
      //set the data for the default year (the previous year)
      for (const key in countData) {
        if (key.includes((currentYear - 1).toString())) {
          filteredcountData[key] = countData[key];
        }
      }
      for (const key in acresData) {
        if (key.includes((currentYear - 1).toString())) {
          filteredacresData[key] = acresData[key];
        }
      }
      for (const key in averageData) {
        if (key.includes((currentYear - 1).toString())) {
          filteredaverageData[key] = averageData[key];
        }
      }
      FIRSTRUN = false;
    }

    //render all charts
    return (
      <>
        {Object.keys(countData).length > 1 ||
        Object.keys(acresData).length > 1 ||
        Object.keys(averageData).length > 1 ||
        Object.keys(top10Data).length > 1 ||
        Object.keys(durationData).length > 1 ? (
          <>
          {/*Drop down menu to select years */}
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
        ) : (
          <></>
        )}
        {/* render all graphs here */}
        {/* this uses the charts js library
          Each graph is in a grid and is rendered using the filtered data
          https://www.chartjs.org/
          Graphs will not render if there is no data
        */}
        {/* count */}
        {Object.keys(countData).length > 1 ?
        <>
        <h3><b>Total Fires per Month</b></h3>
        <h5><a href="https://data-nifc.opendata.arcgis.com">Source: National Interagency Fire Center <LaunchIcon fontSize="small" /></a></h5>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <div className={styles['graph']}>
              <Line
                data={{
                  labels: Object.keys(filteredcountData),
                  datasets: [
                    {
                      data: Object.values(filteredcountData),
                      backgroundColor: ['#f50538'],
                      borderColor: ['#f50538'],
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                      labels: {
                        color: "#f50538",
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
        <div className="pagebreak"> </div> {/*For page printing*/}
        {/* acres per month */}
        
        {Object.keys(countData).length > 1 ? (
          <>
          <h3>
                <b>Total Acres Burned per Month</b>
              </h3>
              <h5><a href="https://data-nifc.opendata.arcgis.com">Source: National Interagency Fire Center <LaunchIcon fontSize="small" /></a></h5>

          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <div className={styles['graph']}>
              <Line
                data={{
                  labels: Object.keys(filteredacresData),
                  datasets: [
                    {
                      backgroundColor: ['#b6042a'],
                      borderColor: ['#b6042a'],
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
                        color: "#b6042a",
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
        ) : (
          <></>
        )}
        <div className="pagebreak"> </div> {/*For page printing*/}
        {Object.keys(averageData).length > 1 ? (
          <>
           <h3>
                <b>Average Fire Duration (in Days) per Month</b>
              </h3>
              <h5><a href="https://data-nifc.opendata.arcgis.com">Source: National Interagency Fire Center <LaunchIcon fontSize="small" /></a></h5>

          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <div className={styles['graph']}>
              <Line
                data={{
                  labels: Object.keys(filteredaverageData),
                  datasets: [
                    {
                      backgroundColor: ['#79021c'],
                      borderColor: ['#79021c'],
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
                        color: "#79021c",
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
        ) : (
          <></>
        )}
        
        <div className="pagebreak"> </div> {/*For page printing*/}
        {/* top 10 fires by duration */}
        <br />
        <br />
        <h1 style={{color: 'black'}}>
                <LocalFireDepartmentIcon fontSize="large" /> Historical Top 10 
              </h1>
        {Object.keys(durationData).length > 1 ? (
          <>
          <h3>
                <b>Top 10 Fires by Duration (in days)</b>
              </h3>
              <h5>
                <a href="https://data-nifc.opendata.arcgis.com">
                  Source: National Interagency Fire Center{' '}
                  <LaunchIcon fontSize="small" />
                </a>
              </h5>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <div className={styles['graph']}>
              <Bar
                data={{
                  labels: Object.values(durationData).reverse(),
                  datasets: [
                    {
                      label: 'Top 10 Fire Duration',
                      backgroundColor: ['#f50538'],
                      data: Object.keys(durationData).reverse(),
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                      labels: {
                        color: "#f50538",
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
        ) : (
          <></>
        )}
        <div className="pagebreak"> </div> {/*For page printing*/}
        {/* top 10 acres */}
        {Object.keys(top10Data).length > 1 ? (
          <>
          <h3>
                <b>Top 10 Fires by Total Acres Burned</b>
              </h3>
              <h5>
                <a href="https://data-nifc.opendata.arcgis.com">
                  Source: National Interagency Fire Center{' '}
                  <LaunchIcon fontSize="small" />
                </a>
              </h5>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <div className={styles['graph']}>
              <Bar
                data={{
                  labels: Object.values(top10Data).reverse(),
                  datasets: [
                    {
                      label: 'Top 10 Acres',
                      backgroundColor: ['#b6042a'],
                      data: Object.keys(top10Data).reverse(),
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                      labels: {
                        color: "#b6042a",
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
        ) : (
          <></>
        )}
      </>
    );
  }
}
