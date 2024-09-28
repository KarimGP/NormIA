const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");

dotenv.config(); // Cargar variables de entorno desde .env

const app = express();
const PORT = process.env.PORT || 5000; // Usar la variable de entorno PORT o 5000 como puerto predeterminado

// Configuración de CORS para permitir solicitudes desde cualquier origen
app.use(cors());
app.use(express.json());

// Configurar OpenAI con la clave API de las variables de entorno
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Endpoint para manejar la solicitud de búsqueda de normas
app.post("/buscar-norma", async (req, res) => {
  const { ramo, tipoTrabajo } = req.body;

  try {
    console.log("Solicitud recibida del frontend:", req.body);

    // Verificar que la API Key esté configurada
    if (!process.env.OPENAI_API_KEY) {
      console.error("API Key de OpenAI no configurada.");
      return res.status(500).json({ error: "API Key de OpenAI no configurada." });
    }

    // Construir el prompt para OpenAI utilizando el formato de mensajes para gpt-3.5-turbo
    const messages = [
      { role: "system", content: "Eres un asistente que proporciona normas UNE relacionadas con la construcción y oficios." },
      { role: "user", content: `Dame la norma UNE más relevante para el ramo de ${ramo} y el tipo de trabajo ${tipoTrabajo}. Proporciona el código de la norma, un enlace a la norma y un breve resumen.` },
    ];

    // Realizar la solicitud a la API de OpenAI usando gpt-3.5-turbo-0125
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0125", // Usar el modelo gpt-3.5-turbo-0125
      messages: messages,
      max_tokens: 150,
      temperature: 0.7,
    });

    // Verificar si hay respuesta de OpenAI
    if (!response || !response.data || !response.data.choices || !response.data.choices[0].message) {
      console.error("Respuesta inválida de OpenAI:", response);
      return res.status(500).json({ error: "Respuesta inválida de OpenAI." });
    }

    // Parsear la respuesta de OpenAI
    const normaTexto = response.data.choices[0].message.content.trim();
    const [codigo, ...resumenArray] = normaTexto.split(" - ");
    const resumen = resumenArray.join(" - ");

    // Formar la respuesta final para el frontend
    const norma = {
      codigo: codigo.trim(),
      link: `https://www.aenor.com`, // Actualiza el enlace según la norma obtenida
      resumen: resumen.trim(),
    };

    console.log("Norma generada correctamente:", norma);
    res.json({ norma });
  } catch (error) {
    // Capturar y mostrar detalles del error
    console.error("Error al procesar la solicitud:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.response ? error.response.data : error.message });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
