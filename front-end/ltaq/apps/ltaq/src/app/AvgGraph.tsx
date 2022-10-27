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

export default function AverageGraph({county, state}: Props) {
  const url ="http://localhost:8001/wildfire/average?location="+county+"&state="+state;
  console.log(url);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    axios.get(url).then((response) => setData(response.data));
  }, []);
  if(data[2022] == -1 && data[2021] == -1 && data[2020] == -1 && data[2019] == -1) {
    return (
      <></>
    )
  }else {
    return (
      <span>
      <div className={styles["graph"]}>
        <Line
          data={{
            labels: Object.keys(data),
            datasets: [
              {
                label: 'Average Fire Duration (Days)',
                backgroundColor: ["#3e95cd"],
                data: Object.values(data),
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
    );
  }
  
}