import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
Chart.register(...registerables);


export default function AQIGraphs() {
  const bbox = "-83.553673,42.029418,-82.871707,42.451216"
  const startDate = "2022-09-5T16"
  const endDate = "2022-10-5T17"
  const url = "localhost:8000/all?startDate="+startDate+"&endDate="+endDate+"&bbox="+bbox;
  console.log(url)
  //arrays to hold all the data 
  const pm25: string[] = []
  const pm25Dates: string[] = []
  const pm10: string[] = []
  const pm10Dates: string[] = []
  const ozone: string[] = []
  const ozoneDates: string[] = []
  const co: string[] = []
  const coDates: string[] = []
  const so2: string[] = []
  const so2Dates: string[] = []
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    axios.get(url)
      .then((response) => 
      setData(response.data)
      );
    }, []);

    for (let index = 0; index < data.length; index++) {
      if(data[index].Parameter = "PM2.5") {
        pm25.push(data[index].Value)
        pm25Dates.push(data[index].UTC)
      }
      else if(data[index].Parameter = "PM10") {
        pm10.push(data[index].Value)
        pm10Dates.push(data[index].UTC)
      }
      else if(data[index].Parameter = "OZONE") {
        ozone.push(data[index].Value)
        ozoneDates.push(data[index].UTC)
      }
      else if(data[index].Parameter = "S02") {
        so2.push(data[index].Value)
        so2Dates.push(data[index].UTC)
      }
      else if(data[index].Parameter = "S02") {
        co.push(data[index].Value)
        coDates.push(data[index].UTC)
      }

    }
    console.log(pm25)
    console.log(pm10)
    console.log(ozone)
    console.log(so2)
    console.log(co)
    return (
      
      <div>
                  hello
      </div>
    );
  
  
}
