// Import express framework - This is the foundation of our server that handles all HTTP requests and responses
import express from "express";
// Import fs (File System) module - Used throughout the code to read JSON files (courses.json, messages.json, individual course files)
import fs from "fs";
// Import path module - Used to create cross-platform file paths, works with fs to locate files correctly
import path from "path";
// Import passport - Main authentication library that manages the entire OAuth flow with Google
import passport from "passport";
// Import express-session - Creates and manages user sessions, works with passport to keep users logged in
import session from "express-session";
// Import body-parser - Middleware that processes incoming form data, used in the /contact endpoint
import bodyParser from "body-parser";
// Import fileURLToPath - Helper to convert ES module URLs to file paths, needed to create __dirname
import { fileURLToPath } from "url";
// Import GoogleStrategy - Specific strategy for passport that handles Google OAuth 2.0 authentication
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// Import dotenv - Loads environment variables from .env file, used to get SECRET keys and Google credentials
import dotenv from 'dotenv';

// Setup __dirname for ES modules - This block creates __dirname similar to CommonJS
// Convert the current module's URL to a file path - Needed because ES modules don't have __dirname by default
const __filename = fileURLToPath(import.meta.url);
// Extract the directory path from the filename - Used throughout the code to build paths to files (views, public, data folders)
const __dirname = path.dirname(__filename);
// Load environment variables from credentials.env file (local development only)
// In production (Render), environment variables are set through the dashboard
// The 'silent' option suppresses dotenv's informational messages
dotenv.config({ path: './credentials.env', silent: true });

// Create the Express application instance - This is the main server object that all routes and middleware attach to
const app = express();
// Define the port number - The server will listen on this port, used in app.listen() at the bottom
const PORT = process.env.PORT || 3000;

// Configure EJS as the templating engine - This tells Express to process .ejs files, used in res.render() calls
app.set("view engine", "ejs");
// Set the views directory path - Tells Express where to find .ejs template files (index.ejs, course.ejs, error.ejs)
app.set("views", path.join(__dirname, "views"));

// MIDDLEWARE SECTION - These functions run on every request before reaching the route handlers

// Serve static files from the 'public' folder - Makes CSS, images, and client-side JS available to the browser
app.use(express.static(path.join(__dirname, "public")));

// Parse URL-encoded form data - Extracts data from HTML forms, used in the /contact POST endpoint
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON data from request body - Allows the /contact and API endpoints to receive JSON data
app.use(bodyParser.json());

// Configure session middleware - Creates encrypted cookies to track user login state across requests
// IMPORTANT: In production (Render), make sure to set SESSION_SECRET as an environment variable
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key-change-in-production', // Secret key from .env file, used to encrypt session data
  resave: false, // Don't save session if unmodified - improves performance
  saveUninitialized: false, // Don't create session until user logs in - saves storage space
  cookie: {
    // Use secure cookies in production (requires HTTPS)
    secure: process.env.NODE_ENV === 'production',
    // HttpOnly prevents JavaScript access to cookies (security)
    httpOnly: true,
    // SameSite prevents CSRF attacks
    sameSite: 'lax',
    // Set max age to 7 days (in milliseconds)
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));

// Initialize passport - Adds passport's authentication methods to every request object
app.use(passport.initialize());
// Enable persistent login sessions - Allows passport to use the session middleware configured above
app.use(passport.session());

// Define the Google OAuth callback URL - This must match the URL set in Google Cloud Console
// In production (Render), this will use the production URL; in development, it uses localhost
const CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback';

/**
 * Configure Passport to use Google OAuth 2.0 strategy for authentication.
 * This handles the OAuth flow with Google and processes user profile data.
 */
passport.use(new GoogleStrategy({
    // Client ID from Google Cloud Console - Identifies our app to Google, loaded from .env
    clientID: process.env.GOOGLE_CLIENT_ID,
    // Client Secret from Google Cloud Console - Proves our app's identity to Google, loaded from .env
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // Callback URL registered in Google Cloud Console - Where Google sends users after they authorize
    callbackURL: CALLBACK_URL,
  },
  // Verify callback function - Runs after Google authenticates the user
  async (accessToken, refreshToken, profile, done) => {
    // Create a user object from Google profile data
    // This object will be stored in the session and accessible as req.user
    const user = {
      googleId: profile.id, // Unique Google user ID
      email: profile.emails && profile.emails[0]?.value, // User's email from Google
      name: profile.displayName, // User's display name from Google profile
      picture: profile.photos && profile.photos[0]?.value // User's profile picture URL
    };
    // Call done() to complete authentication - Passes user object to serializeUser
    return done(null, user);
  }
));

/**
 * Serializes user object to store in session.
 * Only stores essential data to keep session size small.
 */
passport.serializeUser((user, done) => {
  // Store the entire user object in session - Small enough to store directly
  done(null, user);
});

/**
 * Deserializes user object from session.
 * Called on every request for authenticated users.
 */
passport.deserializeUser((user, done) => {
  // Return the user object - Makes req.user available in all routes
  done(null, user);
});

/**
 * Middleware to make user object available to all EJS templates.
 * This allows templates to check if a user is logged in and display their info.
 */
app.use((req, res, next) => {
  // Make req.user available as 'user' variable in all EJS templates
  res.locals.user = req.user || null;
  next();
});


