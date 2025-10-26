import express from "express";
import fs from "fs";
import path from "path";
import passport from "passport";
import session from "express-session";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables (silent mode suppresses all dotenv output)
dotenv.config({ path: './credentials.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

const CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback';

// Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    const user = {
      googleId: profile.id,
      email: profile.emails && profile.emails[0]?.value,
      name: profile.displayName,
      picture: profile.photos && profile.photos[0]?.value
    };
    return done(null, user);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Make user available to all templates
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Routes
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, "data", "courses.json");

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Courses file not found.");
  }

  const courses = JSON.parse(fs.readFileSync(filePath, "utf8"));
  res.render("index", { courses });
});

app.get("/courses", (req, res) => {
  res.redirect('/');
});

app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

app.get('/auth/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/',
    failureMessage: true 
  }),
  (req, res) => {
    res.redirect('/');
  }
);

app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/');
  });
});

app.post("/contact", (req, res) => { 
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const newMessage = { name, email, message, date: new Date().toISOString() };
  const filePath = path.join(__dirname, "messages.json");
  let messages = [];

  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, "utf8");
    messages = JSON.parse(fileData);
  }

  messages.push(newMessage);
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
  
  res.json({ success: true, message: "Message received successfully!" });
});

app.get("/course/:id", (req, res) => {
  const courseId = req.params.id;
  const filePath = path.join(__dirname, "api", "courses", `${courseId}.json`);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).render("error", { message: "Course not found." });
  }
  
  const course = JSON.parse(fs.readFileSync(filePath, "utf8"));
  res.render("course", { course });
});

app.get("/api/courses/:id", (req, res) => {
  const courseId = req.params.id;
  const filePath = path.join(__dirname, "api", "courses", `${courseId}.json`);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Course not found." });
  }
  
  const course = JSON.parse(fs.readFileSync(filePath, "utf8"));
  res.json(course);
});


app.listen(PORT, () => {
  // Determine the base URL based on environment
  const baseURL = process.env.NODE_ENV === 'production' 
    ? 'https://project-amigo-academy.onrender.com'
    : `http://localhost:${PORT}`;
  
  console.log(`Server running on port ${PORT}`);
  console.log(`URL = ${baseURL}`);
  console.log(`Render page = https://project-amigo-academy.onrender.com`)
  console.log('Press CTRL+C to stop the server');
});