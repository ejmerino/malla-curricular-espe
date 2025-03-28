import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import mallasData from "../data/mallas.json";

// Importa las imágenes
import softwareLogo from "../assets/img/software.png";
import electronicaLogo from "../assets/img/electronica-y-automatizacion.png";
import civilLogo from "../assets/img/civil.png";
import itinLogo from "../assets/img/itin.png";
import geoespacialLogo from "../assets/img/geoespacial.png";
import biotecnologiaLogo from "../assets/img/biotecnologia.png";
import agropecuariaLogo from "../assets/img/agropecuaria.png";
import administracionDeEmpresasLogo from "../assets/img/administracion-de-empresas.png";
import comexLogo from "../assets/img/comex.png";
import contabilidadLogo from "../assets/img/contabilidad-y-auditoria.png";
import mercadotecniaLogo from "../assets/img/mercadotecnia.png";
import turismoLogo from "../assets/img/turismo.png";
import educacionInicialLogo from "../assets/img/educacion_inicial.png";
import mecanicaLogo from "../assets/img/mecanica.png";
import mecatronicaLogo  from "../assets/img/mecatronica.png";
import telecomunicacionesLogo from "../assets/img/telecomunicaciones.png";
import { useTheme } from '../pages/themeContext';

// Importar el CSS modular
import styles from './Home.module.css';

export default function Home() {
  const [carreras, setCarreras] = useState([]);
  const { isDarkMode } = useTheme();

  const logoMap = {
    "software": softwareLogo,
    "itin": itinLogo,
    "electronica-y-automatizacion": electronicaLogo,
    "civil": civilLogo,
    "geoespacial": geoespacialLogo,
    "biotecnologia": biotecnologiaLogo,
    "agropecuaria": agropecuariaLogo,
    "administracion-de-empresas": administracionDeEmpresasLogo,
    "comex": comexLogo,
    "contabilidad-y-auditoria": contabilidadLogo,
    "mercadotecnia": mercadotecniaLogo,
    "turismo": turismoLogo,
    "educacion_inicial": educacionInicialLogo,
    "mecanica": mecanicaLogo,
    "mecatronica": mecatronicaLogo,
    "telecomunicaciones": telecomunicacionesLogo,
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
    <div className={`${styles.container} ${isDarkMode ? styles.darkModeContainer : ''}`}>
      <div className="row">
        {carreras.map((carrera) => {
          const logoSrc = logoMap[carrera.logo] || null;

          return (
            <div className="col-md-4 mb-4" key={carrera.id}>
              <Link to={`/malla/${carrera.id}`}>
                <div className={`${styles.card} ${isDarkMode ? styles.darkModeCard : ''}`}>
                  {logoSrc && (
                    <img
                      src={logoSrc}
                      alt={carrera.nombre}
                      className={styles.cardImgTop}
                    />
                  )}
                  {!logoSrc && <p>No Logo</p>}
                  <div className={`${styles.cardBody} ${isDarkMode ? styles.darkModeCardBody : ''}`}>
                    <h5 className={`${styles.cardTitle} ${isDarkMode ? styles.darkModeCardTitle : ''}`}>{carrera.nombre}</h5>
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