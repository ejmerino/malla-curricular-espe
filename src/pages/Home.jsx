import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import mallasData from "../data/mallas.json";

// Importa las imágenes - VERIFICA LAS RUTAS, son RELATIVAS a ESTE archivo
import softwareLogo from "../assets/img/software.png";
import electronicaLogo from "../assets/img/electronica-y-automatizacion.png";

export default function Home() {
  const [carreras, setCarreras] = useState([]);

  // Mapeo de nombres de logo a imágenes importadas - VERIFICA LAS CLAVES
  const logoMap = {
    "software": softwareLogo,  // Clave: Nombre en mallas.json, Valor: Imagen importada
    "electronica-y-automatizacion": electronicaLogo, // Asegúrate de que la clave coincide con el valor "logo" en tu JSON
  };

  // Cargar datos del JSON
  useEffect(() => {
    const carrerasData = Object.entries(mallasData).map(([key, value]) => ({
      id: key,
      nombre: value.nombre,
      logo: value.logo,  // Guarda el *nombre* del logo, NO la ruta
    }));
    setCarreras(carrerasData);

    //DEBUG: Comprueba que mallasData se carga correctamente
    console.log("mallasData:", mallasData);
  }, []);

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Mallas Curriculares ESPE</h1>
      <div className="row">
        {carreras.map((carrera) => {
          // Determina la URL de la imagen basada en el nombre del logo
          const logoSrc = logoMap[carrera.logo] || null; // Usa null si no hay coincidencia

          //DEBUG: Comprueba los valores de carrera.logo y logoSrc para cada iteración
          console.log("Carrera:", carrera.nombre);
          console.log("Logo (carrera.logo):", carrera.logo);
          console.log("logoSrc:", logoSrc);

          return (
            <div className="col-md-4 mb-4" key={carrera.id}>
              <Link to={`/malla/${carrera.id}`}>
                <div className="card">
                  {logoSrc && (  // Renderiza la imagen solo si logoSrc tiene un valor
                    <img
                      src={logoSrc}
                      alt={carrera.nombre}
                      className="card-img-top"
                      style={{ maxHeight: '200px', objectFit: 'contain' }} // Ajusta la altura y el modo de ajuste
                    />
                  )}
                  {!logoSrc && <p>No Logo</p>} {/* Mensaje si no hay logo */}
                  <div className="card-body">
                    <h5 className="card-title">{carrera.nombre}</h5>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}