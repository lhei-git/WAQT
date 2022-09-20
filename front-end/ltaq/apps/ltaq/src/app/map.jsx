import React from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import './app.css';
import michiganAQI from './michiganInitialLatitude.json';

//() =>
//means:
//the left part denotes the input of a function and the right part the output of that function

const Map = () => {
  console.log(michiganAQI);
  var gLocation = sessionStorage.getItem('gLocation'); //get global gLocation string

  return (
    <>
      <p>{gLocation}</p>
      <MapContainer
        center={[42.3314, -83.0458]}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {michiganAQI.map((AQI) => (
          <Marker
            key = {AQI.Date}
            position={[AQI.SITE_LATITUDE, AQI.SITE_LONGITUDE]}>
          </Marker>
        ))}
        {/* <Popup>
            Detroit
          </Popup> */}
      </MapContainer>
    </>
  );
};

export default Map;
