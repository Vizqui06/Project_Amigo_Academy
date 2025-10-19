// server.js
import express from "express";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Para archivos estáticos (HTML, CSS, imágenes)
app.use(express.static(path.join(__dirname, "public")));

// Para leer datos de formularios
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ruta para procesar el formulario de contacto
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  // Crear un objeto mensaje
  const newMessage = {
    name,
    email,
    message,
    date: new Date().toISOString(),
  };

  // Guardamos en messages.json
  const filePath = path.join(__dirname, "messages.json");
  let messages = [];

  if (fs.existsSync(filePath)) {
    messages = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }

  messages.push(newMessage);
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));

  console.log("Nuevo mensaje recibido:", newMessage);
  res.json({ success: true, message: "Mensaje enviado correctamente." });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
