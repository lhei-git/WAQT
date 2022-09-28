import { useState } from "react";

//this array stores all information we need for a location
export const locationInfo: string[] = ["Anaheim", "33.8347516", "-117.911732"];



//this method takes location and the type (state,county,city,zip)
//and sends it to the coordinates endpoint
//then stores it in a variable for other components to access
export function locationHandeler(locationInput: string, locationTypeInput: string): void {
  //clear out original information
  if(locationInfo.length!=0) {
    while(locationInfo.length){
      locationInfo.pop();
    }
  }
    //url that converts location to coordinates
    locationInfo.push(locationInput).toString;
    const url = 'http://localhost:8002/search?City='+locationInput;
    const fetchData = () => {
        fetch(url)
          .then((response) => response.json())
          .then((actualData) => {
            locationInfo.push(actualData.Lat).toString;
            locationInfo.push(actualData.Lon).toString;
          })
          .catch((err) => {
            console.log(err.message);
          });
      };
    
      fetchData();
      
    
}

