import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MallaCurricular from "./pages/MallaCurricular";
import Footer from "./pages/Footer";
import Header from "./pages/Header";  // Importa el Header

export default function App() {
  return (
    <div className="App">
      <Header />  {/* Asegúrate de agregar el Header aquí */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* Página principal */}
        <Route path="/malla/:carreraId" element={<MallaCurricular />} />
      </Routes>
      <Footer />
    </div>
  );
}
