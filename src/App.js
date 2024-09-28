import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Asegúrate de que los estilos estén importados

function App() {
  const [ramo, setRamo] = useState("");
  const [tipoTrabajo, setTipoTrabajo] = useState("");
  const [norma, setNorma] = useState(null);
  const [error, setError] = useState("");

  // Definir la URL del backend según el entorno (desarrollo o producción)
  const API_URL = process.env.NODE_ENV === "production"
    ? "https://normia-backend.onrender.com" // Cambia esto a la URL de tu backend en producción
    : "http://localhost:5000";

  // Función para manejar la selección del ramo
  const handleRamoChange = (e) => {
    setRamo(e.target.value);
    setNorma(null);
    setError("");
  };

  // Función para manejar el cambio en el campo de tipo de trabajo
  const handleTipoTrabajoChange = (e) => {
    setTipoTrabajo(e.target.value);
    setNorma(null);
    setError("");
  };

  // Función para buscar la norma más relevante a través de la API del backend
  const buscarNorma = async () => {
    if (!ramo || !tipoTrabajo) {
      setError("Por favor, completa ambos campos.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/buscar-norma`, {
        ramo,
        tipoTrabajo,
      });
      setNorma(response.data.norma);
      // Reiniciar el estado a valores iniciales después de buscar la norma
      setRamo("");
      setTipoTrabajo("");
      setError("");
    } catch (error) {
      console.error("Error al buscar la norma:", error);
      setError("No se pudo obtener la norma. Intenta de nuevo.");
      setNorma(null); // Reiniciar la norma en caso de error
    }
  };

  // Función para limpiar todos los campos y resetear el estado
  const limpiarCampos = () => {
    setRamo("");
    setTipoTrabajo("");
    setNorma(null);
    setError("");
  };

  return (
    <div className="App">
      <h1>Encuentra la norma UNE con IA</h1>
      <form>
        {/* Campo Select sin label, solo con placeholder */}
        <div>
          <select value={ramo} onChange={handleRamoChange}>
            <option value="">Selecciona un ramo</option>
            <option value="Albañilería">Albañilería</option>
            <option value="Carpintería de Madera">Carpintería de Madera</option>
            <option value="Carpintería de Aluminio">Carpintería de Aluminio</option>
            <option value="Electricidad">Electricidad</option>
            <option value="Fontanería">Fontanería</option>
            <option value="Parquet">Parquet</option>
            <option value="Pintura">Pintura</option>

          </select>
        </div>

        {/* Campo Input sin label, solo con placeholder */}
        <div>
          <input
            type="text"
            value={tipoTrabajo}
            onChange={handleTipoTrabajoChange}
            placeholder="Describe el tipo de trabajo en pocas palabras"
          />
        </div>

        {/* Contenedor de los botones */}
        <div className="button-container">
          {/* Botón para buscar la norma */}
          <button type="button" onClick={buscarNorma}>
            Buscar Norma
          </button>

          {/* Botón para limpiar campos */}
          <button type="button" onClick={limpiarCampos} className="btn-limpiar">
            Limpiar
          </button>
        </div>
      </form>

      {/* Mensajes de error en magenta */}
      {error && <p>{error}</p>}

      {/* Mostrar la norma obtenida */}
      {norma && (
        <div className="resultado">
          <h2>
            <a href={norma.link} target="_blank" rel="noopener noreferrer">
              {norma.codigo}
            </a>
          </h2>
          <p>{norma.resumen}</p>
        </div>
      )}
    </div>
  );
}

export default App;
