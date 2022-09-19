import React, { useState, useEffect, MapContainer } from "react";
import L from "leaflet";
import "./app.css";
import 'leaflet/dist/leaflet.css';

//() =>
//means:
//the left part denotes the input of a function and the right part the output of that function

const Map = () => {
  var gLocation = sessionStorage.getItem("gLocation"); //get global gLocation string
  const map = L.map("map");
    // This useEffect hook runs when the component is first mounted, 
  // similar to componentDidMount() lifecycle method of class-based
  // components:
  // useEffect(() => {
    // const map = L.map("map", mapParams);
  //   // map.off();
  //   // map.remove();
  // }, []);

    // Create our map tile layer:
    const MAP_TILE = L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    // Define the styles that are to be passed to the map instance:
    const mapStyles = {
      overflow: "hidden",
      width: "100%",
      height: "100vh"
    };

    // Define an object literal with params that will be passed to the map:
  const mapParams = {
    center: [37.0902, -95.7129],
    zoom: 3,
    zoomControl: false,
    maxBounds: L.latLngBounds(L.latLng(-150, -240), L.latLng(150, 240)),
    layers: [MAP_TILE]
  };
   
  return (
    <>
    <p>{gLocation}</p>
    <div id="map" style={mapStyles} />
    {/* <div id="map"/> */}
    </>
    
  )
}

export default Map;