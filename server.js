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


// Convert the current module's URL to a file path - Needed because ES modules don't have __dirname by default
const __filename = fileURLToPath(import.meta.url);
// Extract the directory path from the filename - Used throughout the code to build paths to files (views, public, data folders)
const __dirname = path.dirname(__filename);

// Create the Express application instance - This is the main server object that all routes and middleware attach to
const app = express();
// Define the port number - The server will listen on this port, used in app.listen() at the bottom
const PORT = 3000;


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

// Load environment variables from .env file - Makes process.env.SESSION_SECRET, GOOGLE_CLIENT_ID, etc. available
dotenv.config();

// Configure session middleware - Creates encrypted cookies to track user login state across requests
// The secret is used to sign the session ID cookie, preventing tampering
// resave: false means don't save session if nothing changed
// saveUninitialized: false means don't create session until something is stored
app.use(session({
  secret: process.env.SESSION_SECRET, // Secret key from .env file, used to encrypt session data
  resave: false, // Don't save session if unmodified - improves performance
  saveUninitialized: false, // Don't create session until user logs in - saves storage space
}));

// Initialize passport - Adds passport's authentication methods to every request object
app.use(passport.initialize());
// Enable persistent login sessions - Allows passport to use the session middleware configured above
app.use(passport.session());

/**
 * Configure Passport to use Google OAuth 2.0 strategy for authentication.
 * This handles the OAuth flow with Google and processes user profile data.
 * 
 * @param {Object} config - Google Strategy configuration
 * @param {string} config.clientID - Google OAuth client ID from environment variables
 * @param {string} config.clientSecret - Google OAuth client secret from environment variables
 * @param {string} config.callbackURL - URL where Google redirects after authentication
 * @param {Function} verify - Callback function that receives user profile and creates user object
 * @param {string} accessToken - OAuth access token for API calls
 * @param {string} refreshToken - OAuth refresh token for renewing access
 * @param {Object} profile - User profile data from Google
 * @param {Function} done - Passport callback to complete authentication
 */
// Register the Google OAuth strategy with passport - This defines how to authenticate users with Google
passport.use(new GoogleStrategy({
    // Client ID from Google Cloud Console - Identifies our app to Google, loaded from .env
    clientID: process.env.GOOGLE_CLIENT_ID,
    // Client Secret from Google Cloud Console - Proves our app's identity to Google, loaded from .env
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // Callback URL registered in Google Cloud Console - Where Google sends users after they authorize
    // This URL must match exactly what's configured in Google Cloud Console
    callbackURL: "https://amigo-academy.onrender.com/auth/google/callback",
  },
  // Verify callback function - Runs after Google authenticates the user
  // This is where we would typically save the user to a database
  async (accessToken, refreshToken, profile, done) => {
    // Create a user object from Google profile data
    // This object will be stored in the session via serializeUser
    const user = {
      googleId: profile.id, // Unique Google user ID - could be used as primary key in database
      email: profile.emails && profile.emails[0]?.value, // User's email from Google - optional chaining handles missing emails
      name: profile.displayName // User's display name from Google profile
    };
    // Call done() to complete authentication - Passes user object to serializeUser
    return done(null, user);
  }
));

/**
 * Serializes user object to store in session.
 * Determines what data from the user object should be stored in the session.
 * 
 * @param {Object} user - User object to serialize
 * @param {Function} done - Callback function to complete serialization
 */
// Define how to store user in session - Called after successful authentication
// This determines what gets saved in the session cookie
passport.serializeUser((user, done) => {
  // Store the entire user object in session - In production, you'd typically store just the user ID
  // This data is encrypted and stored in the session cookie
  done(null, user);
});

/**
 * Deserializes user object from session.
 * Reconstructs the user object from the data stored in the session.
 * 
 * @param {Object} user - Serialized user data from session
 * @param {Function} done - Callback function to complete deserialization
 */
// Define how to retrieve user from session - Called on every request for authenticated users
// This reconstructs the user object from the session data
passport.deserializeUser((user, done) => {
  // Return the user object - In production, you'd fetch full user data from database using stored ID
  // This makes req.user available in all routes
  done(null, user);
});

