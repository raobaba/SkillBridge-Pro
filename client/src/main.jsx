import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "./style/index.css";
import "./style/icons.css";
import "./style/ui-controls.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastContainer hideProgressBar={true} position='top-right' />
    <App />
  </StrictMode>
);
