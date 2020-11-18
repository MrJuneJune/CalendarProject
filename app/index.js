import React from "react";
import { render } from "react-dom";
import App from "./components/App";


document.addEventListener("DOMContentLoaded", () => {
  //rendering App component in a div element, which is appended to the body.
  render(
    <App />,
    document.getElementById("app")
  );
});