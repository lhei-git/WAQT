import { useLoadScript } from '@react-google-maps/api';
import './app.css';
import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
} from '@react-google-maps/api';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import Nav from "./nav";
import axios from "axios"
import CurrentAQI from './currentAQITable';
import ActiveFiresTable from './activeFireTable';

let lat: number;
let lng: number;
let countyFormatted;
let splitVal;

//Typescript variables
type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;
// const String = "place";

export default function App() {
  //This renders the search and greeting page of our web app
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDGIeoq8LW_KoZl-8Bm5y_n9bGWjvI44ZQ',
    libraries: ['places'],
  });
  //Google Map Render Options
  const options = useMemo<MapOptions>(
    () => ({
      mapId: 'b181cac70f27f5e6', //map styling
      disableDefaultUI: false,
      clickableIcons: true,
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: true,
      fullscreenControl: true,
    }),
    []
  );
  const [location, setLocation] = useState<LatLngLiteral>(); //Literal object containing Lat and Long
  const [place, setPlace] = useState<string | undefined>(); 

  const updateLocation = useCallback(() => {
    const val = localStorage.getItem('val');
    setPlace(typeof val === 'string' ? val : '');
    splitVal = val?.split(", ");
    if(splitVal){
      console.log(splitVal[1])
    }

    const county = localStorage.getItem('county')?.slice(0, -7);
    countyFormatted = county!.replace(/ /g,"+");
    console.log(countyFormatted)
    //Grab lat and lng from local storage
    const lattitude = localStorage.getItem('lat');
    const longitude = localStorage.getItem('lng');
    lat = Number(lattitude);
    lng = Number(longitude);
    Number(lat);
    Number(lng);
    setLocation({ lat, lng });
  }, []);

  useEffect(() => {
    updateLocation();
  }, [updateLocation]);

  if (!isLoaded) return <div>Loading...</div>;
  console.log(location);
  return (
    <>
    <Nav/>
    <h1>{place}</h1>
      <div>
        {/* <h2>Lattitude: {lattitude}</h2>
        <h2>Longitude: {longitude}</h2> */}
      </div>
      <div className="map">
        <GoogleMap
          options={options} //Google Map render options
          zoom={10} //Level of Zoom when user first loads the page
          center={location}
          mapContainerClassName="map-container" //Map CSS
          //   onLoad={onLoad} //upon loading, call the onLoad function
        >
          {/* If there is a location, then pass in the location, which is a latlngliteral, to place a marker on the location */}
          {location && (
            <>
              <Marker position={location} />
            </>
          )}
        </GoogleMap>
        <CurrentAQI 
          lat={lat}
          lng={lng}
        />
        <ActiveFiresTable 
          county={countyFormatted? countyFormatted: "Wayne"}
          state={splitVal? splitVal[1]: "MI"}
        
        />
      </div>
    </>
  );
}
