import React from 'react';
import styles from './nav.module.css';
import * as data from './links.json';
import aboutStyle from './about.module.css';
import ozoneValue from "./ozone.jpg"; 
import pm25Value from "./pm25.jpg"; 
import pm10Value from "./pm10.jpg"; 
import FireTable from "./fireTable.jpg"; 
import Nav from './navAbout';
import InfoIcon from '@mui/icons-material/Info';
import AirIcon from '@mui/icons-material/Air';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

// color coordinated boxes for AQI legend
const goodBoxStyle = {
  fill: 'green',
  strokeWidth: 3,
}
const moderateBoxStyle = {
  fill: 'yellow',
  strokeWidth: 3,
}
const sensistiveBoxStyle = {
  fill: 'orange',
  strokeWidth: 3,
}
const unhealthyBoxStyle = {
  fill: 'red',
  strokeWidth: 3,
}
const veryunhealthyBoxStyle = {
  fill: 'purple',
  strokeWidth: 3,
}
const hazardBoxStyle = {
  fill: 'brown',
  strokeWidth: 3,
}
const About = () => {
  return (
    <>
    <Nav/>
    <div className={aboutStyle['backBody']}>
      <body className={aboutStyle['body']}>
        <br />
              
        <div className={aboutStyle['about']}> {/*  wildfire/air quality facts & Info about the website */}
        <h1> <InfoIcon fontSize="medium" /> About WAQT </h1> {/* section heading with icon */}
          <br/> 
          {/* paragraph with clickable links for more information */}
          <p>One of the major silent killers and reducers of quality of life in
            the world today is air pollution. The European Environmental Agency
            considers air pollution <a className={aboutStyle['pageLink']} href="https://www.eea.europa.eu/themes/air/">"the biggest environmental health risk in
            Europe."</a> Studies indicate that in general, <a className={aboutStyle['pageLink']} href="https://link.springer.com/article/10.1007/s11356-020-09042-2">"air pollution is one of the most important reasons for serious human health effects including
            cardiovascular and respiratory illnesses"</a> Long-term exposure of
            simply being downwind of a highway <a className={aboutStyle['pageLink']} href="https://academic.oup.com/jeea/article/18/4/1886/5580747"> can significantly reduce life years.</a>  Moreover, likely due to climate change, growing wildfires
            are<a className={aboutStyle['pageLink']} href="https://www.preventionweb.net/files/73797_wildfiresbriefingnote.pdf"> exacerbating air pollution around the world.</a>
          </p>
          <br />

          <p>
          While many applications exist to report current levels of air pollutants, 
          these applications do not provide historical trends of pollution and air 
          quality for specific places or regions. For example, while it is possible 
          to view real-time data of air quality measures for a particular place, 
          via applications such as <a className={aboutStyle['pageLink']} href="https://www.airnow.gov"> AirNow</a> and <a className={aboutStyle['pageLink']} href="https://www.iqair.com/us/usa"> IQAir, </a> 
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
          pollutants—based on the US Air Quality Index (AQI). This information is retrieved from the <a className={aboutStyle['pageLink']} href="https://www.epa.gov/aqs">EPA</a> &  <a className={aboutStyle['pageLink']} href="https://docs.airnowapi.org">AirNow </a> 
            application programming interface (API) of the US Environmental Protection Agency (EPA).  
          </p>
          <br />

          <p>
          WAQT also retrieves the current active wildfires in the searched location from the <a className={aboutStyle['pageLink']} href="https://data-nifc.opendata.arcgis.com/">National Interagency Fire Center</a> API, 
          of the National Interagency Fire Center, and various calculations of historical wildfire data 
          for the searched location, and the entire state, from the <a className={aboutStyle['pageLink']} href="https://data-nifc.opendata.arcgis.com/datasets/nifc::wfigs-wildland-fire-locations-full-history/about">Wildland Fire Locations Full History 
          API</a> of the National Interagency Fire Center. 
          </p>
          <br />

          <p> 
          The WAQT app also produces various graphs of the historical trends of the three major pollutants 
          identified from the year 2015 until the most recent data available. This long-term air quality 
          data is pulled from the <a className={aboutStyle['pageLink']} href="https://www.epa.gov/aqs">US EPA Air Quality System (AQS).</a> 
          The application also visualizes historical trends of wildfires, including total wildfires and acres burned from 
          wildfires—when the data is available. Further details about wildfire data calculations are provided below.
          </p>
          <br /> 

          <p>
          WAQT was conceptualized by Nic DePaula, who guided the development process. WAQT was developed by 
          Ryan Kaszubski, Ahmad Aoun and Kevin Kluka during the Fall of 2022 for their senior capstone project for the <a className={aboutStyle['pageLink']} href= "https://lhei.org">Lab for Health and Environmental Informatics </a> (LHEI). 
          </p>
          <br/>
          <br/>
          </div>
         
          <div className={aboutStyle['about']}> {/* Major pollutants */}
          <h1> <AirIcon fontSize="medium" /> The Major Pollutants </h1> {/* section heading with icon */}
          <br/>

          <p>
          EPA sets national air quality standards for 6 common pollutants, 3 of which are measured 
          by WAQT given their prominence in issues of air quality:
          </p>
          <br />
          
          <ul> {/* bullet list with clickable links with info about each major pollutant */}
          <li><a className={aboutStyle['pageLink']} href="https://www.epa.gov/ground-level-ozone-pollution">Ozone (O3)</a></li>
          <li><a className={aboutStyle['pageLink']} href="https://www.epa.gov/pm-pollution">Particulate Matter 2.5 (PM 2.5)</a></li>
          <li><a className={aboutStyle['pageLink']} href="https://www.epa.gov/pm-pollution">Particulate Matter 10 (PM10)</a></li>
          </ul>
          <br />
          </div>

          <div>
          <p>
          Ozone refers to ground-level ozone. PM10 includes particles less than or equal to 10 micrometers in diameter. 
          PM2.5 includes particles less than or equal to 2.5 micrometers and is also called fine particle pollution.
          </p>
          <br />
          <br/>
          </div>

          <div className={aboutStyle['about']}> 
          <h1 id="AQI"> <AirIcon fontSize="medium" /> US Air Quality Index </h1> {/* section heading with icon */}
          <br />

          <p> 
          The US AQI provides a standard to measure pollution and categories to interpret health concern for humans. 
          Different countries have different AQI standards, however with similar pollutants and categories. 
          Measures from the US AQI are developed and interpreted as described below from the US EPA:
          </p> 
          <br />

          <div className={aboutStyle['about-table']}> 
         <table> {/* air quality index table with colored cells for users to differ levels of health concern */}
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
          </div>
          <br />
         
         <ul className={aboutStyle['aqi']}> {/* bulleted list explaining in depth health level concerns */}
          <li><strong>"Good" AQI is 0 - 50.</strong> Air quality is considered satisfactory, and air pollution poses little or no risk.</li>
          <li><strong>"Moderate" AQI is 51 - 100.</strong> Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small
          number of people. For example, people who are unusually sensitive to ozone may experience respiratory symptoms.</li>
          <li><strong>"Unhealthy for Sensitive Groups" AQI is 101 - 150.</strong> Although general public is not likely to be affected at this AQI range, people with lung disease, older adults and children are at a greater risk from exposure to ozone, whereas persons with heart and lung disease, older adults and children are at greater risk from the presence of particles in the air.</li>
          <li><strong>"Unhealthy" AQI is 151 - 200.</strong> Everyone may begin to experience some adverse health effects, and members of the sensitive groups may experience more serious effects.</li>
          <li><strong>"Very Unhealthy" AQI is 201 - 300.</strong> This would trigger a health alert signifying that everyone may experience more serious health effects.</li>
          <li><strong>"Hazardous" AQI greater than 300.</strong> This would trigger health warnings of emergency conditions. The entire population is more likely to be affected.</li>
          <br />
          </ul>
      
          <p> 
          Further information is available here: <a className={aboutStyle['pageLink']} href="https://www.epa.gov/outdoor-air-quality-data/air-data-basic-information">https://www.epa.gov/outdoor-air-quality-data/air-data-basic-information</a>
          </p>
          <br />
          <br/>
          </div>
         

          <div className={aboutStyle['about']}> 
          <h1 id="AirQualityMeasurements"> <AirIcon fontSize="medium" /> Air Quality Measures</h1> {/* section heading with icon */}
          <br />

          <p>
          Air pollutants, such as PM2.5, PM10 and Ozone, are measured via <em>micrograms per cubic meter (µg/m3)</em> or by <em>parts per million (ppm).</em> 
          Its from these measures that the US AQI categories (e.g. 0 to 50) as shown above are developed. Our analyses of long term trends in 
          air quality are provided at the original unit of measurement of the data, and therefore need to be reinterpreted in terms of “good” or
          “moderate” air quality. 
          </p>
          <br />
          <div className={aboutStyle['ozone']}> {/* creates legend displaying  ozone pollutant measurements */}
          <strong> Ozone:  </strong> {/* bold table heading */}
          <p><svg width="20" height="20"><rect width="20" height="20" style={goodBoxStyle}/></svg>{" Good (<=.054 ppm)"}</p>
          <p><svg width="20" height="20"><rect width="20" height="20" style={moderateBoxStyle}/></svg>{" Moderate (.055-.070 ppm)"}</p>
          <p><svg width="20" height="20"><rect width="20" height="20" style={sensistiveBoxStyle}/></svg>{" Unhealthy for Sensitive Groups (.071-.085 ppm)"}</p>
          <p><svg width="20" height="20"><rect width="20" height="20" style={unhealthyBoxStyle}/></svg>{" Unhealthy (.086-.105 ppm)"}</p>
          <p><svg width="20" height="20"><rect width="20" height="20" style={veryunhealthyBoxStyle}/></svg>{" Very Unhealthy (.106-.200 ppm)"}</p>
          <p><svg width="20" height="20"><rect width="20" height="20" style={hazardBoxStyle}/></svg>{" Hazardous (>=.405 ppm)"}</p>
          </div>
    
          <br/>
          <div className={aboutStyle['pm25']}> {/* creates legend displaying pm2.5 pollutant measurements */}
          <strong> PM2.5 </strong> {/* bold table heading */}
          <p><svg width="20" height="20"><rect width="20" height="20" style={goodBoxStyle}/></svg>{" Good (<= 12.0 ug/m3)"}</p>
          <p><svg width="20" height="20"><rect width="20" height="20" style={moderateBoxStyle}/></svg>{" Moderate (12.1-35.4 ug/m3"}</p>
          <p><svg width="20" height="20"><rect width="20" height="20" style={sensistiveBoxStyle}/></svg>{" Unhealthy for Sensitive Groups (35.5-55.4 ug/m3)"}</p>
          <p><svg width="20" height="20"><rect width="20" height="20" style={unhealthyBoxStyle}/></svg>{" Unhealthy (55.5-150.4 ug/m3)"}</p>
          <p><svg width="20" height="20"><rect width="20" height="20" style={veryunhealthyBoxStyle}/></svg>{" Very Unhealthy (150.5-250.4ug/m3)"}</p>
          <p><svg width="20" height="20"><rect width="20" height="20" style={hazardBoxStyle}/></svg>{" Hazardous (>=250.5 ug/m3)"}</p> 

          </div>
          <br/>
          <div className={aboutStyle['pm10']}> {/* creates legend displaying  pm10 pollutant measurements */}
          <strong> PM10 </strong> {/* bold table headoing */}
          <p><svg width="20" height="20"><rect width="20" height="20" style={goodBoxStyle}/></svg>{" Good (<=54 ug/m3)"}</p>
          <p><svg width="20" height="20"><rect width="20" height="20" style={moderateBoxStyle}/></svg>{" Moderate (55-154 ug/m3)"}</p>
          <p><svg width="20" height="20"><rect width="20" height="20" style={sensistiveBoxStyle}/></svg>{" Unhealthy for Sensitive Groups (155-254 ug/m3)"}</p>
          <p><svg width="20" height="20"><rect width="20" height="20" style={unhealthyBoxStyle}/></svg>{" Unhealthy (255-354 ug/m3)"}</p>
          <p><svg width="20" height="20"><rect width="20" height="20" style={veryunhealthyBoxStyle}/></svg>{" Very Unhealthy (355-424 ug/m3)"}</p>
          <p><svg width="20" height="20"><rect width="20" height="20" style={hazardBoxStyle}/></svg>{" Hazardous (>=425 ug/m3)"}</p>
          <br/>
          <br/>
          </div>
          </div>
         

          <div className={aboutStyle['about']}> 
          <h1> <LocalFireDepartmentIcon fontSize="medium" /> Wildfire Statistics </h1> {/* section heading with icon */}
          <p> 
          The WAQT app provides various statistical measures of current and historical wildfires, primarily calculated from the 
          Wildland Fire Locations Full History API. The calculations are performed as explained below only for incidents which have 
          the specific information available, and for the specified US county and its state. 
          </p>
          <br />   
          </div>
          <div id="statstable"> 
          <table>
          <thead>
            <tr>
              <th style={{textAlign: 'left', wordWrap: 'break-word', borderColor: 'black', borderStyle: 'solid', borderWidth: '1px', overflow: 'hidden', padding: '10px 5px'}}>Measurements</th>
              <th style={{textAlign: 'left', wordWrap: 'break-word', borderColor: 'black', borderStyle: 'solid', borderWidth: '1px', overflow: 'hidden', padding: '10px 5px'}}>Explanation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{textAlign: 'left', wordWrap: 'break-word', borderColor: 'black', borderStyle: 'solid', borderWidth: '1px', overflow: 'hidden', padding: '10px 5px'}}>Total active wildfires</td>
              <td style={{textAlign: 'left', wordWrap: 'break-word', borderColor: 'black', borderStyle: 'solid', borderWidth: '1px', overflow: 'hidden', padding: '10px 5px'}}>Count of all active wildfires</td>
            </tr>
            <tr>
              <td style={{textAlign: 'left', wordWrap: 'break-word', borderColor: 'black', borderStyle: 'solid', borderWidth: '1px', overflow: 'hidden', padding: '10px 5px'}}>Most recent fire</td>
              <td style={{textAlign: 'left', wordWrap: 'break-word', borderColor: 'black', borderStyle: 'solid', borderWidth: '1px', overflow: 'hidden', padding: '10px 5px'}}>Wildfire that has the highest discovery date currently available</td>
            </tr>
            <tr>
              <td style={{textAlign: 'left', wordWrap: 'break-word', borderColor: 'black', borderStyle: 'solid', borderWidth: '1px', overflow: 'hidden', padding: '10px 5px'}}>Oldest fire</td>
              <td style={{textAlign: 'left', wordWrap: 'break-word', borderColor: 'black', borderStyle: 'solid', borderWidth: '1px', overflow: 'hidden', padding: '10px 5px'}}>Wildfire that has the oldest discovery date</td>
            </tr>
            <tr>
              <td style={{textAlign: 'left', wordWrap: 'break-word', borderColor: 'black', borderStyle: 'solid', borderWidth: '1px', overflow: 'hidden', padding: '10px 5px'}}>Total fires in history</td>
              <td style={{textAlign: 'left', wordWrap: 'break-word', borderColor: 'black', borderStyle: 'solid', borderWidth: '1px', overflow: 'hidden', padding: '10px 5px'}}>Count of all wildfires for the location in the dataset</td>
            </tr>
            <tr>
              <td style={{textAlign: 'left', wordWrap: 'break-word', borderColor: 'black', borderStyle: 'solid', borderWidth: '1px', overflow: 'hidden', padding: '10px 5px'}}>Total fires caused by humans</td>
              <td style={{textAlign: 'left', wordWrap: 'break-word', borderColor: 'black', borderStyle: 'solid', borderWidth: '1px', overflow: 'hidden', padding: '10px 5px'}}>Count of all wildfires that were caused by humans (does not include NA or undetermined)</td>
            </tr>
            <tr>
              <td style={{textAlign: 'left', wordWrap: 'break-word', borderColor: 'black', borderStyle: 'solid', borderWidth: '1px', overflow: 'hidden', padding: '10px 5px'}}>Total fires of natural cause</td>
              <td style={{textAlign: 'left', wordWrap: 'break-word', borderColor: 'black', borderStyle: 'solid', borderWidth: '1px', overflow: 'hidden', padding: '10px 5px'}}>Count of all wildfires that were caused by natural causes (does not include NA or undetermined)</td>
            </tr>
            <tr>
              <td style={{textAlign: 'left', wordWrap: 'break-word', borderColor: 'black', borderStyle: 'solid', borderWidth: '1px', overflow: 'hidden', padding: '10px 5px'}}>Total acres burned</td>
              <td style={{textAlign: 'left', wordWrap: 'break-word', borderColor: 'black', borderStyle: 'solid', borderWidth: '1px', overflow: 'hidden', padding: '10px 5px'}}>Sum of daily acres for all wildfires</td>
            </tr>
            <tr>
              <td style={{textAlign: 'left', wordWrap: 'break-word', borderColor: 'black', borderStyle: 'solid', borderWidth: '1px', overflow: 'hidden', padding: '10px 5px'}}>Average acres burned</td>
              <td style={{textAlign: 'left', wordWrap: 'break-word', borderColor: 'black', borderStyle: 'solid', borderWidth: '1px', overflow: 'hidden', padding: '10px 5px'}}>Average daily acres burned for all wildfires that have reported acres burned</td>
            </tr>
            <tr>
              <td style={{textAlign: 'left', wordWrap: 'break-word', borderColor: 'black', borderStyle: 'solid', borderWidth: '1px', overflow: 'hidden', padding: '10px 5px'}}>Longest burning wildfire</td>
              <td style={{textAlign: 'left', wordWrap: 'break-word', borderColor: 'black', borderStyle: 'solid', borderWidth: '1px', overflow: 'hidden', padding: '10px 5px'}}>Fire that has the largest duration</td>
            </tr>
            <tr>
              <td style={{textAlign: 'left', wordWrap: 'break-word', borderColor: 'black', borderStyle: 'solid', borderWidth: '1px', overflow: 'hidden', padding: '10px 5px'}}>Average wildfire duration</td>
              <td style={{textAlign: 'left', wordWrap: 'break-word', borderColor: 'black', borderStyle: 'solid', borderWidth: '1px', overflow: 'hidden', padding: '10px 5px'}}>Average wildfire duration for all wildfires that have reported acres burned, fire out date and containment date.</td>
            </tr>
          </tbody>
          </table>
          <br />
      
          <br/>
          </div>
          <div className={aboutStyle['about']}> 
          <p>Further information about WAQT is available in our GitHub page. 
          </p>
          <br />
          <p> Images from</p> {/* displays links for image citations */}

          <a className={aboutStyle['pageLink']} style={{width: '50px', wordWrap: 'break-word'}} href="https://unsplash.com/photos/zpbzMHIe_NU"> https://unsplash.com/photos/zpbzMHIe_NU </a>
          <br/>
          <a className={aboutStyle['pageLink']} style={{width: '50px', wordWrap: 'break-word'}} href="https://www.flickr.com/photos/ingaker/51718599244/"> https://www.flickr.com/photos/ingaker/51718599244/ </a>
          <br/>
          <a className={aboutStyle['pageLink']} style={{width: '50px', wordWrap: 'break-word'}} href="https://unsplash.com/photos/KWYTn9_QKRE"> https://unsplash.com/photos/KWYTn9_QKRE </a>
          <br/>
          <a className={aboutStyle['pageLink']} style={{width: '50px', wordWrap: 'break-word'}} href="https://www.flickr.com/photos/gotovan/43845650554/"> https://www.flickr.com/photos/gotovan/43845650554/ </a>
          <br/>
          <a className={aboutStyle['pageLink']} style={{width: '50px', wordWrap: 'break-word'}} href="https://unsplash.com/photos/DwtX9mMHBJ0"> https://unsplash.com/photos/DwtX9mMHBJ0 </a>
          <br/>
          <a className={aboutStyle['pageLink']} style={{width: '50px', wordWrap: 'break-word'}} href="https://www.flickr.com/photos/kikomeinkater/26305212549/sizes/l/"> https://www.flickr.com/photos/kikomeinkater/26305212549/sizes/l/ </a>
          <br/>
          <a className={aboutStyle['pageLink']} style={{width: '50px', wordWrap: 'break-word'}} href="https://www.flickr.com/photos/cslmedia888/30677065680/sizes/k/"> https://www.flickr.com/photos/cslmedia888/30677065680/sizes/k/ </a>

          <br />
          <br />
        </div>
          
        </body>

        </div>
      

    </>
  );
};

export default About;
