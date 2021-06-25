import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Pomodoro from "./Pomodoro";

ReactDOM.render(
  <div className="bg-gray-300 dark:bg-gray-900 w-full h-screen flex justify-center items-center font-sans">
    <Pomodoro />
  </div>,
  document.getElementById("root")
);
