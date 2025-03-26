import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import mallasData from "../data/mallas.json";

export default function Home() {
  const [carreras, setCarreras] = useState([]);

  // Cargar datos del JSON
  useEffect(() => {
    const carrerasData = Object.entries(mallasData).map(([key, value]) => ({
      id: key,
      nombre: value.nombre,
      logo: value.logo
    }));
    setCarreras(carrerasData);
  }, []);

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Mallas Curriculares ESPE</h1>
      <div className="row">
        {carreras.map((carrera) => (
          <div className="col-md-4 mb-4" key={carrera.id}>
            <Link to={`/malla/${carrera.id}`}>
              <div className="card">
                <img
                  src={carrera.logo}
                  alt={carrera.nombre}
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title">{carrera.nombre}</h5>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
