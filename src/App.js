import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Asegúrate de que los estilos estén importados

function App() {
  const [ramo, setRamo] = useState("");
  const [tipoTrabajo, setTipoTrabajo] = useState("");
  const [norma, setNorma] = useState(null);
  const [error, setError] = useState("");

  const API_URL =
    process.env.NODE_ENV === "production"
      ? "https://normia-backend.onrender.com"
      : "http://localhost:5000";

  const handleRamoChange = (e) => {
    setRamo(e.target.value);
    setNorma(null);
    setError("");
  };

  const handleTipoTrabajoChange = (e) => {
    setTipoTrabajo(e.target.value);
    setNorma(null);
    setError("");
  };

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
      setRamo("");
      setTipoTrabajo("");
      setError("");
    } catch (error) {
      console.error("Error al buscar la norma:", error);
      setError("No se pudo obtener la norma. Intenta de nuevo.");
      setNorma(null);
    }
  };

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
        <div className="form-group">
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

        <div className="form-group">
          <input
            type="text"
            value={tipoTrabajo}
            onChange={handleTipoTrabajoChange}
            placeholder="Describe el tipo de trabajo en pocas palabras"
          />
        </div>

        <div className="button-container">
          <button type="button" onClick={buscarNorma}>
            Buscar Norma
          </button>
          <button type="button" onClick={limpiarCampos} className="btn-limpiar">
            Limpiar
          </button>
        </div>
      </form>

      {error && <p>{error}</p>}

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
