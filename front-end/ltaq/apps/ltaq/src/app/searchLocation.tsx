import React, { useState } from 'react';
import './App.css';

function searchLocation() {

  //Array to hold user input 'location' and 'locationType'
  const [state, setState] = useState({
    location: '',
    locationType: '',
  });

  //Any time a chage is made to X variable 'name', update the state array with the 'value'
  const handleChange = (e: { target: { name: any; value: any } }) => {
    setState({
      ...state, //Spread syntax, allowing multiple arguments because 'state' is an array
      [e.target.name]: e.target.value,
    });
  };

  //Called when user hits 'submit' button
  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    //Store state array in local storage and print to console
    localStorage.setItem("LocationInfo", JSON.stringify(state));
    console.log(state.location);
    console.log(state.locationType);
    }

  return (
    <div>
      <h1>Wildfire Air Quality (WAQ)</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Location:{' '}
          <input
            type="text"
            name="location"
            value={state.location}
            onChange={handleChange}
          />
        </label>{' '}
        <label>
          <select
            name="locationType"
            value={state.locationType}
            onChange={handleChange}>
            <option value="Default"></option>
            <option value="City">City</option>
            <option value="State">State</option>
            <option selected value="County">County</option>
            <option value="Zip Code">Zip Code</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
      <h5>Location: {state.location}</h5>
      <h5>Type: {state.locationType}</h5>
    </div>
  );
}

export default searchLocation;
