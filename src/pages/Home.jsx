import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import mallasData from "../data/mallas.json";

// Importa las imágenes
import softwareLogo from "../assets/img/software.png";
import electronicaLogo from "../assets/img/electronica-y-automatizacion.png";
import civilLogo from "../assets/img/civil.png";
import itinLogo from "../assets/img/itin.png";

// Importar el CSS modular
import styles from './Home.module.css';

export default function Home() {
  const [carreras, setCarreras] = useState([]);

  const logoMap = {
    "software": softwareLogo,
    "electronica-y-automatizacion": electronicaLogo,
    "civil": civilLogo,
    "itin": itinLogo,
  };

  useEffect(() => {
    const carrerasData = Object.entries(mallasData).map(([key, value]) => ({
      id: key,
      nombre: value.nombre,
      logo: value.logo,
    }));
    setCarreras(carrerasData);

    console.log("mallasData:", mallasData);
  }, []);

  return (
    <div className={styles.container}>
      <div className="row">
        {carreras.map((carrera) => {
          const logoSrc = logoMap[carrera.logo] || null;

          return (
            <div className="col-md-4 mb-4" key={carrera.id}>
              <Link to={`/malla/${carrera.id}`}>
                <div className={styles.card}>
                  {logoSrc && (
                    <img
                      src={logoSrc}
                      alt={carrera.nombre}
                      className={styles.cardImgTop}
                    />
                  )}
                  {!logoSrc && <p>No Logo</p>}
                  <div className={styles.cardBody}>
                    <h5 className={styles.cardTitle}>{carrera.nombre}</h5>
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
