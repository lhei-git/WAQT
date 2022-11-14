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
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(url).then(response => {
      setData(response.data);
      setLoading(false);
      console.log(data)
    });
  }, []);
  useEffect(() => {
    axios.get(url2).then(response => {
      setData(response.data);
      setLoading(false);
      console.log(data)
    });
  }, []);
  useEffect(() => {
    axios.get(url3).then(response => {
      setData(response.data);
      setLoading(false);
      console.log(data)
    });
  }, []);
  useEffect(() => {
    axios.get(url4).then(response => {
      setData(response.data);
      setLoading(false);
      console.log(data)
    });
  }, []);
  useEffect(() => {
    axios.get(url5).then(response => {
      setData(response.data);
      setLoading(false);
      console.log(data)
    });
  }, []);

  if (isLoading) {
    return (
      <p>Loading...</p>
    )
  } else {

    return (
      <>
      {Object.keys(data["count"]).length > 1 || Object.keys(data["acres"]).length > 1 || Object.keys(data["top10"]).length > 1 || Object.keys(data["average"]).length > 1 || Object.keys(data["top10Duration"]).length > 1 ?
      <h1><TrendingUpIcon fontSize='large' /> Historical Wildfire Measurements</h1>
    : <></>}
      
        {Object.keys(data["count"]).length > 1 ?
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
                  labels: Object.keys(data["count"]),
                  datasets: [
                    {


                      data: Object.values(data["count"]),
                    },
                  ],
                }}
                options={{
                  responsive: true,

                }}
              />
            </div>

          </Grid>
          : <></>}
        {Object.keys(data["acres"]).length > 1 ?
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
                  labels: Object.keys(data["acres"]),
                  datasets: [
                    {
                      label: 'Total Acres Per Month',
                      backgroundColor: ["#3e95cd"],
                      data: Object.values(data["acres"]),
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
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
        {Object.keys(data["top10"]).length > 1 ?
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
             <div>
              <h3><b>Top 10 Fires</b></h3>
              <h5>Beginning January 2015</h5>
              <h5> Measured by total acres</h5>
              <h5><a href="https://data-nifc.opendata.arcgis.com">Source: National Interagency Fire Center <LaunchIcon fontSize="small" /></a></h5>
            </div>
            <div className={styles["graph"]}>
              <Line
                data={{
                  labels: Object.keys(data["top10"]),
                  datasets: [
                    {
                      label: 'Top 10 Fires',
                      backgroundColor: ["#3e95cd"],
                      data: Object.values(data["top10"]),
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
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
        {Object.keys(data["average"]).length > 1 ?
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
                  labels: Object.keys(data["average"]),
                  datasets: [
                    {
                      label: 'PM10 Highest Quartely Values',
                      backgroundColor: ["#3e95cd"],
                      data: Object.values(data["average"]),
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
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
        {Object.keys(data["top10Duration"]).length > 1 ?
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
              <Line
                data={{
                  labels: Object.keys(data["top10Duration"]),
                  datasets: [
                    {
                      label: 'Top 10 Fire Duration',
                      backgroundColor: ["#3e95cd"],
                      data: Object.values(data["top10Duration"]),
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
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