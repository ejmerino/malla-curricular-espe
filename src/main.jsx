import "bootstrap/dist/css/bootstrap.min.css";
import './App.css'; // Asegúrate que esté después de Bootstrap
import { BrowserRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from './pages/themeContext'; // Importa el ThemeProvider
import App from "./App";
// Importa el ThemeProvider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Aquí agregamos el `basename` para que funcione correctamente en GitHub Pages */}
    <BrowserRouter basename="/malla-curricular-espe">
      <ThemeProvider> {/* Envuelve la aplicación con el ThemeProvider */}
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);