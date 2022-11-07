import { useLoadScript } from '@react-google-maps/api';
import './app.css';
import {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  useLayoutEffect,
  ComponentLifecycle,
  Component
} from 'react';
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
  InfoWindow,
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
import { AxiosResponse } from "axios";


//=================================================
//=================== Variables ===================
//=================================================

let lat: number;
let lng: number;
let countyFormatted;
let splitVal;
let splitVals;

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
    const val = localStorage.getItem('val');
    setPlace(typeof val === 'string' ? val : '');
    splitVal = val?.split(', ');
    if (splitVal) {
      console.log(splitVal[1]);
    }
    splitVals = splitVal[1];

    const county = localStorage.getItem('county')?.slice(0, -7);
    countyFormatted = county!.replace(/ /g, '+');
    console.log(countyFormatted);
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
    axios.get(url).then((response) => data.push(response.data));
    // setData(data);
    console.log(data);
  }, []); 

  const getData = async () => {
    const response = await axios.get(url);
    console.log(response);
    return response;
  };

  const [markerData , setMarkerData] = useState<AxiosResponse | null>(null);

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

  return (
    <>
      <Nav />
      <h1>{place}</h1>
      <div></div>
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
                lng: Number(item.irwin_InitialLongitude),
              }}
              icon="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
            />
          ))}
        </GoogleMap>
        <CurrentAQI lat={lat} lng={lng} />
        <ActiveFiresTable
          county={countyFormatted ? countyFormatted : 'Wayne'}
          state={splitVal ? splitVal[1] : 'MI'}
        />
      </div>
    </>
  );
}
