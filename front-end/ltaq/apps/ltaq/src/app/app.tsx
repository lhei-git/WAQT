import Location from './searchLocation';
import CurrentAQI from './currentAQITable';
import PM25 from './pm25Graph'
import PM10 from './pm10Graph'
import Ozone from './ozoneGraph'
import Top10PM25 from './top10PM25Graph';
import "./app.css";

//This renders the search and greeting page of our web app
const App = () => {
    return (
        <>
        <CurrentAQI />
        <PM25 />
        <PM10 />
        <Ozone />
        <Top10PM25 />
        </>
    );
}

export default App;
