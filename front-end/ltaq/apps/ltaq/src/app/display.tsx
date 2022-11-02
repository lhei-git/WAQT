import { useLoadScript } from '@react-google-maps/api';
import './app.css';
import { useState, useMemo, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
  InfoWindow
} from '@react-google-maps/api';
import usePlacesAutocomplete, {
  GeocodeResult,
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import Nav from './nav';
import axios from 'axios';
import CurrentAQI from './currentAQITable';
import ActiveFiresTable from './activeFireTable';

import fire from './Fire Icon.jpeg';
import FireStatsTable from './fireStatsTable';
import AverageGraph from './AvgGraph';
//=================================================
//=================== Variables ===================
//=================================================

let lat: number;
let lng: number;
let countyFormatted;
let splitVal;

let splitVals;
let val;

//Typescript variables
type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;

//=================================================
//=================== Component ===================
//=================================================
export default function App() {
  //Google Maps Script/API Key
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'KEY_HERE',
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

  //Hooks
  const [location, setLocation] = useState<LatLngLiteral>(); //Literal object containing Lat and Long
  const [place, setPlace] = useState<string | undefined>();
  const [data, setData] = useState<any[]>([]);

  //================================================================================
  //================= Grab county, lat, and lng from local storage =================
  //================================================================================
  const updateLocation = useCallback(() => {
    val = localStorage.getItem('val');
    setPlace(typeof val === 'string' ? val : '');
    splitVal = val?.split(', ');
    if (splitVal) {
      console.log(splitVal[1]);
    }

    splitVals = splitVal[1];
    if (val?.includes("County")) {
      console.log(splitVal[0].replace(" County", ""))
      countyFormatted = splitVal[0].replace(" County", "")
    } else {
      const county = localStorage.getItem('county')?.slice(0, -7);
      countyFormatted = county!.replace(/ /g, "+");
      console.log(countyFormatted)
    }


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

  //=================================================
  //============= Grab Active Wildfires =============
  //=================================================
  const url =
    'http://localhost:8001/activecounty?county=' +
    countyFormatted +
    '&state=' +
    splitVals;
  console.log(url);

  useEffect(() => {
    axios.get(url).then((response) =>
      data.push(response.data));
    // setData(data);
    console.log(data);
  }, []);

  //=================================================
  //================= Return/Render =================
  //=================================================
  if (!isLoaded) return <div>Loading...</div>;
  console.log(location);
  console.log(data);

  return (
    <>

      <Nav />
      <h2 ><b><i className="fa fa-location-arrow"></i> {val}</b></h2>
      <div className="w3-row-padding w3-margin-bottom">
        <CurrentAQI
          lat={lat}
          lng={lng}
        />
      </div>
      <div className="w3-panel">
        <div className="w3-row-padding">
          <div className="w3-twothird">
            <div className="map">
              <GoogleMap
                options={options} //Google Map render options
                zoom={10} //Level of Zoom when user first loads the page
                center={location}
                mapContainerClassName="map-container" //Map CSS
              // onLoad={onLoad} //upon loading, call the onLoad function
              >
                {/* If there is a location, then pass in the location, which is a latlngliteral, to place a marker on the location */}
                {location && (
                  <>
                    <Marker position={location} />
                  </>
                )}
                {data.map((item, index) => (
                  <Marker
                    key={index}
                    position={{
                      lat: Number(item.irwin_InitialLatitude),
                      lng: Number(item.irwin_InitialLongitude)
                    }}
                    icon="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
                  />
                ))}
              </GoogleMap>
            </div>
          </div>
          <div className="w3-third">
            <ActiveFiresTable
              county={countyFormatted}
              state={splitVal}
            />
          </div>
        </div>
      </div>
      <div className="w3-container">
        <FireStatsTable
          county={countyFormatted}
          state={"CA"}
        />
      </div>
      <div className="w3-container">
      <AverageGraph 
            county={countyFormatted}
            state={splitVal? splitVal[1]: "MI"}
          />
      </div>
    </>
  );
}
