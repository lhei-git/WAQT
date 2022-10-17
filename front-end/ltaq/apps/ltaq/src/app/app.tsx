import Location from './searchLocation';
import { useLoadScript} from "@react-google-maps/api";
import "./app.css";
import Places from "./places";
import MAP2 from './map2';

//This renders the search and greeting page of our web app
const App = () => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'KEY_HERE',
        libraries: ["places"],
    });
    
    if (!isLoaded) return <div>Loading...</div>

    return (
        <>
        {/* <Location /> */}
        <MAP2 />
        {/* <Places /> */}
        </>
    );
}

export default App;