/**
 * GET endpoint that renders the main welcome page.
 * Displays a simple welcome message with a login link.
 * 
 * @route GET /
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @returns {void} Sends HTML content with welcome message and Google login link
 */
// Define route for the root URL - This is the main landing page
app.get('/', (req, res) => {
  // Send HTML response with welcome message and login link
  // The /auth/google link triggers the authentication flow defined below
  // The /courses link navigates to the courses list page
  res.send(`
    <h2>Bienvenido a Amigo Academy</h2>
    <a href="/auth/google">Iniciar sesión con Google</a>
    <br><br>
    <a href="/courses">Ver Cursos</a>
  `);
});

/**
 * GET endpoint that initiates Google OAuth authentication flow.
 * Redirects user to Google's consent screen to authorize the application.
 * 
 * @route GET /auth/google
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @returns {void} Redirects to Google OAuth consent screen
 */
// Start the Google OAuth flow - When user clicks "Sign in with Google"
// passport.authenticate() middleware intercepts the request
app.get('/auth/google', passport.authenticate('google', {
  // Request access to user's profile and email from Google
  // These scopes determine what information we can access
  scope: ['profile', 'email'],
}));

/**
 * GET endpoint that handles the OAuth callback from Google.
 * Processes the authentication response and redirects based on success or failure.
 * 
 * @route GET /auth/google/callback
 * @param {express.Request} req - Express request object with OAuth response
 * @param {express.Response} res - Express response object
 * @returns {void} Redirects to home page on success or failure redirect on error
 */
// Handle Google's response after user authorizes - Google redirects here with authorization code
// This URL must match the callbackURL configured in the GoogleStrategy above
app.get('/auth/google/callback',
  // passport.authenticate processes the authorization code and gets user profile
  // If authentication fails, redirect back to home page
  passport.authenticate('google', { failureRedirect: '/' }),
  // Success handler - Only runs if authentication succeeds
  (req, res) => {
    // Redirect to home page - User is now logged in and req.user is available
    // The session cookie contains the serialized user data
    res.redirect('/');
  }
);

/**
 * GET endpoint that logs out the current user.
 * Destroys the user session and redirects to the home page.
 * 
 * @route GET /logout
 * @param {express.Request} req - Express request object with logout method
 * @param {express.Response} res - Express response object
 * @param {Function} next - Express next middleware function for error handling
 * @returns {void} Redirects to home page after logout
 */
