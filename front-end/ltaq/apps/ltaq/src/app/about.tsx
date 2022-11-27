import React from 'react';
import styles from './nav.module.css';
import * as data from './links.json';
import aboutStyle from './about.module.css';
import TwitterIcon from '@mui/icons-material/Twitter';
//import Nav from './navAbout';

const About = () => {
  return (
    <>
    <div className={aboutStyle['backBody']}>
      <h2 className={aboutStyle['title']}></h2>
      <body className={aboutStyle['body']}>
        <br />
        <p>
          <div>
          <h1>About WAQT</h1>
          <br/>
          <p>One of the major silent killers and reducers of quality of life in
            the world today is air pollution. The European Environmental Agency
            considers air pollution <a href="https://www.eea.europa.eu/themes/air/">"the biggest environmental health risk in
            Europe."</a> Studies indicate that in general, <a href="https://link.springer.com/article/10.1007/s11356-020-09042-2">"air pollution is one of the most important reasons for serious human health effects including
            cardiovascular and respiratory illnesses"</a> Long-term exposure of
            simply being downwind of a highway <a href="https://academic.oup.com/jeea/article/18/4/1886/5580747"> can significantly reduce life years.</a>  Moreover, likely due to climate change, growing wildfires
            are<a href="https://www.preventionweb.net/files/73797_wildfiresbriefingnote.pdf"> exacerbating air pollution around the world.</a>
          </p>
          <br />
          <p>
          While many applications exist to report current levels of air pollutants, 
          these applications do not provide historical trends of pollution and air 
          quality for specific places or regions. For example, while it is possible 
          to view real-time data of air quality measures for a particular place, 
          via applications such as <a href="https://www.airnow.gov"> AirNow</a> and <a href="https://www.iqair.com/us/usa"> IQAir, </a> 
          current web applications do 
          not enable visualization of air quality trends in the previous 5 or 7 years.
          </p>
          <br />
          <p>Although wildfires have become a serious concern, particularly in the United States 
          (US), where wildfire burned 4 million acres in 2020 in California. However, few current 
          applications exist to visualize current active wildfires and historic information about 
          wildfires in the US.
          </p>
          <br />
          <p>
          The Wildfire & Air Quality Tracker (WAQT) app was developed to provide citizens, scientists, 
          policy makers and the public alike the ability to easily search for air quality and wildfire 
          information for a particular county of interest (currently in the US only). WAQT provides a 
          location’s current air quality measures for Ozone, PM2.5 and PM10—some of the most common air 
          pollutants—based on the US Air Quality Index (AQI). This information is retrieved from the [XYZ] 
          application programming interface (API) of the US Environmental Protection Agency (EPA).  
          </p>
          <br />
          <p>
          WAQT also retrieves the current active wildfires in the searched location from the [XYZ] API, 
          of the National Interagency Fire Center, and various calculations of historical wildfire data 
          for the searched location, and the entire state, from the <a href="https://data-nifc.opendata.arcgis.com/datasets/nifc::wfigs-wildland-fire-locations-full-history/about">Wildland Fire Locations Full History 
          API</a> of the National Interagency Fire Center. 
          </p>
          <br />
          <p> 
          The WAQT app also produces various graphs of the historical trends of the three major pollutants 
          identified from the year 2015 until the most recent data available. This long-term air quality 
          data is pulled from the <a href="https://www.epa.gov/aqs">US EPA Air Quality System (AQS).</a> 
          The application also visualizes historical trends of wildfires, including total wildfires and acres burned from 
          wildfires—when the data is available. Further details about wildfire data calculations are provided below.
          </p>
          <br /> 
          <p>
          WAQT was conceptualized by Nic DePaula, who guided the development process. WAQT was developed by 
          Ryan Kaszubski, Ahmad Aoun and Kevin Kluka during the Fall of 2022 for their senior capstone project. 
          </p>
          <br/>
          </div>

          
          <div>
          <h1>The Major Pollutants</h1>
          <br/>
          <p>
          EPA sets national air quality standards for 6 common pollutants, 3 of which are measured 
          by WAQT given their prominence in issues of air quality:
          </p>
          <br />
          <ul>
          <li><a href="https://www.epa.gov/ground-level-ozone-pollution">Ozone (O3)</a></li>
          <li><a href="https://www.epa.gov/pm-pollution">Particulate Matter 2.5 (PM 2.5)</a></li>
          <li><a href="https://www.epa.gov/pm-pollution">Particulate Matter 10 (PM10)</a></li>
          </ul>
          <br />
          </div>
          <div>
          <h2>
          Ozone refers to ground-level ozone. PM10 includes particles less than or equal to 10 micrometers in diameter. 
          PM2.5 includes particles less than or equal to 2.5 micrometers and is also called fine particle pollution.
          </h2>
          <br />
          </div>

          <div>
          <h1>US Air Quality Index </h1>
          <br />
          <p> 
          The US AQI provides a standard to measure pollution and categories to interpret health concern for humans. 
          Different countries have different AQI standards, however with similar pollutants and categories. 
          Measures from the US AQI are developed and interpreted as described below from the US EPA:
          </p> 
          <br />
          <table>
          <tr>
          <th>Air Quality Index (AQI) Values</th>
          <th>Levels of Health Concern</th>
          </tr>
          <tr>
          <td> When the AQI is in this range:</td>
          <td>...air quality conditions are:</td>
          </tr>
          <tr>
          <td>0 to 50</td>
          <td>Good</td>
          </tr>
          <tr>
          <td>51 to 100</td>
          <td>Moderate</td>
          </tr>
          <tr>
          <td>101 to 150</td>
          <td>Unhealthy for Sensitive Groups</td>
          </tr>
          <tr>
          <td>151 to 200</td>
          <td>Unhealthy</td>
         </tr>
         <tr>
          <td>201 to 300</td>
          <td>Very Unhealthy</td>
          </tr>
          <tr>
          <td>301 to 500</td>
          <td>Hazardous</td>
          </tr>
          </table>
          <br />
          <li><strong>"Good" AQI is 0 - 50.</strong> Air quality is considered satisfactory, and air pollution poses little or no risk.</li>
          <li><strong>"Moderate" AQI is 51 - 100.</strong> Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small
          number of people. For example, people who are unusually sensitive to ozone may experience respiratory symptoms.</li>
          <li><strong>"Unhealthy for Sensitive Groups" AQI is 101 - 150.</strong> Although general public is not likely to be affected at this AQI range, people with lung disease, older adults and children are at a greater risk from exposure to ozone, whereas persons with heart and lung disease, older adults and children are at greater risk from the presence of particles in the air.</li>
          <li><strong>"Unhealthy" AQI is 151 - 200.</strong> Everyone may begin to experience some adverse health effects, and members of the sensitive groups may experience more serious effects.</li>
          <li><strong>"Very Unhealthy" AQI is 201 - 300.</strong> This would trigger a health alert signifying that everyone may experience more serious health effects.</li>
          <li><strong>"Hazardous" AQI greater than 300.</strong> This would trigger health warnings of emergency conditions. The entire population is more likely to be affected.</li>
          <br />
          <p> 
          Further information is available here: <a href="https://www.epa.gov/outdoor-air-quality-data/air-data-basic-information">https://www.epa.gov/outdoor-air-quality-data/air-data-basic-information</a>
          </p>
          <br />
          </div>

          <div>
          <h1> Air Quality Measures</h1>
          <br />
          <p>
          Air pollutants, such as PM2.5, PM10 and Ozone, are measured via <em>micrograms per cubic meter (µg/m3)</em> or by <em>parts per million (ppm).</em> 
          Its from these measures that the US AQI categories (e.g. 0 to 50) as shown above are developed. Our analyses of long term trends in 
          air quality are provided at the original unit of measurement of the data, and therefore need to be reinterpreted in terms of “good” or
          “moderate” air quality. 
          </p>
          <br />
          <p>Ozone: </p>
          <img src="ozone.jpg"/>
          <br />
          <p>PM2.5: </p>
          <img src="pm25.jpg"/>
          <br />
          <p>PM10: </p>
          <img src="pm10.jpg"/>
          <br />
          </div>


          <div>
          <h1> Wildfire Statistics</h1>
          <p> 
          The WAQT app provides various statistical measures of current and historical wildfires, primarily calculated from the 
          Wildland Fire Locations Full History API. The calculations are performed as explained below only for incidents which have 
          the specific information available, and for the specified US county and its state. 
          </p>
          <br />
          <img src="./app/FireTable.jpg"></img>
          <br />
          </div>
          <br/>
          <p>Further information about WAQT is available in our GitHub page. 
          </p>
          <br />

        </p>
        </body>
      </div>
    </>
  );
};

export default About;