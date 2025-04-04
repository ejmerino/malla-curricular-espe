import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import mallasData from "../data/mallas.json";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import Home from './Home.jsx';
import './MallaCurricular.css';
import { useTheme } from '../pages/themeContext';

export default function MallaCurricular() {
    const { carreraId } = useParams();
    const [carrera, setCarrera] = useState(null);
    const [materiasEstado, setMateriasEstado] = useState({});
    const [materiasDisponibles, setMateriasDisponibles] = useState(new Set());
    const [materiasAprobadas, setMateriasAprobadas] = useState(new Set());
    const [materiasSiguienteSemestre, setMateriasSiguienteSemestre] = useState(new Set());
    const [materiasTomables, setMateriasTomables] = useState([]);
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();
    const [porcentajeCompletado, setPorcentajeCompletado] = useState(0);
    const [semestreSeleccionado, setSemestreSeleccionado] = useState({});
    const [selectAllDisabled, setSelectAllDisabled] = useState({});

    useEffect(() => {
        const selectedCarrera = mallasData[carreraId];
        setCarrera(selectedCarrera);
    }, [carreraId]);

    useEffect(() => {
        if (carrera) {
            inicializarMaterias();
        }
    }, [carrera]);

    useEffect(() => {
        if (carrera) {
            recalcularEstados();
        }
    }, [materiasEstado, carrera]);

    useEffect(() => {
        if (carrera) {
            const tomables = Array.from(materiasDisponibles).map(id => getMateriaById(id).nombre);
            setMateriasTomables(tomables);
        }
    }, [materiasDisponibles, carrera]);

    useEffect(() => {
        setPorcentajeCompletado(calcularPorcentajeCompletado());
    }, [materiasEstado, carrera]);

    const inicializarMaterias = () => {
        const initialState = {};
        if (!carrera) return;

        carrera.semestres.forEach(semestre => {
            semestre.materias.forEach(materia => {
                initialState[materia.id] = "bloqueada";
            });
        });

        carrera.semestres[0].materias.forEach(materia => {
            initialState[materia.id] = "";
        });

        setMateriasEstado(initialState);
    };

    const recalcularEstados = () => {
        if (!carrera) return;

        const nuevasDisponibles = new Set();
        const nuevasAprobadas = new Set();
        const nuevasMateriasEstado = { ...materiasEstado };

        carrera.semestres.forEach(semestre => {
            semestre.materias.forEach(materia => {
                const disponible = verificarPrerequisitos(materia.id);
                const aprobada = nuevasMateriasEstado[materia.id] === "green";

                if (aprobada) {
                    nuevasAprobadas.add(materia.id);
                }

                if (disponible && !aprobada) {
                    nuevasDisponibles.add(materia.id);
                    nuevasMateriasEstado[materia.id] = "";
                } else if (!disponible && !aprobada) {
                    nuevasMateriasEstado[materia.id] = "bloqueada";
                }
            });
        });

        setMateriasDisponibles(nuevasDisponibles);
        setMateriasAprobadas(nuevasAprobadas);
        setMateriasEstado(nuevasMateriasEstado);
    };

    const verificarPrerequisitos = (materiaId) => {
        const materia = getMateriaById(materiaId);
        const prerequisitos = materia?.prerequisitos || [];

        if (prerequisitos.length === 0) {
            return true;
        }

        for (let prerequisitoId of prerequisitos) {
            if (!materiasAprobadas.has(prerequisitoId)) {
                return false;
            }
        }
        return true;
    };

    const getMateriaById = (id) => {
        if (!carrera) return null;
        for (let semestre of carrera.semestres) {
            const materia = semestre.materias.find((materia) => materia.id === id);
            if (materia) {
                return materia;
            }
        }
        return null;
    };

    const getMateriasQueDependenDe = (materiaId) => {
        const dependientes = [];
        if (!carrera) return dependientes;

        carrera.semestres.forEach(semestre => {
            semestre.materias.forEach(materia => {
                if (materia.prerequisitos && materia.prerequisitos.includes(materiaId)) {
                    dependientes.push(materia.id);
                }
            });
        });
        return dependientes;
    };

    const deseleccionarDependientes = (materiaId, currentState) => {
        let newState = { ...currentState };
        const dependientes = getMateriasQueDependenDe(materiaId);
    
        dependientes.forEach(dependienteId => {
            if (currentState[dependienteId] === "green" || currentState[dependienteId] === "amarillo") {
                newState[dependienteId] = "bloqueada"; // Bloquea la materia
                newState = deseleccionarDependientes(dependienteId, newState); // Llamada recursiva
            }
        });
    
        return newState;
    };
    

    const handleMateriaClick = (materiaId) => {
        if (!materiasDisponibles.has(materiaId) && !materiasAprobadas.has(materiaId)) {
            return;
        }

        setMateriasEstado(prevEstado => {
            let nuevoEstado = { ...prevEstado };
            let nuevoEstadoSiguienteSemestre = new Set(materiasSiguienteSemestre);
            const estaAprobada = nuevoEstado[materiaId] === "green";
            const estaEnSiguienteSemestre = nuevoEstadoSiguienteSemestre.has(materiaId);

            if (!estaAprobada && !estaEnSiguienteSemestre) {
                // Primer clic: Agregar a siguiente semestre (amarillo)
                nuevoEstadoSiguienteSemestre.add(materiaId);
                nuevoEstado[materiaId] = "amarillo";
            } else if (estaEnSiguienteSemestre) {
                // Segundo clic: Marcar como aprobada (verde)
                nuevoEstadoSiguienteSemestre.delete(materiaId);
                nuevoEstado[materiaId] = "green";

                // Deseleccionar las materias dependientes si se aprueba
                nuevoEstado = deseleccionarDependientes(materiaId, nuevoEstado);
            } else {
                // Tercer clic: Deseleccionar (volver al estado original)
                 nuevoEstado[materiaId] = "";
                nuevoEstado = deseleccionarDependientes(materiaId, nuevoEstado);
                  const materia = getMateriaById(materiaId);
                 if (materia.semestre === 1){
                   nuevoEstado = deseleccionarDependientes(materiaId, nuevoEstado);
                 }


            }

            setMateriasSiguienteSemestre(nuevoEstadoSiguienteSemestre);
            return nuevoEstado;
        });
    };

    const downloadMallaPDF = () => {
        const doc = new jsPDF();

        doc.text(`Malla Curricular - ${carrera.nombre}`, 10, 10);

        let y = 20;
        carrera.semestres.forEach((semestre, semestreIndex) => {
            doc.text(`Semestre ${semestre.numero}`, 10, y);
            y += 10;

            const materiasData = semestre.materias.map(materia => [
                materia.nombre,
                materiasEstado[materia.id] === 'green' ? 'Aprobada' : (materiasDisponibles.has(materia.id) ? 'Disponible' : 'Bloqueada')
            ]);

            doc.autoTable({
                head: [['Materia', 'Estado']],
                body: materiasData,
                startY: y,
                margin: { left: 10 },
            });

            y = doc.autoTable.previous.finalY + 10;
        });

        doc.save(`${carrera.nombre}-malla.pdf`);
    };

    const downloadMallaImage = () => {
        const element = document.querySelector(".malla-container");
        html2canvas(element, {
            scrollX: 0,
            scrollY: 0,
        }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = imgData;
            link.download = `${carrera.nombre}-malla.png`;
            link.click();
        });
    };

    const calcularPorcentajeCompletado = () => {
        if (!carrera) return 0;

        let totalMaterias = 0;
        let materiasAprobadasCount = 0;

        carrera.semestres.forEach(semestre => {
            totalMaterias += semestre.materias.length;
        });

        materiasAprobadasCount = Object.values(materiasEstado).filter(estado => estado === "green").length;

        return (materiasAprobadasCount / totalMaterias) * 100;
    };

    const handleAprobarSemestre = (semestre) => {
        setMateriasEstado(prevState => {
            let newState = { ...prevState };
            let allSelected = true;

            semestre.materias.forEach(materia => {
                if ((materiasDisponibles.has(materia.id) || materiasAprobadas.has(materia.id)) && newState[materia.id] !== "green") {
                    allSelected = false;
                }
            });

            semestre.materias.forEach(materia => {
                if (materiasDisponibles.has(materia.id) || materiasAprobadas.has(materia.id)) {
                    newState[materia.id] = allSelected ? "" : "green";
                }
            });

            // Si se están deseleccionando materias, deseleccionar también las dependencias
            if (allSelected) {
                semestre.materias.forEach(materia => {
                    newState = deseleccionarDependientes(materia.id, newState);
                });
            }

            return newState;
        });

        setSemestreSeleccionado(prevState => ({
            ...prevState,
            [semestre.numero]: !prevState[semestre.numero]
        }));
    };


    useEffect(() => {
        if (carrera) {
            const initialSelectAllDisabled = {};
            const initialSemestreSeleccionado = {};
            carrera.semestres.forEach(semestre => {
                const allAvailableOrApproved = semestre.materias.every(materia =>
                    materiasDisponibles.has(materia.id) || materiasAprobadas.has(materia.id)
                );
                initialSelectAllDisabled[semestre.numero] = !allAvailableOrApproved;

                // Inicializar semestreSeleccionado basado en si todas las materias están seleccionadas
                initialSemestreSeleccionado[semestre.numero] = semestre.materias.every(materia => {
                    if (materiasDisponibles.has(materia.id) || materiasAprobadas.has(materia.id)) {
                        return materiasEstado[materia.id] === "green";
                    }
                    return true; // Si no está disponible, se considera seleccionada
                });
            });
            setSelectAllDisabled(initialSelectAllDisabled);
            setSemestreSeleccionado(initialSemestreSeleccionado);
        }
    }, [materiasDisponibles, materiasAprobadas, carrera, materiasEstado]);


    if (!carrera) {
        return <div>Cargando...</div>;
    }

    const numeroMateriasTomables = materiasTomables.length;

    const containerClass = `container mt-5 malla-container ${isDarkMode ? 'dark-mode' : ''}`;
    const alertClass = `alert alert-info ${isDarkMode ? 'dark-mode-alert' : ''}`;
    const titleClass = `text-center mb-4 malla-title ${isDarkMode ? 'dark-mode-text' : ''}`;
    const selectionInfoClass = `selection-info ${isDarkMode ? 'dark-mode-selection-info' : ''}`;
    const siguienteSemestreInfoClass = `selection-info ${isDarkMode ? 'dark-mode-selection-info' : ''}`;
    const materiasQueTomareClass = `alert alert-warning ${isDarkMode ? 'dark-mode-alert' : ''}`;

    return (
        <div className={containerClass}>
            <button
                onClick={() => {
                    navigate("/");
                    window.location.reload();
                }}
                className="btn btn-outline-primary mb-4 return-button"
            >
                Regresar
            </button>

            <h1 className={titleClass}>{carrera.nombre}</h1>

            <div className="progress-info">
                {porcentajeCompletado === 100 ? (
                    <span className="felicitaciones">¡Felicidades! Has completado la carrera.</span>
                ) : (
                    <span>Vas {porcentajeCompletado.toFixed(1)}% de la carrera</span>
                )}
            </div>

            <div className="progress-bar-container">
                <div
                    className="progress-bar"
                    style={{ width: `${porcentajeCompletado}%` }}
                >
                </div>
            </div>

            <div className={alertClass}>
                <strong>Materias que puedes tomar:</strong> {materiasTomables.join(', ') || 'Ninguna por ahora'}
            </div>

            <div className={materiasQueTomareClass}>
                <strong>Materias que tomarás:</strong> {Array.from(materiasSiguienteSemestre).map(materiaId => {
                    const materia = getMateriaById(materiaId);
                    return materia ? materia.nombre : null;
                }).join(', ') || 'Ninguna por ahora'}
            </div>

            <div className="instruction-box">
                <p><strong>Instrucciones:</strong></p>
                <p>
                    - <strong>Un clic:</strong>  Seleccionar materia para el siguiente semestre (amarillo).
                </p>
                <p>
                    - <strong>Segundo clic:</strong> Marcar materia como aprobada (verde).
                </p>
                <p>
                    - <strong>Tercer clic:</strong> Deseleccionar materia.
                </p>
            </div>

            <div className="row">
                {carrera.semestres.map((semestre, idx) => (
                    <div key={idx} className="col-md-6 mb-4 semestre-section">
                        <div className="semestre-header">
                            <h3 className={`semestre-title ${isDarkMode ? 'dark-mode-text' : ''}`}>Semestre {semestre.numero}</h3>
                            <button
                                className={`btn btn-sm ${semestreSeleccionado[semestre.numero] ? 'btn-secondary' : 'btn-success'} select-all-button`}
                                onClick={() => handleAprobarSemestre(semestre)}
                                disabled={selectAllDisabled[semestre.numero]}
                            >
                                {semestreSeleccionado[semestre.numero] ? 'Desaprobar' : 'Aprobar'}
                                {selectAllDisabled[semestre.numero] && <i className="fas fa-lock lock-icon select-all-lock-icon"></i>}
                            </button>
                        </div>
                        <div className="row">
                            {semestre.materias.map((materia) => {
                                const estaDisponible = materiasDisponibles.has(materia.id) || materiasAprobadas.has(materia.id);
                                const estaAprobada = materiasEstado[materia.id] === "green";
                                 const estaAmarilla = materiasEstado[materia.id] === "amarillo";
                                const estaEnSiguienteSemestre = materiasSiguienteSemestre.has(materia.id);
                                const estaBloqueada = materiasEstado[materia.id] === "bloqueada";

                                let cardClassName = `card materia-card ${isDarkMode ? 'dark-mode-card' : ''}`;
                                if (estaAprobada) {
                                    cardClassName += ' materia-verde aprobada';
                                } else if (estaEnSiguienteSemestre || estaAmarilla) {
                                    cardClassName += ' materia-amarilla siguiente-semestre';
                                } else if (estaBloqueada) {
                                    cardClassName += ' materia-bloqueada bloqueada';
                                } else if (estaDisponible) {
                                    cardClassName += ' disponible';
                                }

                                return (
                                    <div key={materia.id} className="col-sm-6 mb-3">
                                        <div
                                            className={cardClassName}
                                            style={{ cursor: !estaDisponible ? "not-allowed" : "pointer" }}
                                            onClick={() => estaDisponible ? handleMateriaClick(materia.id) : null}
                                        >
                                            <div className="card-body">
                                                <h5 className={`card-title ${isDarkMode ? 'dark-mode-text' : ''}`}>{materia.nombre}</h5>
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

            <div className={siguienteSemestreInfoClass}>
                Materias que elegiste tomar el siguiente semestre:
                {Array.from(materiasSiguienteSemestre).map(materiaId => {
                    const materia = getMateriaById(materiaId);
                    return materia ? (
                        <span key={materiaId} className="materia-siguiente-semestre">
                            {materia.nombre}
                        </span>
                    ) : null;
                })}
            </div>

            <div className="download-buttons">
                <button className="btn btn-outline-success download-button" onClick={downloadMallaImage}>
                    Descargar Malla como Imagen
                </button>
            </div>
        </div>
    );
}