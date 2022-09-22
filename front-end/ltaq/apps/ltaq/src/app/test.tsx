export function getAirNowData() {
    let data  = ''
    //grab data from our api
    fetch('localhost:8000/pm25?startDate=2022-09-17T16&endDate=2022-09-17T17&bbox=-83.553673,42.029418,-82.871707,42.451216').then(function(response) {
       return response.json();
     }).then(function(myJson) {
        data=myJson
        //console.log(data)
     });
    //parse thru the response
    return (
      <p>{data}</p>  
    );
}

export default getAirNowData;