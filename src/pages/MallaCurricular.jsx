import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import mallasData from "../data/mallas.json";
import './MallaCurricular.css';

export default function MallaCurricular() {
  const { carreraId } = useParams();
  const [carrera, setCarrera] = useState(null);
  const [materiasEstado, setMateriasEstado] = useState({});
  const [materiasDisponibles, setMateriasDisponibles] = useState(new Set());
  const [materiasAprobadas, setMateriasAprobadas] = useState(new Set()); // Nuevo estado para materias aprobadas

  const navigate = useNavigate();

  useEffect(() => {
    const selectedCarrera = mallasData[carreraId];
    setCarrera(selectedCarrera);

  }, [carreraId]);

  useEffect(() => {
    // Inicializar el estado de las materias al cargar la carrera
    if (carrera) {
      const initialState = {};
      carrera.semestres.forEach(semestre => {
        semestre.materias.forEach(materia => {
          initialState[materia.id] = "bloqueada"; // Inicialmente todas bloqueadas
        });
      });
      // Desbloquear materias de primer semestre
      carrera.semestres[0].materias.forEach(materia => {
        initialState[materia.id] = ""; // "" significa desbloqueada y no aprobada
      });
      setMateriasEstado(initialState);
    }
  }, [carrera]);

  useEffect(() => {
    if (carrera && materiasEstado) {
      const nuevasDisponibles = new Set();
      const nuevasAprobadas = new Set(materiasAprobadas); // Copiar las aprobadas existentes

      // Recorrer las materias para verificar dependencias y desbloquear
      carrera.semestres.forEach(semestre => {
        semestre.materias.forEach(materia => {
          const prerequisitosCumplidos = verificarPrerequisitos(materia.id);

          if (prerequisitosCumplidos && materiasEstado[materia.id] !== "green") {
            nuevasDisponibles.add(materia.id); // Marcar como disponibles
          }

          if(materiasEstado[materia.id] === "green"){
            nuevasAprobadas.add(materia.id)
          }

        });
      });
      setMateriasDisponibles(nuevasDisponibles);
      setMateriasAprobadas(nuevasAprobadas)
    }
  }, [materiasEstado, carrera]);

  // Función para verificar los prerequisitos
  const verificarPrerequisitos = (materiaId) => {
    const materia = getMateriaById(materiaId);
    const prerequisitos = materia?.prerequisitos || [];

    if(prerequisitos.length === 0){
      return true; // No tiene prerequisitos
    }

    for (let prerequisitoId of prerequisitos) {
      if (!materiasAprobadas.has(prerequisitoId)) { // Verificar si el prerequisito está en el Set de aprobadas
        return false; // Si no está aprobada, no se puede tomar
      }
    }
    return true;
  };

  // Manejo de clic en materia
  const handleMateriaClick = (materiaId) => {
    if (!materiasDisponibles.has(materiaId) && !materiasAprobadas.has(materiaId)) {
      // Si no está disponible ni aprobada, no hacer nada
      return;
    }

    setMateriasEstado((prevEstado) => {
      const nuevoEstado = { ...prevEstado };
      if (nuevoEstado[materiaId] === "green") {
        nuevoEstado[materiaId] = ""; // Si ya estaba aprobada, se desmarca
        setMateriasAprobadas((prevAprobadas) => {
          const newSet = new Set(prevAprobadas);
          newSet.delete(materiaId);
          return newSet;
        });
      } else {
        nuevoEstado[materiaId] = "green"; // Si no, la marca como aprobada
        setMateriasAprobadas((prevAprobadas) => new Set(prevAprobadas.add(materiaId)));
      }
      return nuevoEstado;
    });
  };

  const getMateriaById = (id) => {
    if(!carrera) return null;
    // Buscar la materia por ID en los datos de la carrera
    for (let semestre of carrera.semestres) {
      const materia = semestre.materias.find((materia) => materia.id === id);
      if (materia) {
        return materia;
      }
    }
    return null;
  };

  if (!carrera) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mt-5">
      <button onClick={() => navigate("/")} className="btn btn-primary mb-4">
        Regresar
      </button>
      <h1 className="text-center mb-4">{carrera.nombre}</h1>
      <div className="row">
        {carrera.semestres.map((semestre, idx) => (
          <div key={idx} className="col-12 mb-4">
            <h3>Semestre {semestre.numero}</h3>
            <div className="row">
              {semestre.materias.map((materia) => {
                const estaDisponible = materiasDisponibles.has(materia.id) || materiasAprobadas.has(materia.id);
                const estaAprobada = materiasEstado[materia.id] === "green";
                const estaBloqueada = materiasEstado[materia.id] === "bloqueada";

                return (
                  <div
                    key={materia.id}
                    className={`col-md-3 mb-3`}
                  >
                    <div
                      className={`card materia-card ${estaAprobada ? "materia-verde" : ""} ${!estaDisponible ? "materia-bloqueada" : ""}`}
                      style={{
                        cursor: !estaDisponible ? "not-allowed" : "pointer",
                        opacity: !estaDisponible ? 0.5 : 1,
                      }}
                      onClick={() => estaDisponible ? handleMateriaClick(materia.id) : null}
                    >
                      <div className="card-body">
                        <h5 className="card-title">{materia.nombre}</h5>
                        {!estaDisponible && (
                          <i className="fas fa-lock lock-icon"></i>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-success" onClick={() => downloadMalla()}>
        Descargar Malla como Imagen
      </button>
    </div>
  );

  function downloadMalla() {
    // Lógica para descargar la malla como imagen
    const element = document.querySelector(".container");
    import("html2canvas").then((html2canvas) => {
      html2canvas.default(element).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = `${carrera.nombre}-malla.png`;
        link.click();
      });
    });
  }
}