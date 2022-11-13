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
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import PrintIcon from '@mui/icons-material/Print';
import fire from './Fire Icon.jpeg';
import FireStatsTable from './fireStatsTable';
import AverageGraph from './AvgGraph';
import { AxiosResponse } from "axios"
import AirQualityGraphs from './airqualitygraphs';
import AcresPerMonth from './acresPerMonth';

//=================================================
//=================== Variables ===================
//=================================================

let lat: number;
let lng: number;
let countyFormatted;
let splitVal;

let splitVals;
let val;

let mapUrl;

//Typescript variables
type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;

//=================================================
//=================== Component ===================
//=================================================
export default function App() {
  //Google Maps Script/API Key
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

    mapUrl = 'http://localhost:8001/mapmarkers?county=' +
      countyFormatted +
      '&state=' +
      splitVals;

  }, []);

  useEffect(() => {
    updateLocation();
  }, [updateLocation]);

  //=================================================
  //============= Grab Active Wildfires =============
  //=================================================

  useEffect(() => {
    axios.get(mapUrl).then((response) => setData(response.data));
    // setData(data);
    console.log(data);
  }, []);

  const getData = async () => {
    const response = await axios.get(mapUrl);
    console.log(response);
    return response;
  };

  const [markerData, setMarkerData] = useState<AxiosResponse | null>(null);

  async function fetchMarkerData() {
    const json = await getData();
    setMarkerData(json);
  }
  useEffect(() => { 
    fetchMarkerData();
  }, []);

  //=================================================
  //================= Return/Render =================
  //=================================================
  if (!isLoaded) return <div>Loading...</div>;
  console.log(location);
  console.log(data);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      
        <Nav />
        <div className="printButtonContainer">
          <button className="printButton" onClick={handlePrint}>
            {<PrintIcon fontSize='large' />}
          </button>
        </div>
      
      <h2 ><b><i className="fa fa-location-arrow"></i> {val}</b></h2>
      
      <div className="w3-row-padding  w3-margin-bottom ">
        <CurrentAQI
          lat={lat}
          lng={lng}
        />
      </div>
      <div className="w3-panel">
        <div className="w3-row-padding">
        <h2><LocalFireDepartmentIcon /> Active Wildfires</h2>
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
                    visible={true}
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
              state={splitVals}
            />
          </div>
        </div>
      </div>
      <div className="w3-container w3-margin-bottom">
        <FireStatsTable
          county={countyFormatted}
          state={splitVals}
          fullName={val}
        />
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="w3-container w3-margin-bottom">
        <AirQualityGraphs 
          county={countyFormatted}
          state={splitVals}
        />
      </div>
    
    </>
  );
}