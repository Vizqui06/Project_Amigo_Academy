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


// Set the EJS as a templating engine to use
app.set("view engine", "ejs");
// Get where do we are gona get the templates
app.set("views", path.join(__dirname, "views"));


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

// Endpoint that render the index (home page) as ejs
app.get("/", (req, res) => {
  // This is the path of the JSON file that contains the courses list
  const filePath = path.join(__dirname, "data", "courses.json");

  // Error handling if the JSON file doesnt exist
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Courses file not found.");
  }

  // Read the file as an array
  const courses = JSON.parse(fs.readFileSync(filePath, "utf8"));
  // Render the  index.ejs template while passing the courses array 
  res.render("index", { courses });
});

// Endpoint that handles the single course page (course.ejs) 
app.get("/course/:id", (req, res) => {
  // Get the course id from the url params
  const courseId = req.params.id;
  // Get the path of the specific JSON file of the course
  const filePath = path.join(__dirname, "api", "courses", `${courseId}.json`);
  // Same error handling if the path doesnt exist.
  if (!fs.existsSync(filePath)) {
    return res.status(404).render("error", { message: "Course not found." });
  }
  //Read the file and make it into an array or an object 
  const course = JSON.parse(fs.readFileSync(filePath, "utf8"));
  //Render course.ejs while passing the course array data into the template
  res.render("course", { course });
});

// Endpoint for getting the raw JSON data from a specifi course
app.get("/api/courses/:id", (req, res) => {
  // From this
  const courseId = req.params.id;
  const filePath = path.join(__dirname, "api", "courses", `${courseId}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Course not found." });
  }

  // To this is the same as the previous endpoint
  const course = JSON.parse(fs.readFileSync(filePath, "utf8"));
  // Just in this part, instead of rendering some template it just send the json as a response
  res.json(course);
});



// Starts the server.
app.listen(PORT, () => {
  // Show the message in the terminal so I know the server is up and running.
  console.log(`Server running on http://localhost:${PORT}`);
});