// Logout route - Destroys the user's session
app.get('/logout', (req, res, next) => {
  // Call passport's logout method - Removes req.user and destroys session
  req.logout(err => {
    // If logout fails, pass error to error handling middleware
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
 * @param {express.Request} req - Express request object containing form data in req.body
 * @param {Object} req.body - The request body
 * @param {string} req.body.name - The sender's name
 * @param {string} req.body.email - The sender's email address
 * @param {string} req.body.message - The message content
 * @param {express.Response} res - Express response object
 * @returns {Object} JSON response with success status or error message
 */
// Contact form submission endpoint - Receives data from HTML contact form
app.post("/contact", (req, res) => { 
  
  // Extract form fields from request body - body-parser middleware makes this data available
  const { name, email, message } = req.body;

  // Validate that all required fields are present - Prevents incomplete submissions
  if (!name || !email || !message) {
    // Return 400 Bad Request status with error message - Client can display this error
    return res.status(400).json({ error: "All fields are required." });
  }

  // Create message object with form data and timestamp - ISO format is sortable and standardized
  const newMessage = { name, email, message, date: new Date().toISOString() };
  
  // Build path to messages.json file - Uses __dirname to ensure correct path regardless of where server runs
  const filePath = path.join(__dirname, "messages.json");

  // Initialize empty array to store messages - Will be populated if file exists
  let messages = [];

  // Check if messages.json already exists - Prevents error when trying to read non-existent file
  if (fs.existsSync(filePath)) {
    // Read existing messages from file - fs.readFileSync blocks until file is read
    const fileData = fs.readFileSync(filePath, "utf8");
    // Parse JSON string into JavaScript array - Allows us to add new message
    messages = JSON.parse(fileData);
  }

  // Add new message to array - Keeps all previous messages and appends the new one
  messages.push(newMessage);

  // Write updated array back to file - null and 2 parameters format JSON with 2-space indentation
  // This overwrites the entire file with the updated messages array
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));

  // Log message to server console - Useful for debugging and monitoring
  console.log("New message:", newMessage);
  
  // Send success response to client - Confirms message was saved successfully
  res.json({ success: true, message: "Message received successfully!" });
});

/**
 * GET endpoint that renders the courses list page.
 * Reads course data from courses.json and passes it to the index.ejs template.
 * 
 * @route GET /courses
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @returns {void} Renders the index.ejs template with courses data
 */
// Courses list route - Displays all available courses
app.get("/courses", (req, res) => {
  // Build path to courses.json file - Contains array of course summaries
  const filePath = path.join(__dirname, "data", "courses.json");

  // Validate that courses file exists - Prevents server crash if file is missing
  if (!fs.existsSync(filePath)) {
    // Return 404 Not Found error - Indicates configuration problem
    return res.status(404).send("Courses file not found.");
  }

  // Read and parse courses.json file - Converts JSON string to JavaScript array
  const courses = JSON.parse(fs.readFileSync(filePath, "utf8"));
  // Render index.ejs template with courses data - EJS can loop through courses array to display them
  // The view engine was configured at the top with app.set("view engine", "ejs")
  res.render("index", { courses });
});

/**
 * GET endpoint that renders a single course detail page.
 * Reads specific course data from individual JSON files and passes it to course.ejs.
 * 
 * @route GET /course/:id
 * @param {express.Request} req - Express request object
 * @param {string} req.params.id - The course ID from the URL parameter
 * @param {express.Response} res - Express response object
 * @returns {void} Renders the course.ejs template with course data or error page if not found
 */
// Course detail page route - Shows full information about a specific course
// :id is a route parameter that captures the course ID from the URL
app.get("/course/:id", (req, res) => {
  // Extract course ID from URL parameter - For example, /course/javascript would give "javascript"
  const courseId = req.params.id;
  // Build path to individual course JSON file - Each course has its own file in api/courses/
  const filePath = path.join(__dirname, "api", "courses", `${courseId}.json`);
  // Check if course file exists - Handles case where user requests non-existent course
  if (!fs.existsSync(filePath)) {
    // Render error template with message - Provides user-friendly error page
    return res.status(404).render("error", { message: "Course not found." });
  }
  // Read and parse course JSON file - Gets all details about the specific course
  const course = JSON.parse(fs.readFileSync(filePath, "utf8"));
  // Render course.ejs template with course data - Displays course title, description, lessons, etc.
  res.render("course", { course });
});

/**
 * API endpoint that returns raw JSON data for a specific course.
 * Used for programmatic access to course information.
 * 
 * @route GET /api/courses/:id
 * @param {express.Request} req - Express request object
 * @param {string} req.params.id - The course ID from the URL parameter
 * @param {express.Response} res - Express response object
 * @returns {Object} JSON object containing course data or error message
 */
// API endpoint for course data - Returns raw JSON instead of rendering HTML
// Useful for AJAX requests or external applications
app.get("/api/courses/:id", (req, res) => {
  // Extract course ID from URL - Same as the course detail route above
  const courseId = req.params.id;
  // Build path to course JSON file - Same file structure as above
  const filePath = path.join(__dirname, "api", "courses", `${courseId}.json`);

  // Check if course exists - Returns JSON error instead of rendering error page
  if (!fs.existsSync(filePath)) {
    // Return JSON error response - Can be easily parsed by JavaScript clients
    return res.status(404).json({ error: "Course not found." });
  }

  // Read and parse course file - Same data as the HTML route above
  const course = JSON.parse(fs.readFileSync(filePath, "utf8"));
  // Send JSON response - Sets Content-Type header to application/json automatically
  // This allows JavaScript fetch() or axios to easily consume the data
  res.json(course);
});

/**
 * Starts the Express server and listens for incoming requests.
 * 
 * @param {number} PORT - The port number to listen on (3000)
 * @param {Function} callback - Callback function executed when server starts successfully
 */
// Start the server - Makes all the routes above accessible via HTTP
// This must be the last thing in the file after all routes are defined
app.listen(PORT, () => {
  // Log success message - Confirms server is running and shows the URL to access it
  console.log(`Server running on http://localhost:${PORT}`);
});