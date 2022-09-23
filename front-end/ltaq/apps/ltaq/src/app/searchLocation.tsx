import React from 'react';
import { useState } from 'react';
import './app.css';

const [selectedOption, setSelectedOption] = useState<String>();

class Location extends React.Component<{}, { value: string }> {

  constructor(props: {} | Readonly<{}>) {

    super(props);
    this.state = {
      value: 'location',
    };

    this.locationChange = this.locationChange.bind(this); //User entered location handler
    this.handleSubmit = this.handleSubmit.bind(this); //submit button handler
  }

  //Form Events
  locationChange(event: { target: { value: any } }) {
    localStorage.setItem("location", JSON.stringify({ value: event.target.value })); //Save user input in localStorage variable "location"
    this.setState({ value: event.target.value });
  }

  handleSubmit(event: { preventDefault: () => void }) {
    // alert('Location Entered: ' + this.state.value);
    // alert('Location Entered: ' + localStorage.getItem('location'));
    console.log(JSON.stringify(localStorage.getItem("location"))) //Get and pring localStorage varabile "location" and print to console.log
    event.preventDefault();
  }

  // This function is triggered when the select changes
  placeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedOption(value);
  };
  
  override render() {
    
    return (
      <>
        <div>
          {/* <h1 className = "form-box h1">
        Enter Location
      </h1> */}

          <form onSubmit={this.handleSubmit}>
            <label>
              Location:
              {/* <textarea
                value={this.state.value}
                onChange={this.locationChange}
              /> */}
              <input
                type="text"
                // name="note"
                value={this.state.value}
                // onChange={this.locationChange}
                onChange={this.locationChange}
              />
            </label>
            <select onChange={this.placeChange}>
              <option value="grapefruit">City</option>
              <option value="lime">State</option>
              <option selected value="coconut">
                County
              </option>
              <option value="mango">Zip Code</option>
            </select>
            <input type="submit" value="Submit" />
          </form>
        </div>
      </>
    );
  }
}

export default Location;
