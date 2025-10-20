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

// Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// === CONTACT FORM ROUTE ===
app.post("/contact", (req, res) => {  
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const newMessage = { name, email, message, date: new Date().toISOString() };
  const filePath = path.join(__dirname, "messages.json");

  let messages = [];
  if (fs.existsSync(filePath)) {
    messages = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }

  messages.push(newMessage);
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));

  console.log("New message:", newMessage);
  res.json({ success: true, message: "Message received successfully!" });
});

// === COURSES API ROUTES ===

// Ruta para obtener todos los cursos
app.get("/api/courses", (req, res) => {
  const filePath = path.join(__dirname, "data", "courses.json");
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Courses file not found." });
  }

  const courses = JSON.parse(fs.readFileSync(filePath, "utf8"));
  res.json(courses);
});

// Ruta para obtener un curso específico por ID
app.get("/api/courses/:id", (req, res) => {
  const courseId = parseInt(req.params.id);
  const filePath = path.join(__dirname, "data", "courses.json");

  const courses = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    return res.status(404).json({ error: "Course not found." });
  }

  res.json(course);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});