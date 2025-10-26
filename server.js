import express from "express";
import fs from "fs";
import path from "path"; // For handling file paths
import passport from "passport"; // Authentication middleware
import session from "express-session"; // Session management
import bodyParser from "body-parser"; // For parsing request bodies
import { fileURLToPath } from "url"; // To get __dirname in ES modules
import { Strategy as GoogleStrategy } from "passport-google-oauth20"; // Google OAuth strategy
import dotenv from 'dotenv'; // Load environment variables

// Get __dirname in ES module

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables (silent mode suppresses all dotenv output)
dotenv.config({ path: './credentials.env' });

const app = express();
const PORT = process.env.PORT || 3000; // Default port is 3000

// View engine setup
app.set("view engine", "ejs"); // Using EJS as the templating engine
app.set("views", path.join(__dirname, "views")); // Views directory

// Middleware
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from 'public' directory
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Parse JSON bodies

app.use(session({ // Session configuration
  secret: process.env.SESSION_SECRET || 'fallback-secret-key-change-in-production', // Uses a strong secret in production
  resave: false, // Don't save session if unmodified
  saveUninitialized: false, // Don't create session until something stored
  proxy: true, // Trust the reverse proxy when setting secure cookies (needed for Heroku) and makes quicker redirects
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Serve secure cookies in production, courtesy of AI
    httpOnly: true, // Mitigate XSS attacks, courtesy of AI
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
  }
}));

app.use(passport.initialize()); // Initialize Passport middleware
app.use(passport.session()); // Persistent login sessions

const CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback'; // Google OAuth callback URL after authentication

passport.use(new GoogleStrategy({ // Google OAuth strategy configuration
    clientID: process.env.GOOGLE_CLIENT_ID, // Google Client ID from environment variables
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google Client Secret from environment variables
    callbackURL: CALLBACK_URL, // Callback URL after authentication
  },
  async (accessToken, refreshToken, profile, done) => { // Verify callback
    const user = {
      googleId: profile.id, // Unique Google ID
      email: profile.emails && profile.emails[0]?.value, // User email
      name: profile.displayName, // User display name
      picture: profile.photos && profile.photos[0]?.value // User profile picture
    };
    return done(null, user); // Pass user to serializeUser
  }
));

passport.serializeUser((user, done) => { // Where verify callback's user is stored in session
  done(null, user); // Serialize user object to session
});

passport.deserializeUser((user, done) => { // Retrieve user from session
  done(null, user); // Deserialize user object from session
});

// Make user available to all templates
app.use((req, res, next) => {
  res.locals.user = req.user || null; // Set user in response locals
  next();
});

// Routes
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, "data", "courses.json"); // Path to courses.json

  if (!fs.existsSync(filePath)) { // Check if file exists
    return res.status(404).send("Courses file not found."); // 404 if not found
  }

  const courses = JSON.parse(fs.readFileSync(filePath, "utf8")); // Read and parse courses.json
  res.render("index", { courses }); // Render index view with courses data
});

app.get("/courses", (req, res) => { // Courses page route
  res.redirect('/'); // Redirect to home page
});

app.get('/auth/google', passport.authenticate('google', { // Google OAuth route
  scope: ['profile', 'email'], // Request profile and email scopes
}));

app.get('/auth/google/callback', // Google OAuth callback route
  passport.authenticate('google', {  // Authenticate using Google strategy
    failureRedirect: '/', // Redirect to home on failure
    failureMessage: true  // Enable failure messages
  }),
  (req, res) => { // Successful authentication
    res.redirect('/'); // Also redirects to home page
  }
);

app.get('/logout', (req, res, next) => { // Logout route
  req.logout(err => {
    if (err) return next(err); // Handle potential error, anything passed to next() will be handled by Express error handlers
    res.redirect('/'); // Redirect to home page after logout
  });
});

app.post("/contact", (req, res) => {  // Contact form submission route
  const { name, email, message } = req.body; // Destructure form data

  if (!name || !email || !message) { // Validate required fields
    return res.status(400).json({ error: "All fields are required." }); // 400 Bad Request if any field is missing
  }

  const newMessage = { name, email, message, date: new Date().toISOString() }; // Create new message object with timestamp
  const filePath = path.join(__dirname, "messages.json"); // Path to messages.json
  let messages = []; // Initialize messages array

  if (fs.existsSync(filePath)) { // Check if messages.json exists
    const fileData = fs.readFileSync(filePath, "utf8"); // Read existing file data
    messages = JSON.parse(fileData); // Parse existing messages
  }

  messages.push(newMessage); // Add new message to messages array
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2)); // Write updated messages back to file
  
  res.json({ success: true, message: "Message received successfully!" }); // Send success response
});

app.get("/course/:id", (req, res) => {
  const courseId = req.params.id; // Get course ID from URL parameters
  const filePath = path.join(__dirname, "api", "courses", `${courseId}.json`); // Path to specific course JSON file
  
  if (!fs.existsSync(filePath)) { // Check if course file exists
    return res.status(404).render("error", { message: "Course not found." }); // Render error view if not found
  }
  
  const course = JSON.parse(fs.readFileSync(filePath, "utf8")); // Read and parse course data
  res.render("course", { course });
});

app.get("/api/courses/:id", (req, res) => { // API endpoint for course data
  const courseId = req.params.id; // Get course ID from URL parameters
  const filePath = path.join(__dirname, "api", "courses", `${courseId}.json`); // Path to specific course JSON file
  
  if (!fs.existsSync(filePath)) { // Check if course file exists
    return res.status(404).json({ error: "Course not found." }); // Send 404 JSON response if not found
  }
  
  const course = JSON.parse(fs.readFileSync(filePath, "utf8")); // Read and parse course data
  res.json(course); // Send course data as JSON response
});


app.listen(PORT, () => {
  // Determine the base URL based on environment
  const baseURL = process.env.NODE_ENV === 'production' // Check if in production
    ? 'https://project-amigo-academy.onrender.com' // Production URL
    : `http://localhost:${PORT}`; // Localhost URL
  
  console.log(`Server running on port ${PORT}`); // Log the port number
  console.log(`URL = ${baseURL}`); // Log the base URL
  console.log(`Render page = https://project-amigo-academy.onrender.com`) // Production render URL
  console.log('Press CTRL+C to stop the server'); // Instruction to stop the server, in case I foregt
});