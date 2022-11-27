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
  const url = "http://localhost:8001/mapmarkers?county="+county+"&state="+state
  console.log(url)
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
    return <div >Loading...</div>;
  }else if(data.length != 0){
    return (
      <>
      <div className={styles['activeRow']}>
      <div className={styles['column']}>
      <tr>
            {/* Headers */}
            <th>Fire Name</th>
            <th>Start Date</th>
            <th>Fire Cause</th>
          </tr>
      {data.splice(0,5).map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <td>{item.date}</td>
            <td>{item.cause}</td>

          </tr>
        ))
        }
        
      </div>
    </div>
    </>
    );
  }else{
    return (
      <h3 color="red">No current active wildfires </h3>
    )
    
  }
  
}

export default ActiveFiresTable;