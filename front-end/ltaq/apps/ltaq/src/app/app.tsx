import Location from './searchLocation';
import Map from './map';
import PM25Graph from './pm25'
import FireTable from './fire-info-table'
import "./app.css";

//<FireTable />
//<PM25Graph />
export var locationInfo: string[];

const App = () => {
    return (
        <>
        <Location />
        
        <FireTable />
        <Map />

        </>
    );
}

export default App;
