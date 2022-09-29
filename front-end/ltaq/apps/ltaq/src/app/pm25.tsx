import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
Chart.register(...registerables);

export default function PM25Graph() {
  const url = "http://localhost:8000/pm25?startDate=2022-09-17T16&endDate=2022-09-17T17&bbox=-83.553673,42.029418,-82.871707,42.451216";
  const values: string[] = []
  const dates: string[] = []
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    axios.get(url)
      .then((response) => 
      setData(response.data)
      );
    }, []);

    for (let index = 0; index < data.length; index++) {
      values.push(data[index].Value)
      dates.push(data[index].UTC)
    }
    console.log(values)
    return (
      
      <div>
                  <Bar 
                    data={{
                        labels: dates,
                        datasets: [
                            {
                                label: "PM 25",
                                data: values
                            }
                        ]
                    }}
                />
      </div>
    );
  
  
}
