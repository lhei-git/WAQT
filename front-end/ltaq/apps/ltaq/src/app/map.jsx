import React from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import './app.css';
import michiganAQI from './michiganInitialLatitude.json';
import {locationInfo} from './locationHandler'
const Map = () => {
  console.log(michiganAQI);
  var gLocation = sessionStorage.getItem('gLocation'); //get global gLocation string

  return (
    <>
      {/* <p>{gLocation}</p> */}
      {/* Map Container is it's properties */}
      <MapContainer
        center={[locationInfo[1], locationInfo[2]]}
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
};

export default Map;
