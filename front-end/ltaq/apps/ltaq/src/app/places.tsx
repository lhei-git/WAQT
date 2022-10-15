import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
  } from "use-places-autocomplete";
  import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
  } from "@reach/combobox";
  import "@reach/combobox/styles.css";
  
  //Function setLocation that recieves a position (latlngliteral)
  type PlacesProps = {
    setLocation: (position: google.maps.LatLngLiteral) => void;
  };
  
  //Pass in the setLocation prop
  export default function Places({ setLocation }: PlacesProps) {
    const {
      ready, //boolean, is the script ready to be used?
      value, //value that the user entered into the input box
      setValue, //change THIS everytime the user types a letter
      suggestions: { status, data }, //get suggestions from Google Places.  status = whether we recieved some suggestions ok or not; data = data of those suggestions themselves
      clearSuggestions, //whenever they've selected one, we can remove the list of suggestions from the screen
    } = usePlacesAutocomplete();
  
    //Function we call when the user select the location
    //This function receives the value that the user selects as a string
    const handleSelect = async (val: string) => {
      setValue(val, false); //update the value to be what the user has selected.  we're not asking it to go and load more data, because we've chosen a selection
      clearSuggestions(); //once a user selects a location, we shouldn't show the list of suggestions to the user
  
      //convert from address string into lat/long coordinates
      const results = await getGeocode({ address: val }); //Geocode takes in an object that has a text address of whatever text the user selects
      const { lat, lng } = await getLatLng(results[0]); //getLatLng of single result (results[0]) of whatever the first result is
      setLocation({ lat, lng }); //call setLocation function that recieves a latlngLiteral
    };
  
    return (
        //Box which allows a user to search through Google Places
      <Combobox onSelect={handleSelect}>
        <ComboboxInput //text box the user types into
          value={value} //value the user has typed in
          onChange={(e) => setValue(e.target.value)} //any time a user changes the value, we have to listen to that event (onChange).  set value, target being the input itself and value being the value they typed into the text box
          disabled={!ready} //disalble this if it isn't ready to be used
          className="combobox-input"
          placeholder="Search location address" //place holder for text box
        />
        <ComboboxPopover>
            {/* list of suggestions */}
          <ComboboxList>
            {status === "OK" && //check if the status is ok.  Google telling us that we've been able to load the places correclty and you have some suggestions to work with
              data.map(({ place_id, description }) => ( //2 things that we want to extract: place_id = use as a key for all of the options we show in the list; description = description of the place itself
                <ComboboxOption key={place_id} value={description} /> //pass in the key of the place id, and give it the value of the description
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    );
  }