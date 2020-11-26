import React, { useState } from "react";
import Axios from "axios";
import "./App.css";
import Config from "./constants";

function App() {
  const [testState, setTestState] = useState(false);

  const test = () => {
    setTestState(!testState);
    Axios.put(`${Config.base_url}hue/light`, {
      id: 1,
      state: { on: testState },
    });
  };

  return (
    <div className="App">
      <h1>Alfred</h1>
      <button onClick={test}>Turn {testState ? "Off" : "On"} Light</button>
    </div>
  );
}

export default App;
