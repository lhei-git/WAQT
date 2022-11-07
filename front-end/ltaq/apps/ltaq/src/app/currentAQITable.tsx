// This is the table that gathers current AQI Values
// Use this as an example for other tables
// see airnow.py for the endpoint 
import { useEffect, useRef, useState } from "react";
import styles from "./app.module.css";
import axios from "axios"
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from '@react-ui-org/react-ui';

interface Props {
  lat: number;
  lng: number;
}
//This returns a table from the wildfire API
//returns Date, Name, Acres and Cause when available
function CurrentAQI({ lat, lng }: Props) {
  if (lng < 0) {
    lng = lng * -1;
  }
  const [modal, openModal] = useState(false)
  const modalClose = useRef()
  //request to get data from your python file:
  const [data, setData] = useState<any[]>([]);
  const url = "http://localhost:8000/aqi?lat=" + lat + "&lon=" + lng;
  console.log(url)
  useEffect(() => {
    axios.get(url)
      .then((response) => setData(response.data));
  }, []);

  //render all data here:
  return (
    <>
      <div>
        <h1>Current AQI
          <Button
            label="?"
            onClick={() => openModal(true)}
            priority="outline"
          />
        </h1>
      </div>
      <div>
        {modal && (
          <Modal
            closeButton={modalClose}
            style={{
              position: 'absolute',
              border: '2px solid #000',
              backgroundColor: 'white',
              boxShadow: '2px solid black',
              height: 250,
              width: 500,
              margin: 'auto'
            }}
          >
            <ModalHeader>
              <ModalTitle>Current AQI</ModalTitle>
              <ModalCloseButton onClick={() => openModal(false)} />
            </ModalHeader>
            <ModalBody>
              <ModalContent>

                <ul>
                  {/* <li>PM2.5 describes fine inhalable particles, with diameters that are generally 2.5 micrometers and smaller.</li>
                  <li>PM10 describes inhalable particles, with diameters that are generally 10 micrometers and smaller.</li>
                  <li>Ozone is a colorless gas that can be good or bad,
                    depending on where it is. Ozone in the stratosphere
                    is good because it shields the earth from the sun’s
                    ultraviolet rays. Ozone at ground level, where we breathe,
                    is bad because it can harm human health</li> */}
                  <li>Good (0-50): No concern</li>
                  <li>Moderate (51-100): Some people who may be unusually sensitive to ozone, everyone else has no concern.</li>
                  <li>Unhealthy for Sensitive Groups (101-150): Sensitive groups include
                    people with lung disease
                    such as asthma, older adults,
                    children and teenagers, and
                    people who are active outdoors. </li>
                  <li>Unhealthy (151 - 200) Reduce prolonged or heavy outdoor exertion. Take more breaks, do less intense activities. Schedule
                    outdoor activities in the morning when ozone is lower.  </li>
                  <li>Very Unhealthy (201 - 300) Avoid prolonged or heavy outdoor exertion.
                    Schedule outdoor activities in the morning when ozone is
                    lower. Consider moving activities indoors. Sensitive groups should avoid all activity outdoors.</li>
                  <li>Hazardous (301+) Everyone should avoid all activity outdoors</li>
                </ul>


              </ModalContent>
            </ModalBody>
            <ModalFooter>
              <Button
                label="Close"
                onClick={() => openModal(false)}
                priority="outline"
                ref={modalClose}
              />
            </ModalFooter>
          </Modal>
        )}
      </div>
      <div>

        {data.map((item, index) => (
          <div className="w3-quarter w3-margin-right	">
            <div className="w3-container" style={{
              backgroundColor: (item.Category.Name == "Good") ? 'green' : (item.Category.Name == "Moderate" ? 'yellow' : 'red'),
              color: (item.Category.Name == "Good") ? 'white' : (item.Category.Name == "Moderate" ? 'black' : 'white'),
            }}>
              <div className="w3-left"><h1>{item.ParameterName}</h1></div>
              <div className="w3-center">
                <h1>{item.AQI}</h1>
              </div>
              <div className="w3-clear"></div>
              <h2>{item.Category.Name}</h2>
            </div>
          </div>
        ))
        }
      </div>


    </>
  );
}

export default CurrentAQI;