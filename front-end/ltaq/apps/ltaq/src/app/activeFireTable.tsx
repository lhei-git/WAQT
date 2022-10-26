// App.js
import { useEffect, useState } from "react";
import styles from "./app.module.css";
import axios from "axios"

//This returns a table from the wildfire API
//returns Date, Name, Acres and Cause when available
interface Props {
  county: string;
  state: string;
}

function ActiveFiresTable({county, state}: Props) {
  //TODO: get data from map
  const url = "http://localhost:8001/activecounty?county="+county+"&state="+state
  console.log(url)
  const [data, setData] = useState<any[]>([]);
  const [stateData, setStateData] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(url).then(response => {
      data.push(response.data);
      setLoading(false);
    });
  }, []);

  
  if (isLoading) {
    return <div >Loading...</div>;
  }else{
    return (
      
      <div className={styles['row']}>
      <div className={styles['column']}>
        <table>
          <tr>
            {/* Headers */}
            <th>Fire Name</th>
            <th>Start Date</th>
          </tr>
          {data.map((item, index) => (
          <tr key={index}>
            {/* access json data using each key you need, this will be dynamically allocated */}
            <td>{item.IncidientName}</td>
            <td>{item.DiscoveryDate}</td>
          </tr>
        ))
        }
        </table>
      </div>
    </div>
    );
  }
  
}

export default ActiveFiresTable;