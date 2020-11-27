import React, { useEffect, useState } from "react";
import Axios from "axios";
import "./App.css";
import Config from "./constants";

import Amplify, { PubSub } from "aws-amplify";
import { AWSIoTProvider } from "@aws-amplify/pubsub";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import * as internalIp from "internal-ip";

function App() {
  const [lightState, setLightState] = useState(false);
  const [lightBri, setLightBri] = useState(254);

  useEffect(() => {
    // Apply plugin with configuration
    Amplify.addPluggable(
      new AWSIoTProvider({
        aws_pubsub_region: "eu-west-1",
        aws_pubsub_endpoint:
          "wss://a2n6zesp9ud7lr-ats.iot.eu-west-1.amazonaws.com/mqtt",
      })
    );

    PubSub.subscribe("helloWorldReply").subscribe({
      next: (data) => console.log("Message received", data),
      error: (error) => console.error(error),
      close: () => console.log("Done"),
    });
    PubSub.subscribe("changeLightsReply").subscribe({
      next: (data) => console.log("Message received", data),
      error: (error) => console.error(error),
      close: () => console.log("Done"),
    });
  }, []);

  const sendHelloWorld = async () => {
    await PubSub.publish("changeLights", { msg: "Hello to all subscribers!" });
  };

  const changeLightState = async () => {
    setLightState(!lightState);
    console.log(await internalIp.v4());
    if ((await internalIp.v4()) !== "192.168.10.95") {
      console.log("Remote");
      //Remote
      await PubSub.publish("changeLights", [
        {
          id: 1,
          state: { on: lightState },
        },
        {
          id: 2,
          state: { on: lightState },
        },
      ]);
    } else {
      console.log("Local");
      //Localhost
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
    }
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
      <button onClick={sendHelloWorld}>IOT TEST</button>
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
