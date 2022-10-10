import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
Chart.register(...registerables);


export default function WildfireGraphs() {

  const url = "localhost:8081:
  console.log(url)

  //arrays to hold all the data 
  const AcresBurned: string[] = []
  const IncidentName: string[] = []
  const AvgDuration: string[] = []
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    axios.get(url)
      .then((response) => 
      setData(response.data)
      );
    }, []);

    for (let index = 0; index < data.length; index++) {
      if(data[index].Parameter = "Acres") {
        AcresBurned.push(data[index].Value)
        AcresBurned.push(data[index].UTC)

        const fires = [" "];
        fires.sort();
      }
      else if(data[index].Parameter = "Name") {
        IncidentName.push(data[index].Value)
        IncidentName.push(data[index].UTC)
      }
      else if(data[index].Parameter = "Duration") {
        AvgDuration.push(data[index].Value)
        AvgDuration.push(data[index].UTC)

        const duration = [" "];
        duration.sort();
      }

    }
    console.log(AcresBurned)
    console.log(IncidentName)
    console.log(AvgDuration)
    return (
      
      <div>
                
      </div>
    );
  
  
}