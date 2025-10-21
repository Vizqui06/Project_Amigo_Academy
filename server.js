import express from "express"; // Imports express, which is the core framework we are gonna use to build the server.
import fs from "fs"; // Need the fs (File System) module because we are going to read and write files, specifically our JSON databases.
import path from "path"; // path is a built-in module that helps build file paths that works on any operating system (like /public/index.html).
import bodyParser from "body-parser"; // body-parser is middleware. Its job is to help us extract the data from incoming form POST requests.
import { fileURLToPath } from "url"; // Need this because we are using the modern ES Module syntax (import/export).

// There is a problem with the ES modules
// It doesn't get __dirname (the current directory path) by default, so have to create it manually using 'import.meta.url'.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize my actual Express application.
const app = express();
// Set the server to run on port 3000.
const PORT = 3000;

// We have to do functions that run on every request.

// This is a key piece. I'm telling Express to serve all static files
// (like our index.html, styles.css, and images) from the 'public' folder.
app.use(express.static(path.join(__dirname, "public")));

// This line sets up body-parser to understand data from our HTML forms (with the urlencoded format).
// The extended part just allows for more complex data, but for us, it's standard.
app.use(bodyParser.urlencoded({ extended: true }));

// This tells body-parser to also understand the JSON format,
// which we'll use for our API routes.
app.use(bodyParser.json());

// Set up the POST route for our contact form. It "listens" for requests at /contact.
app.post("/contact", (req, res) => { 
  
  // Pulls the name, email, and message fields out of the form data (which lives in req.body).
  const { name, email, message } = req.body;

  // This is a simple validation. If any of the fields are empty...
  if (!name || !email || !message) {
    // Send back a 400 Bad Request error to the browser.
    return res.status(400).json({ error: "All fields are required." });
  }

  // Thisi is a new object for the message and adding a timestamp so I know when it was sent.
  const newMessage = { name, email, message, date: new Date().toISOString() };
  
  // This is the path to the database file where it stores all messages.
  const filePath = path.join(__dirname, "messages.json");

  // Start with an empty array by default.
  let messages = [];

  // I first check if the 'messages.json' file *already* exists.
  if (fs.existsSync(filePath)) {
    // If it does, It reads its contents...
    const fileData = fs.readFileSync(filePath, "utf8");
    // ...and parse it from a JSON string back into a normal JavaScript array.
    messages = JSON.parse(fileData);
  }

  // Add (push) the new message to the end of the array.
  messages.push(newMessage);

  // Then, write the entire updated array back to the messages.json file.
  // The null part makes the JSON file good formatted and be readable.
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));

  // I'll log it to my server console so I can see it's working.
  console.log("New message:", newMessage);
  
  // And finally, I send a 'success' response back to the browser.
  res.json({ success: true, message: "Message received successfully!" });
});

// This is a simple API endpoint to get the list of all courses for the homepage.
app.get("/api/courses", (req, res) => {
  // We define the path to the JSON file that holds the main list of courses.
  const filePath = path.join(__dirname, "data", "courses.json"); 
  
  // If can't find that file for some reason...
  if (!fs.existsSync(filePath)) { 
    // Sends a 404 error (Not found).
    return res.status(404).json({ error: "Courses file not found." });
  }

  // If the file exists, it read it, parse it...
  const courses = JSON.parse(fs.readFileSync(filePath, "utf8"));
  // ...and send the full list of courses back to the browser as a JSON response.
  res.json(courses);
});

// This route gets a specific course. The :id is a URL parameter (it's a variable).
app.get("/api/courses/:id", (req, res) => {
  // So it grabs the id from the URL. (if the request is /api/courses/calculus-101, courseId will be calculo).
  const courseId = req.params.id;
  
  // For this project, weare storing each course as its own JSON file.
  // So, build the file path based on the ID.
  const filePath = path.join(__dirname, "api", "courses", `${courseId}.json`);

  // If a file for that ID doesn't exist...
  if (!fs.existsSync(filePath)) {
    // Returns a 404 error.
    return res.status(404).json({ error: "Course not found." });
  }

  // If it exists, It reads the specific course file...
  const course = JSON.parse(fs.readFileSync(filePath, "utf8"));
  // ...and send it back as JSON.
  res.json(course);
});

// This route serves the page for a single course.
app.get("/course/:id", (req, res) => {
  // This route serves the same course.html file for any ID.
  // This implies that the course.html file itself has client-side JavaScript.
  // That script will look at the window's URL, grab the ID, and then make a 'fetch' call
  // to our /api/courses/:id route (the one above) to get the data and fill the page.
  res.sendFile(path.join(__dirname, "public", "course.html"));
});

// Starts the server.
app.listen(PORT, () => {
  // Show the message in the terminal so I know the server is up and running.
  console.log(`Server running on http://localhost:${PORT}`);
});