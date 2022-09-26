import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
Chart.register(...registerables);

export default function PM25Graph() {
  const [dates, setDate] = useState<any[]>([]);
  const [values, setValues] = useState<any[]>([]);
  const getData = () => {
    fetch(
      'http://localhost:8000/pm25?startDate=2022-09-17T16&endDate=2022-09-17T17&bbox=-83.553673,42.029418,-82.871707,42.451216'
    )
      .then((result) => result.json())
      .then((output) => {
        for (let i = 0; i < output.length; i++) {
          dates.push(output[i].UTC);
          values.push(output[i].Value);
        }
      })
      .catch((err) => console.error(err));
    
  };

  console.log(values[0]);
  useEffect(() => {
    getData();
  }, []);

  const state = {
    labels: dates,
    datasets: [
      {
        label: 'Holy crap it finally works',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: values,
      },
    ],
  };

  console.log('after loop');
  return (
    <div>
      <Bar data={state} v-if="loaded" />
    </div>
  );
}
