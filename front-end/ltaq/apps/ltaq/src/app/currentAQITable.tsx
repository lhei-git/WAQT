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

let highestAqi = -1
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
  const [isLoading, setLoading] = useState(true);
  const url = "http://localhost:8000/aqi?lat=" + lat + "&lon=" + lng;
  console.log(url)
  useEffect(() => {
    axios.get(url).then(response => {
      setData(response.data);
      setLoading(false);
      console.log(data)
    });
  }, []);

  //render all data here:
  if (isLoading) {
    return (
      <p>Loading...</p>
    )
  } else {
    data.map((item, index) => (

      (item.Category.Name == "Good" && highestAqi <= 0) ? highestAqi = 0 :
        (item.Category.Name == "Moderate" && highestAqi <= 1) ? highestAqi = 1 :
          (item.Category.Name == "Unhealthy for Sensitive Groups" && highestAqi <= 2) ? highestAqi = 2 :
            (item.Category.Name == "Unhealthy" && highestAqi <= 3) ? highestAqi = 3 :
              (item.Category.Name == "Very Unhealthy" && highestAqi <= 4) ? highestAqi = 4 :
                (item.Category.Name == "Hazardous" && highestAqi <= 5) ? highestAqi = 5 : highestAqi = highestAqi

    ))
    return (
      <>
        <div>
          <h1><i className="fa fa-sun-o" aria-hidden="true"></i> Current AQI: {
            (highestAqi == 0) ? "Good" :
              (highestAqi == 1) ? "Moderate" :
                (highestAqi == 2) ? "Unhealthy for Sensitive Groups" :
                  (highestAqi == 3) ? "Unhealthy" :
                    (highestAqi == 4) ? "Very Unhealthy" :
                      (highestAqi == 5) ? "Hazardous" : "Not Available"
          }
          <Button
            label={<sup><i className="fa fa-question-circle-o" aria-hidden="true"></i></sup>}
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
                <ModalTitle>Current AQI Information:</ModalTitle>
                <ModalCloseButton onClick={() => openModal(false)} />
              </ModalHeader>
              <ModalBody>
                <ModalContent>
                  <p>
                    {(highestAqi == 0) ? "Good AQI is 0 - 50. Air quality is considered satisfactory, and air pollution poses little or no risk." :
                      (highestAqi == 1) ? "Moderate AQI is 51 - 100. Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people. For example, people who are unusually sensitive to ozone may experience respiratory symptoms." :
                        (highestAqi == 2) ? "Unhealthy for Sensitive Groups AQI is 101 - 150. Although general public is not likely to be affected at this AQI range, people with lung disease, older adults and children are at a greater risk from exposure to ozone, whereas persons with heart and lung disease, older adults and children are at greater risk from the presence of particles in the air." :
                          (highestAqi == 3) ? "Unhealthy AQI is 151 - 200. Everyone may begin to experience some adverse health effects, and members of the sensitive groups may experience more serious effects." :
                            (highestAqi == 4) ? "Very Unhealthy AQI is 201 - 300. This would trigger a health alert signifying that everyone may experience more serious health effects." :
                              (highestAqi == 5) ? "Hazardous AQI greater than 300. This would trigger health warnings of emergency conditions. The entire population is more likely to be affected." : "Current AQI information is not available at this time."}
                  </p>
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

              </div>
            </div>
          ))
          }
        </div>


      </>
    );
  }
}

export default CurrentAQI;