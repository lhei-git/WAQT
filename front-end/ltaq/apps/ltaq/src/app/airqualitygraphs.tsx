import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import styles from "./app.module.css";
Chart.register(...registerables);

//returns a graph which displays Data
//This data can be in a specific date range
interface Props {
  county: string;
  state: string;
}

export default function AirQualityGraphs({county, state}: Props) {
  const url ="http://localhost:8000/trends?county="+county+"&state="+state;
  console.log(url);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    axios.get(url).then((response) => setData(response.data));
  }, []);
  if(!data) {
    return (
      <></>
    )
  }else {
    return (
        <>
      <span>
      <div className={styles["graph"]}>
        <Line
          data={{
            labels: Object.keys(data["PM25"]),
            datasets: [
              {
                label: 'PM2.5 Quartely Values',
                backgroundColor: ["#3e95cd"],
                data: Object.values(data["PM25"]),
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
      </span> 
      <span>
      <div className={styles["graph"]}>
        <Line
          data={{
            labels: Object.keys(data["PM10"]),
            datasets: [
              {
                label: 'PM10 Quartely Values',
                backgroundColor: ["#3e95cd"],
                data: Object.values(data["PM10"]),
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
      </span> 
      <span>
      <div className={styles["graph"]}>
        <Line
          data={{
            labels: Object.keys(data["Ozone"]),
            datasets: [
              {
                label: 'Ozone Quartely Values',
                backgroundColor: ["#3e95cd"],
                data: Object.values(data["Ozone"]),
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
      </span> 
      </>
    );
  }
  
}