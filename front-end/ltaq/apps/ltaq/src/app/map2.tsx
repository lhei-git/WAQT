import { useState, useMemo, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
} from "@react-google-maps/api";
import Places from "./places";


//Typescript variables
type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;

export default function Map() {
  const [location, setLocation] = useState<LatLngLiteral>(); //Literal object containing Lat and Long
  const mapRef = useRef<GoogleMap>(); //mapRef is an instance of GoogleMap
  //useMemo Hook: generate this value once, and reuse that value, unless one of these dependencies change.  Second argument []
  const center = useMemo<LatLngLiteral>(
    () => ({ lat: 43.45, lng: -80.49 }),
    []
  );
  //Google Map Render Options
  const options = useMemo<MapOptions>(
    () => ({
      mapId: "b181cac70f27f5e6", //map styling
      disableDefaultUI: false,
      clickableIcons: true,
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: true,
      fullscreenControl: true
    }),
    []
  );
  const onLoad = useCallback((map) => (mapRef.current = map), []); //recieves an instance of the map.  accesses the current map and assigns it to map

  return (
    //container css for map
    <div className="container">
      {/* Google places search */}
      <div className="controls">
        <h1>WAQ</h1>
        <Places
          //Pass in setLocation which updates a state called 'position', which stores the lat and lon of the location they selected.  receives a position/location
          setLocation={(position) => {
            setLocation(position); //position calls the setLocation function.  Set position into the setLocation state
            mapRef.current?.panTo(position); //start at the current location if available, but move/pan to the map location 'position' if not
          }}
        />
        {!location && <p>Enter a Location</p>}
        {/* {directions && <Distance leg={directions.routes[0].legs[0]} />} */}
      </div>
      {/* Map CSS */}
      <div className="map">
        <GoogleMap
          zoom={10} //Level of Zoom when user first loads the page
          center={center}
          mapContainerClassName="map-container" //Map CSS
          options={options} //Google Map render options
          onLoad={onLoad} //upon loading, call the onLoad function
        >
          {/* If there is an office, then pass in the location, which is a latlngliteral, to place a marker on the location */}
          {location && (
            <>
              <Marker
                position={location}
                // icon="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
              />

              {/* Clusters fires together */}
              {/* <MarkerClusterer> */}
                {/* Pass in a function clusterer() that when called, will recieve an instance of the clusterer itself */}
                {/* {(clusterer) => */}
                  {/* // Returns all of the fires to render out
              //     fires.map((fire) => (
              //       <Marker */}
              {/* //         key={fire.lat}
              //         position={fire}
              //         clusterer={clusterer}
              //         onClick={() => { */}
              {/* //           fetchDirections(fire);
              //         }}
              //       />
              //     ))
              //   }
              // </MarkerClusterer> */}

              {/* <Circle center={location} radius={15000} options={closeOptions} />
              <Circle center={location} radius={30000} options={middleOptions} />
              <Circle center={location} radius={45000} options={farOptions} /> */}
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

//Displaying circles
// const defaultOptions = {
//   strokeOpacity: 0.5,
//   strokeWeight: 2,
//   clickable: false,
//   draggable: false,
//   editable: false,
//   visible: true,
// };
// const closeOptions = {
//   ...defaultOptions,
//   zIndex: 3,
//   fillOpacity: 0.05,
//   strokeColor: "#8BC34A",
//   fillColor: "#8BC34A",
// };
// const middleOptions = {
//   ...defaultOptions,
//   zIndex: 2,
//   fillOpacity: 0.05,
//   strokeColor: "#FBC02D",
//   fillColor: "#FBC02D",
// };
// const farOptions = {
//   ...defaultOptions,
//   zIndex: 1,
//   fillOpacity: 0.05,
//   strokeColor: "#FF5252",
//   fillColor: "#FF5252",
// };

//Generate fires to display on the map
// const generateFire = (position: LatLngLiteral) => {
//   const _fires: Array<LatLngLiteral> = [];
//   for (let i = 0; i < 100; i++) {
//     const direction = Math.random() < 0.5 ? -2 : 2;
//     _fires.push({
//       lat: position.lat + Math.random() / direction,
//       lng: position.lng + Math.random() / direction,
//     });
//   }
//   return _fires;
// };