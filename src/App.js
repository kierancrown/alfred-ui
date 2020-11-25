import React, { useState } from "react";
import Axios from "axios";
import "./App.css";

function App() {
  const [testState, setTestState] = useState(false);

  const test = () => {
    setTestState(!testState);
    Axios.put(
      "/hue/light",
      JSON.stringify({ id: 1, state: { on: testState } })
    );
  };

  return (
    <div className="App">
      <h1>Alfred</h1>
      <button onClick={test}>Turn {testState ? "Off" : "On"} Light</button>
    </div>
  );
}

export default App;
