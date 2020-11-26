import React from "react";

function ReactIsInDevelomentMode() {
  return "_self" in React.createElement("div");
}

const config = {
  base_url: ReactIsInDevelomentMode() ? "http://alfred/" : "/",
};

export default config;
