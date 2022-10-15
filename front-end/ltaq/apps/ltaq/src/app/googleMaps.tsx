import { useLoadScript} from "@react-google-maps/api";
// import Map from './map2';
import Map from './searchLocation';

export default function Home() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'KEY_HERE',
        libraries: ["places"],
    });

    //If Google Map hasn't loaded, show 'Loading...' status
    if (!isLoaded) return <div>Loading...</div>

    return <Map />;
}