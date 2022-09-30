
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import './app.css';
import michiganAQI from './michiganInitialLatitude.json';
import axios from "axios"
import {userLocation} from './searchLocation'

  
const Map = () => {
  //url that converts location to coordinates
  const url = 'http://localhost:8002/search?City='+userLocation;

  const [data,setData] = useState([]);
  useEffect(() => {
    axios.get(url)
      .then((response) => setData(response.data));
    }, []);
  
  console.log(data.Lat);
  //console.log(michiganAQI);
  var gLocation = sessionStorage.getItem('gLocation'); //get global gLocation string
  if(data.Lat != undefined)
  return (
    <>
      {/* <p>{gLocation}</p> */}
      {/* Map Container is it's properties */}
      <MapContainer
        center={[data.Lat, data.Lon]}
        zoom={13}
        scrollWheelZoom={true}
      >
        {/* TileLayer is used to load and display tile layers on the map, implements ILayer interface. */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Parse .json file by field 'AQI.Date', and place map marker at every 'AQI.Date's '(AQI.SITE_LATITUDE, AQI.SITE_LONGITUDE)' */}
        {michiganAQI.map((AQI) => (
          <Marker
            key = {AQI.Date}
            position={[AQI.SITE_LATITUDE, AQI.SITE_LONGITUDE]}>
          </Marker>
        ))}

        {/* Add pop up message when mouse is hovered over map marker */}
        {/* <Popup>
            Detroit
          </Popup> */}
      </MapContainer>
    </>
  );
  else{
    return(
      <div>
        Loading...
      </div>
    );
  }
};

export default Map;
