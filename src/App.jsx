// App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MallaCurricular from "./pages/MallaCurricular";
import Footer from "./pages/Footer";
import Header from "./pages/Header";
import { useTheme } from "./pages/themeContext";
import { useEffect } from "react"; // Importa useEffect

export default function App() {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/malla/:carreraId" element={<MallaCurricular />} />
      </Routes>
      <Footer />
    </div>
  );
}