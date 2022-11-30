import { useLoadScript } from '@react-google-maps/api';
import './app.css';
import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  useLayoutEffect,
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
import fire from './Fire Icon.jpeg';
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
  const [infoWindowID, setInfoWindowID] = useState('');
  const [markerData, setMarkerData] = useState<AxiosResponse | null>(null);

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
    if (val?.includes('County')) {
      console.log(splitVal[0].replace(' County', ''));
      countyFormatted = splitVal[0].replace(' County', '');
    } else {
      const county = localStorage.getItem('county')?.slice(0, -7);
      countyFormatted = county!.replace(/ /g, '+');
      console.log(countyFormatted);
    }

    //Grab lat and lng from local storage
    const lattitude = localStorage.getItem('lat');
    const longitude = localStorage.getItem('lng');
    lat = Number(lattitude);
    lng = Number(longitude);
    Number(lat);
    Number(lng);
    setLocation({ lat, lng });

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
    <div className="backBody">
      <>
        <div className="printable">
          <Nav />

          <h1>
            <b>
              <i className="fa fa-location-arrow"></i> {val}
            </b>
            <button className="printButton" onClick={handlePrint}>
              {<PrintIcon fontSize="large" />}
            </button>
          </h1>
          <div className="w3-row-padding  w3-margin-bottom ">
            <div className="currentAQI">
              <h2>
                <AirIcon /> Current Air Quality
              </h2>
              <br />
              <CurrentAQI lat={lat} lng={lng} />
            </div>
            <div className="pagebreak"> </div> {/*For page printing*/}
            <br />
          </div>
          <div className="w3-row-padding  w3-margin-bottom ">
            <div className="currentActiveWildfires">
              <h2>
                <TerrainIcon /> Geography
              </h2>
              <br />
              <div className="map">
                <h2>Current active fires</h2>
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
                          <InfoWindow>
                            <React.Fragment>
                              <span>Search Location: {val}</span>
                            </React.Fragment>
                          </InfoWindow>
                        )}
                      </Marker>
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
                      // icon="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
                      icon={fireMarker}
                      onClick={() => {
                        setInfoWindowID(item);
                      }}
                    >
                      {infoWindowID === item && (
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
                <p>
                  {' '}
                  <a href="https://data-nifc.opendata.arcgis.com/datasets/nifc::wfigs-current-wildland-fire-perimeters/">
                    {' '}
                    Active fires from: WFIGS <LaunchIcon fontSize="small" />
                  </a>
                </p>
              </div>
            </div>
          </div>
          <br />
          <div className="w3-row-padding  w3-margin-bottom ">
            {/* <div className="pagebreak"> </div> For page printing */}
            <div className="activeFiresTable">
              <h2>
                <LocalFireDepartmentIcon /> Current Wildfires
              </h2>
              <br />
              <h2>Active wildfires</h2>
              <ActiveFiresTable county={countyFormatted} state={splitVals} />
              <p>
                {' '}
                <a href="https://data-nifc.opendata.arcgis.com/datasets/nifc::wfigs-current-wildland-fire-perimeters/api">
                  {' '}
                  Data source: WFIGS – Active fires API
                  <LaunchIcon fontSize="medium" />
                </a>
              </p>
            </div>
          </div>
          <div className="pagebreak"> </div> {/*For page printing*/}
          <div className="pagebreak"> </div> {/*For page printing*/}
          <br />
          <div className="w3-row-padding  w3-margin-bottom ">
            <div className="currentFireStatsTable">
              <h2>
                <TrendingUpIcon /> Statistics
              </h2>
              <br />
              <h2> Current and historical fire statistics</h2>
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
              <h2>
                <AirIcon fontSize="large" /> Air Quality Historical Trends
              </h2>
              <br />
              <AirQualityGraphs county={countyFormatted} state={splitVals} />
            </div>
          </div>
          <br />
          <div className="pagebreak"> </div> {/*For page printing*/}
          <div className="w3-container">
            <div className="wildfireGraphs">
              <h2>
                <LocalFireDepartmentIcon fontSize="large" /> Wildfire Historical
                Trends
              </h2>
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
