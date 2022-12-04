import { useLoadScript } from '@react-google-maps/api';
import './app.css';
import HOME from './home';
import ABOUT from './about';
import Nav from './navHome';
import Footer from './footer'


//This renders the search and greeting page of our web app
const App = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDGIeoq8LW_KoZl-8Bm5y_n9bGWjvI44ZQ',
    libraries: ['places'],
  });

  if (!isLoaded) return <div>Loading...</div>;
  let Component;
  switch (window.location.pathname) {
    case '/':
      Component = HOME;
      break;
    case '/home':
      Component = HOME;
      break;
    case '/about':
      Component = ABOUT;
      break;
  }

  return (
    <>
      {/* <Location /> */}
      <Component />
      {/* <Nav /> */}
      {/* <HOME /> */}
      {/* <Places /> */}
      <Footer/>
    </>
  );
};

export default App;
