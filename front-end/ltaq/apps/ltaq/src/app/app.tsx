import Location from './searchLocation';
import { useLoadScript} from "@react-google-maps/api";
import "./app.css";
import Places from "./places";

//This renders the search and greeting page of our web app
const App = () => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyDGIeoq8LW_KoZl-8Bm5y_n9bGWjvI44ZQ',
        libraries: ["places"],
    });
    
    if (!isLoaded) return <div>Loading...</div>

    return (
        <>
        <Location />
        {/* <Places /> */}
        </>
    );
}

export default App;
