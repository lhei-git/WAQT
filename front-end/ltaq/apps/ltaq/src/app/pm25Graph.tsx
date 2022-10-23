import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import styles from "./app.module.css";
Chart.register(...registerables);

//returns a bar graph which displays PM25 Data
//This data can be in a specific date range

//TODO: Add coordinate support
export default function PM25Graph() {
  const bbox = '-83.553673,42.029418,-82.871707,42.451216';
  const url =
    'http://localhost:8000/pm25?bbox='+bbox;
  console.log(url);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    axios.get(url).then((response) => setData(response.data));
  }, []);
  return (
    <span>
    <div className={styles["graph"]}>
      <Line
        data={{
          labels: Object.keys(data),
          datasets: [
            {
              label: 'PM 25',
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
              text: ' Worst PM 25 Chart',
            },
          },
        }}
      />
    </div>
    </span>
  );
}
