import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Aquí agregamos el `basename` para que funcione correctamente en GitHub Pages */}
    <BrowserRouter basename="/malla-curricular-espe">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
