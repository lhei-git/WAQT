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

export default function AirQualityGraphs({ county, state }: Props) {
  const url = "http://localhost:8000/trends?county=" + county + "&state=" + state;
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

  if (isLoading) {
    return (
      <p>Loading...</p>
    )
  } else {

    return (
      <>
      {Object.keys(data["PM25"]).length > 1 || Object.keys(data["PM10"]).length > 1 || Object.keys(data["Ozone"]).length > 1 ?
      <h1><TrendingUpIcon fontSize='large' /> Historical Air Quality Measurements</h1>
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
              <h5>Unit of Measurement: ug/m3</h5>
              <h5><a href="https://www.epa.gov/aqs">Source: Environmental Protection Agency Air Quality System <LaunchIcon fontSize="small" /></a></h5>
            </div>
            <div className={styles["graph"]}>

              <Line
                data={{
                  labels: Object.keys(data["PM25"]),
                  datasets: [
                    {
                      data: Object.values(data["PM25"]),
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
              <h5>Unit of Measurement: ug/m3</h5>
              <h5><a href="https://www.epa.gov/aqs">Source: Environmental Protection Agency Air Quality System <LaunchIcon fontSize="small" /></a></h5>
            </div>
            <div className={styles["graph"]}>
              <Line
                data={{
                  labels: Object.keys(data["PM10"]),
                  datasets: [
                    {
                      backgroundColor: ["#3e95cd"],
                      borderColor: ["#3e95cd"],
                      data: Object.values(data["PM10"]),
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
              <h5>Unit of Measurement: ug/m3</h5>
              <h5><a href="https://www.epa.gov/aqs">Source: Environmental Protection Agency Air Quality System <LaunchIcon fontSize="small" /></a></h5>
            </div>
            <div className={styles["graph"]}>
              <Line
                data={{
                  labels: Object.keys(data["Ozone"]),
                  datasets: [
                    {
                      backgroundColor: ["#3e95cd"],
                      borderColor: ["#3e95cd"],
                      data: Object.values(data["Ozone"]),
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