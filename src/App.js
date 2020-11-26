import React, { useEffect, useState } from "react";
import Axios from "axios";
import "./App.css";
import Config from "./constants";

import Amplify, { PubSub } from "aws-amplify";
import { AWSIoTProvider } from "@aws-amplify/pubsub";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";

function App() {
  const [lightState, setLightState] = useState(false);
  const [lightBri, setLightBri] = useState(254);

  useEffect(() => {
    // Apply plugin with configuration
    Amplify.addPluggable(
      new AWSIoTProvider({
        aws_pubsub_region: "eu-west-1",
        aws_pubsub_endpoint:
          "wss://xxxxxxxxxxxxx.iot.<YOUR-IOT-REGION>.amazonaws.com/mqtt",
      })
    );
  }, []);

  const changeLightState = () => {
    setLightState(!lightState);
    Axios.put(`${Config.base_url}hue/light`, [
      {
        id: 1,
        state: { on: lightState },
      },
      {
        id: 2,
        state: { on: lightState },
      },
    ]);
  };

  const updateLightBrightness = () => {
    if (lightBri < 1) {
      Axios.put(`${Config.base_url}hue/light`, [
        {
          id: 1,
          state: { on: false },
        },
        {
          id: 2,
          state: { on: false },
        },
      ]);
      return;
    }
    setLightState(true);
    Axios.put(`${Config.base_url}hue/light`, [
      {
        id: 1,
        state: { on: true, bri: Number(lightBri) },
      },
      {
        id: 2,
        state: { on: true, bri: Number(lightBri) },
      },
    ]);
  };

  return (
    <div className="App">
      <AmplifySignOut />
      <h1>Alfred Test</h1>
      <p>This will control the bedroom lights</p>
      <button onClick={changeLightState}>
        Turn {!lightState ? "Off" : "On"} All Bedroom Lights
      </button>
      <input
        type="range"
        min={0}
        max={254}
        value={lightBri}
        onChange={(e) => {
          setLightBri(e.currentTarget.value);
        }}
        onMouseUp={updateLightBrightness}
        onKeyUp={updateLightBrightness}
      />
    </div>
  );
}

export default withAuthenticator(App);
