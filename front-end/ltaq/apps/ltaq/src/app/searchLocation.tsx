import { useState } from 'react';

function Location() {
  const [name, setName] = useState(''); //useState is a Hook that lets you add React state to function components
  const [showName, setShowName] = useState(false);
  
  function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault(); //method of the Event interface tells the user agent that if the event does not get explicitly handled, its default action should not be taken as it normally would be.
    setShowName(true); //Determines whether to show or hide the object body.
    sessionStorage.setItem("gLocation", name); //Set global variable gLocation to be passed throughout app
  }
    
  return (
    <div className="Location">
      <form>
        <label>Location:</label>
        <input name="location" value={name} 
          onChange={(e) => setName(e.target.value)}/>
        <button onClick={handleSubmit} type="submit">
          Submit
        </button>
      </form>
      {/* Checks the condition if showName is 
      true, which will be true only if 
      we click on the submit button */}
      {showName === true && 
      <p>Location: {name}</p>}
    </div>
  );
}

export default Location;

