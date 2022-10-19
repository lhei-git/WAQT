import { useLoadScript } from '@react-google-maps/api';
import './app.css';
import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, Circle, MarkerClusterer } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

//Grab lat and lng from local storage
const lattitude = localStorage.getItem('lat');
const longitude = localStorage.getItem('lng');

//Typescript variables
type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;

export default function App() {
  //This renders the search and greeting page of our web app
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
  const [location, setLocation] = useState<LatLngLiteral>(); //Literal object containing Lat and Long
  const [isInitialRender, setIsInitialRender] = useState(true);
    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
      if (isInitialRender) {
        setIsInitialRender(false);
      const lat = Number(lattitude);
      const lng = Number(longitude);
      Number(lat);
      Number(lng);
      setLocation({ lat, lng });
      }
      // setLocation((l) => ({ lat, lng }));
    }, [location, isInitialRender]);

  if (!isLoaded) return <div>Loading...</div>;
  console.log(location);
  return (
    <>
      <div>
        <h2>Lattitude: {lattitude}</h2>
        <h2>Longitude: {longitude}</h2>
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
              <Marker
                position={location}
              />
            </>
          )}
        </GoogleMap>
      </div>
    </>
  );
};
