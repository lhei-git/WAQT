import { useLoadScript } from '@react-google-maps/api';
import './app.css';
import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import {
  GoogleMap,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import Nav from './navDisplay';
import axios from 'axios';
import CurrentAQI from './currentAQITable';
import ActiveFiresTable from './activeFireTable';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import PrintIcon from '@mui/icons-material/Print';
import AirIcon from '@mui/icons-material/Air';
import TerrainIcon from '@mui/icons-material/Terrain';
import LaunchIcon from '@mui/icons-material/Launch';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FireStatsTable from './fireStatsTable';
import { AxiosResponse } from 'axios';
import AirQualityGraphs from './airqualitygraphs';
import fireMarker from './fire_emoji.svg';
import WildFireGraphs from './WildfireGraphs';
import Footer from './footer';

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
    googleMapsApiKey: '',
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
  const [infoWindowID, setInfoWindowID] = useState('');
  const [markerData, setMarkerData] = useState<AxiosResponse | null>(null);

  //================================================================================
  //================= Grab county, lat, and lng from local storage =================
  //================================================================================
  //Get the user searched location info from local storage
  const updateLocation = useCallback(() => {
    val = localStorage.getItem('val');
    setPlace(typeof val === 'string' ? val : '');
    splitVal = val?.split(', ');
    if (splitVal) {
      console.log(splitVal[1]);
    }

    //Extract just the county name
    splitVals = splitVal[1];
    if (val?.includes('County')) {
      console.log(splitVal[0].replace(' County', ''));
      countyFormatted = splitVal[0].replace(' County', '');
    } else {
      const county = localStorage.getItem('county')?.slice(0, -7);
      countyFormatted = county!.replace(/ /g, '+');
      console.log(countyFormatted);
    }

    //Grab lat and lng from local storage and set the location to be used in Display.tsx
    const lattitude = localStorage.getItem('lat');
    const longitude = localStorage.getItem('lng');
    lat = Number(lattitude);
    lng = Number(longitude);
    Number(lat);
    Number(lng);
    setLocation({ lat, lng });

    //Format the URL to send to the URL endpoints WildFire.py and airnow.py
    mapUrl =
      'http://localhost:8001/mapmarkers?county=' +
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
  //Get the active wildfire api info from the URL endpoint
  useEffect(() => {
    axios.get(mapUrl).then((response) => setData(response.data));
    // setData(data);
    console.log(data);
  }, []);

  //Wait for wildfire data to get be returned from the wildfire api (WildFire.py)
  const getData = async () => {
    const response = await axios.get(mapUrl);
    console.log(response);
    return response;
  };

  ///When wildfire data is returned and present, use that wildfire location data to set the Google Map Markers
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

  //Print Button and function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="backBody">
      <>
        <div className="printable">
          <Nav />

          <h1>
            <b>
              <i className="fa fa-location-arrow"></i> {val}
            </b>
            <button className="printButton" onClick={handlePrint}>
              {/* Print Button */}
              {<PrintIcon fontSize="large" />}
            </button>
          </h1>
          <div className="w3-row-padding  w3-margin-bottom ">
              <br />
              {/* Current AQI Section */}
              <CurrentAQI lat={lat} lng={lng} />
            <div className="pagebreak"> </div> {/*For page printing*/}
            <br />
          </div>
          <div className="w3-row-padding  w3-margin-bottom ">
            <div className="currentActiveWildfires">
              <h1> <b>
                <TerrainIcon /> Current Active Wildfires </b>
              </h1>
              <br />
              <div className="map">
                {/* Map with Map Markers */}
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
                      <Marker
                        position={location}
                        onClick={() => {
                          setInfoWindowID(val);
                        }}
                      >
                        {infoWindowID === val && (
                          //Info Window for when a user clicks on the center location pin
                          <InfoWindow>
                            <React.Fragment>
                              <span>Search Location: {val}</span>
                            </React.Fragment>
                          </InfoWindow>
                        )}
                      </Marker>
                    </>
                  )}
                  {/* Place fire map markers on the map */}
                  {data.map((item, index) => (
                    <Marker
                      key={index}
                      visible={true}
                      position={{
                        lat: Number(item.irwin_InitialLatitude),
                        lng: Number(item.irwin_InitialLongitude),
                      }}
                      // icon="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
                      icon={fireMarker}
                      onClick={() => {
                        setInfoWindowID(item);
                      }}
                    >
                      {infoWindowID === item && (
                        // Info Window for when a user clicks on a fire map marker
                        <InfoWindow>
                          <React.Fragment>
                            <span>Fire Name: {item.name}</span>
                            <br />
                            <span>Fire Start Date: {item.date}</span>
                            <br />
                            <span>Fire Cause: {item.cause}</span>
                            <br />
                            <span>Latitude: {item.irwin_InitialLatitude}</span>
                            <br />
                            <span>
                              Longitude: {item.irwin_InitialLongitude}
                            </span>
                          </React.Fragment>
                        </InfoWindow>
                      )}
                    </Marker>
                  ))}
                </GoogleMap>
                <br />
                {/* Active Fires Table displayed under Map */}
              <ActiveFiresTable county={countyFormatted} state={splitVals} />
              <br />
              <p className='source'>
                {' '}
                <a className='source' href="https://data-nifc.opendata.arcgis.com/datasets/nifc::wfigs-current-wildland-fire-perimeters/api">
                  {' '}
                  Data source: WFIGS – Active fires API
                  <LaunchIcon fontSize="medium" />
                </a>
              </p>
              </div>
            </div>
          </div>
          <br />
          <div className="pagebreak"> </div> {/*For page printing*/}
          <br />
  
          <div className="w3-row-padding  w3-margin-bottom ">
            <div className="currentFireStatsTable">
            <h1><b><TrendingUpIcon /> Current and Historical Wildfire Statistics</b></h1>
              <FireStatsTable
                county={countyFormatted}
                state={splitVals}
                fullName={val}
              />
            </div>
          </div>
          <br /> 
          <div className="pagebreak"> </div> {/*For page printing*/}
          <div className="w3-container w3-margin-bottom">
            <div className="airQualityGraphs">
              <h1 style={{color: 'black'}}>
                <b><AirIcon fontSize="large" /> Air Quality Historical Trends </b>
              </h1>
              <br />
              <AirQualityGraphs county={countyFormatted} state={splitVals} />
            </div>
          </div>
          <br />
          <div className="pagebreak"> </div> {/*For page printing*/}
          <div className="w3-container">
            <div className="wildfireGraphs">
              <h1 style={{color: 'black'}}>
                <b><LocalFireDepartmentIcon fontSize="large" /> Wildfire Historical
                Trends </b>
              </h1>
              <br />
              <WildFireGraphs county={countyFormatted} state={splitVals} />
            </div>
          </div>
        </div>
      </>
      <br />
      <Footer />
    </div>
  );
}