app.get('/test-session', (req, res) => {
  req.session.test = 'working';
  res.json({ 
    sessionID: req.sessionID,
    user: req.user,
    test: req.session.test
  });
});


/**
 * GET endpoint that renders the main page with courses.
 * This is the landing page that shows all courses and the sign-in option.
 * 
 * @route GET /
 */
app.get('/', (req, res) => {
  // Build path to courses.json file - Contains array of course summaries
  const filePath = path.join(__dirname, "data", "courses.json");

  // Validate that courses file exists - Prevents server crash if file is missing
  if (!fs.existsSync(filePath)) {
    // Return 404 Not Found error - Indicates configuration problem
    return res.status(404).send("Courses file not found.");
  }

  // Read and parse courses.json file - Converts JSON string to JavaScript array
  const courses = JSON.parse(fs.readFileSync(filePath, "utf8"));
  
  // Render index.ejs template with courses data
  // The user object is automatically available via res.locals.user middleware
  res.render("index", { courses });
});

/**
 * GET endpoint for the /courses route - redirects to home page.
 * Kept for backward compatibility if any links point to /courses.
 * 
 * @route GET /courses
 */
app.get("/courses", (req, res) => {
  // Redirect to home page which now shows courses
  res.redirect('/');
});

/**
 * GET endpoint that initiates Google OAuth authentication flow.
 * Redirects user to Google's consent screen to authorize the application.
 * 
 * @route GET /auth/google
 */
app.get('/auth/google', passport.authenticate('google', {
  // Request access to user's profile and email from Google
  scope: ['profile', 'email'],
}));

/**
 * GET endpoint that handles the OAuth callback from Google.
 * Processes the authentication response and redirects based on success or failure.
 * 
 * @route GET /auth/google/callback
 */
app.get('/auth/google/callback',
  // passport.authenticate processes the authorization code and gets user profile
  passport.authenticate('google', { 
    failureRedirect: '/',
    failureMessage: true 
  }),
  // Success handler - Only runs if authentication succeeds
  (req, res) => {
    // Log successful authentication (helps with debugging)
    console.log('User authenticated successfully:', req.user?.email);
    // Redirect to home page - User is now logged in and req.user is available
    res.redirect('/');
  }
);

/**
 * GET endpoint that logs out the current user.
 * Destroys the user session and redirects to the home page.
 * 
 * @route GET /logout
 */
app.get('/logout', (req, res, next) => {
  // Call passport's logout method - Removes req.user and destroys session
  req.logout(err => {
    if (err) return next(err);
    // Redirect to home page - User is now logged out
    res.redirect('/');
  });
});

/**
 * POST endpoint to handle contact form submissions.
 * Validates the form data, saves it to messages.json, and returns a success response.
 * 
 * @route POST /contact
 */
app.post("/contact", (req, res) => { 
  // Extract form fields from request body
  const { name, email, message } = req.body;

  // Validate that all required fields are present
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Create message object with form data and timestamp
  const newMessage = { name, email, message, date: new Date().toISOString() };
  
  // Build path to messages.json file
  const filePath = path.join(__dirname, "messages.json");

  // Initialize empty array to store messages
  let messages = [];

  // Check if messages.json already exists
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, "utf8");
    messages = JSON.parse(fileData);
  }

  // Add new message to array
  messages.push(newMessage);

  // Write updated array back to file with formatting
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
  
  // Send success response to client
  res.json({ success: true, message: "Message received successfully!" });
});

/**
 * GET endpoint that renders a single course detail page.
 * Reads specific course data from individual JSON files and passes it to course.ejs.
 * 
 * @route GET /course/:id
 */
app.get("/course/:id", (req, res) => {
  // Extract course ID from URL parameter
  const courseId = req.params.id;
  // Build path to individual course JSON file
  const filePath = path.join(__dirname, "api", "courses", `${courseId}.json`);
  
  // Check if course file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).render("error", { message: "Course not found." });
  }
  
  // Read and parse course JSON file
  const course = JSON.parse(fs.readFileSync(filePath, "utf8"));
  // Render course.ejs template with course data
  // User object is automatically available via res.locals.user
  res.render("course", { course });
});

/**
 * API endpoint that returns raw JSON data for a specific course.
 * Used for programmatic access to course information.
 * 
 * @route GET /api/courses/:id
 */
app.get("/api/courses/:id", (req, res) => {
  const courseId = req.params.id;
  const filePath = path.join(__dirname, "api", "courses", `${courseId}.json`);
  // Check if course file exists
  if (!fs.existsSync(filePath)) {
    // return 404 Not Found error
    return res.status(404).json({ error: "Course not found." });
  }
  // Read and parse course JSON file
  const course = JSON.parse(fs.readFileSync(filePath, "utf8"));
  // Return course data as JSON response
  res.json(course);
});

/**
 * Starts the Express server and listens for incoming requests.
 */
app.listen(PORT, () => {
  // Determine the base URL based on environment
  // In production (Render), use the production domain
  // In development, use localhost with the actual port
  const baseURL = process.env.NODE_ENV === 'production' 
    ? 'https://project-amigo-academy.onrender.com'
    : `http://localhost:${PORT}`;
  
  console.log(`Server running on port ${PORT}`);
  console.log(`URL = ${baseURL}`);
  console.log(`Render page = https://project-amigo-academy.onrender.com`)
  console.log('Press CTRL+C to stop the server');
});