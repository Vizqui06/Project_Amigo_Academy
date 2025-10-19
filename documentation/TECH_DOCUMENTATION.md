ACADEMIA DEL AMIGO - TECHNICAL DOCUMENTATION
This document outlines the frontend implementation logic and backend architecture for the Academia del Amigo project.

FRONTEND ARCHITECTURE
The frontend is built as a static "Single Page Application" (SPA), where the user navigates vertically between sections. The project maintains two parallel implementations for flexibility: a version using pure, custom CSS and another using the Bootstrap 5 framework.

Core Implementation Philosophy
Both implementations are built on a foundation of modern web standards:

Semantic HTML: The structure uses HTML5 tags like <header>, <nav>, <main>, <section>, <article>, and <footer>. This provides clear meaning to the document, which is essential for accessibility (screen readers) and SEO.

Mobile-First Responsive Design: The layout is designed to be usable on a small mobile screen by default. It then uses CSS to adapt and expand for larger screens like tablets and desktops.

Logical Asset Structure: All assets are organized into root folders (/css, /images) for clear and maintainable file paths.

Implementation 1: Custom CSS (index.html)
This implementation demonstrates a ground-up approach using custom-written CSS, showing a deep understanding of layout and responsive design principles.

Box Model: The stylesheet globally applies box-sizing: border-box. This reset is critical as it forces all elements to include padding and border within their total width and height, preventing common layout overflows and simplifying the box model.

Typography: The design imports two Google Fonts (@import):

Merriweather (Serif): Used for all headings (h1-h5) and the .logo to create a professional, "authoritative" typographic hierarchy.

Lato (Sans-serif): Used for all body text (body) to ensure high legibility and a clean, modern feel.

Sticky Navigation: The <header> element uses position: sticky and top: 0. This allows the navigation bar to scroll with the page initially, then "stick" to the top of the viewport, ensuring navigation controls are always accessible to the user.

Flexbox Layout: The layout is built primarily with CSS Flexbox, not floats or inline-blocks.

Header: The header .container is set to display: flex with justify-content: space-between, which cleanly separates the .logo on the left from the <nav> links on the right.

Course Grid: The .card-list wrapper is a flex container. flex-wrap: wrap allows the cards to flow to the next line automatically. gap: 20px provides consistent spacing between all cards without complex margin calculations.

Responsive Grid Logic (Media Queries): The mobile-first approach is executed using @media queries:

Default (Mobile): Each .card has width: 100%, stacking them vertically.

Tablet (@media (min-width: 768px)): The card width is changed to calc(50% - 10px), creating a 2-column grid.

Desktop (@media (min-width: 992px)): The card width is changed to calc(33.333% - 13.33px), creating the final 3-column grid.

Implementation 2: Bootstrap 5 Framework (bootstrap.html)
This implementation leverages the Bootstrap 5 framework as a rapid development tool, composing the UI from pre-built components and utility classes.

Grid System: This version relies entirely on Bootstrap's 12-column grid. The course section uses a .row container with .col-md-4 for each card. This achieves the same responsive 3-column layout as the custom CSS, but the logic is handled by Bootstrap's md (medium) breakpoint.

Reusable Components: The UI is assembled using standard Bootstrap components:

Navbar: .navbar, .navbar-expand-lg, and .navbar-dark create a fully responsive navigation bar that collapses into a "hamburger" menu on mobile.

Card: .card and its sub-classes (.card-body, .card-title, .card-text) are used to structure all course modules consistently.

Form: .form-control and .form-label are used to style the contact form for a clean, aligned, and responsive layout.

Utility Classes: Development is accelerated by using utilities to handle spacing, alignment, and typography without writing custom CSS.

Spacing: py-5 (vertical padding), mb-5 (bottom margin), g-4 (grid gap).

Layout: sticky-top, ms-auto (pushes nav links right).

Aesthetics: shadow-sm (subtle card shadow), h-100 (makes all cards in a row the same height).

JavaScript Interactivity: This version includes Bootstrap's JS bundle to power:

Responsive Menu: The .navbar-toggler button, which shows/hides the menu on mobile.

Scrollspy: The <body> tag has data-bs-spy="scroll" attached. This monitors the user's scroll position and automatically applies an .active class to the corresponding .nav-link in the navbar, providing clear visual feedback on their location.

BACKEND ARCHITECTURE (IN-PROGRESS)
The next phase of this project is to convert the static frontend into a dynamic full-stack application.

Server: A Node.js server using the Express.js framework is being built. It will handle all routing and API logic.

GET /: This route will render the homepage. Instead of static HTML, it will fetch courses from the database and inject them into an EJS template.

POST /contact: The contact form will submit to this route. The server will use the express.urlencoded middleware to parse the data, validate it, and save it to the database.

Database: A MongoDB Atlas database will serve as the data store. Mongoose is used as the Object Data Modeling (ODM) library to simplify interactions with the database.

Models: Schemas are defined for core data structures, including Course (with properties like title, description, imageUrl) and Message (for contact form submissions).

CRUD: The server will implement full CRUD (Create, Read, Update, Delete) operations, enabling the creation of a future admin panel to manage courses.

Authentication: User login will be implemented using Google OAuth 2.0. This allows users to securely sign in with their existing Google accounts without the site needing to manage passwords.

Deployment: The application will be hosted on Render. The free tier is used, which places the app in a "sleep" state during inactivity. When a new request comes in, the server "wakes up" to handle it. This is a cost-free solution perfectly suited for a project with initial low traffic.