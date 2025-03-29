import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import { HashRouter } from "react-router-dom"; // <-- Usa HashRouter
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from './pages/themeContext';
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter> {/* <-- Cambia BrowserRouter por HashRouter */}
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
);
