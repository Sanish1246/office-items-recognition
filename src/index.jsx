import React from "react";
import { createRoot } from "react-dom/client";
import Detector from "./Detector";
import "./style/index.css";
import "./style/Detector.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Detector />
  </React.StrictMode>
);
