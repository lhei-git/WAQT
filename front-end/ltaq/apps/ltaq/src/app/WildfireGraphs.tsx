import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import styles from "./app.module.css";
Chart.register(...registerables);
import Grid from '@mui/material/Unstable_Grid2';
import LaunchIcon from '@mui/icons-material/Launch';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
//returns a graph which displays Data
//This data can be in a specific date range
interface Props {
  county: string;
  state: string;
}

export default function WildFireGraphs({ county, state }: Props) {
  const url = "http://localhost:8001/wildfire/count?location=" + county + "&state=" + state;
  const url2  = "http://localhost:8001/wildfire/acres?location=" + county + "&state=" + state;
  const url3 = "http://localhost:8001/wildfire/top10?location=" + county + "&state=" + state;
  const url4 = "http://localhost:8001/wildfire/average?location=" + county + "&state=" + state;
  const url5 = "http://localhost:8001/wildfire/top10Duration?location=" + county + "&state=" + state;

  console.log(url);
  const [countData, setCountData] = useState<any[]>([]);
  const [acresData, setAcresData] = useState<any[]>([]);
  const [top10Data, setTop10Data] = useState<any[]>([]);
  const [averageData, setAverageData] = useState<any[]>([]);
  const [durationData, setDurationData] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(url).then(response => {
      setCountData(response.data);
      console.log(countData);
    });
  }, []);
  useEffect(() => {
    axios.get(url2).then(response => {
      setAcresData(response.data);
      console.log(acresData)
    });
  }, []);
    useEffect(() => {
    axios.get(url4).then(response => {
      setAverageData(response.data);
      console.log(averageData)
    });
  }, []);
  useEffect(() => {
    axios.get(url3).then(response => {
      setTop10Data(response.data);
      console.log(top10Data)
    });
  }, []);
  useEffect(() => {
    axios.get(url5).then(response => {
      setDurationData(response.data);
      console.log(durationData)
      setLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <p>Loading...</p>
    )
  } else {

    return (
      <>
      <h1><TrendingUpIcon fontSize='large' /> Historical Wildfire Trends</h1>
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
              <h5>Beginning January 2015</h5>
              <h5><a href="https://data-nifc.opendata.arcgis.com">Source: National Interagency Fire Center <LaunchIcon fontSize="small" /></a></h5>
            </div>
            <div className={styles["graph"]}>

              <Line
                data={{
                  labels: Object.keys(countData),
                  datasets: [
                    {
                      data: Object.values(countData),
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
              <h3><b>Total Acres Per Month</b></h3>
              <h5>Beginning January 2015</h5>
              <h5><a href="https://data-nifc.opendata.arcgis.com">Source: National Interagency Fire Center <LaunchIcon fontSize="small" /></a></h5>
            </div>
            <div className={styles["graph"]}>
              <Line
                data={{
                  labels: Object.keys(acresData),
                  datasets: [
                    {
                      backgroundColor: ["#3e95cd"],
                      borderColor: ["#3e95cd"],
                      data: Object.values(acresData),
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
              <h3><b>Average Fire Duration Per Month</b></h3>
              <h5>Beginning January 2015</h5>
              <h5><a href="https://data-nifc.opendata.arcgis.com">Source: National Interagency Fire Center <LaunchIcon fontSize="small" /></a></h5>
            </div>
            <div className={styles["graph"]}>
              <Line
                data={{
                  labels: Object.keys(averageData),
                  datasets: [
                    {
                      backgroundColor: ["#3e95cd"],
                      borderColor: ["#3e95cd"],
                      data: Object.values(averageData),
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
              <h3><b>Top 10 Fires</b></h3>
              <h5>Beginning January 2015</h5>
              <h5>Measured by fire duration</h5>
              <h5><a href="https://data-nifc.opendata.arcgis.com">Source: National Interagency Fire Center <LaunchIcon fontSize="small" /></a></h5>
            </div>
            <div className={styles["graph"]}>
              <Bar
                data={{
                  labels: Object.values(durationData),
                  datasets: [
                    {
                      label: 'Top 10 Fire Duration',
                      backgroundColor: ["#3e95cd"],
                      data: Object.keys(durationData),
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
              <h3><b>Top 10 Acres</b></h3>
              <h5>Beginning January 2015</h5>
              <h5> Measured by total acres</h5>
              <h5><a href="https://data-nifc.opendata.arcgis.com">Source: National Interagency Fire Center <LaunchIcon fontSize="small" /></a></h5>
            </div>
            <div className={styles["graph"]}>
              <Bar
                data={{
                  labels: Object.values(top10Data),
                  datasets: [
                    {
                      label: 'Top 10 Acres',
                      backgroundColor: ["#3e95cd"],
                      data: Object.keys(top10Data),
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