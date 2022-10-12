import { useLoadScript} from "@react-google-maps/api";
import Map from './map2';

export default function Home() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyDGIeoq8LW_KoZl-8Bm5y_n9bGWjvI44ZQ',
        libraries: ["places"],
    });

    //If Google Map hasn't loaded, show 'Loading...' status
    if (!isLoaded) return <div>Loading...</div>

    return <Map />;
}