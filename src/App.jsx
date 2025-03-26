import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MallaCurricular from "./pages/MallaCurricular";
import Footer from "./pages/Footer"; // Importamos el Footer

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/malla/:carreraId" element={<MallaCurricular />} />
      </Routes>
      
      <Footer /> {/* Aquí insertamos el Footer para que se muestre en todas las páginas */}
    </div>
  );
}
