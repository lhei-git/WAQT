import React from 'react';
import styles from './nav.module.css';
import * as data from './links.json';
import aboutStyle from './about.module.css';

const About = () => {
  return (
    <>
      <h1 className={aboutStyle['container']}>About</h1>
      <body className={aboutStyle['body']}>
        <br />
        <p>
          <div>
            One of the major silent killers and reducers of quality of life in
            the world today is air pollution. The European Environmental Agency
            considers air pollution “the biggest environmental health risk in
            Europe.”
            Studies indicate that in general, “air pollution is one of the most
            important reasons for serious human health effects including
            cardiovascular and respiratory illnesses” Long-term exposure of
            simply being downwind of a highway can significantly reduce life
            years3. Moreover, likely due to climate change, growing wildfires
            are exacerbating air pollution around the world.
          </div>
          <br />
          <div>
            While many applications exist to track levels of air quality, these
            applications do not enable users to select different levels of years
            and time frames to understand long-term levels of pollution and air
            quality for specific places or regions. For example, while it is
            possible to view “real-time” data of air quality measures for a
            particular place4, current web applications do not enable
            visualization of air quality trends in the previous 5 or 10 years.
            Moreover, these applications do not enable data visualization based
            on user selection of other time-frame parameters, such as weekly,
            monthly or yearly averages. Lastly, given recent and
            still-developing data for wildfires, existing applications do not
            generate statistics of frequency and extent of wildfires for
            specific regions over time.
          </div>
          <br />
          This project proposes to create a Web application that will collect,
          organize and visualize air quality and wildfires data across the
          United States, enabling users to:
          <ol
          type="1"
          className={aboutStyle['ol']}>
            <li>
              Select a specific location of interest to obtain various air
              quality and wildfire metrics.
            </li>
            <li>
              Select different year and data visualization parameters, such as
              specific chemicals to be assessed.
            </li>
            <li>
              Visualize location of air quality stations and previous wildfires
              for the selected region.
            </li>
            <li>
              Compare at least two regions for air quality and wildfire metrics.
            </li>
            <li>
              Obtain various statistical measures such as quantity of days with
              unhealthy air over time; average air quality measures; months with
              the highest number of wildfires; etc.
            </li>
            <li>
              Retrieve data from various sources, such as AQI data from the EPA,
              temperature data from NOAA and wildfires data from WFIGS.
            </li>
            </ol>
            <br />
            <div>
              This project will focus on web application development, web
              hosting, database development, data analysis and data
              visualization. Students may select language and technologies of
              choice. AWS resources may be provided for development and hosting.
              While this will be a new stand-alone application, students may
              build on a previously developed application to analyze air
              temperature data, RAFT.
            </div>
        </p>
      </body>
    </>
  );
};

export default About;
