import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/global.css";

console.log("main.jsx: Execution started");
const rootElement = document.getElementById("root");
console.log("main.jsx: rootElement found:", !!rootElement);

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  console.log("main.jsx: Rendering App...");
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.error("main.jsx: #root element not found!");
}
