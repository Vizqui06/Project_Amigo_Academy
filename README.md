Academia del Amigo - Web Project
Description of the Project:

Academia del Amigo is a global educational platform designed to make quality education accessible to everyone, everywhere, completely free. Our project is directly inspired by the mission of the UN's Sustainable Development Goal 4 (SDG 4): to "ensure inclusive and equitable quality education and promote lifelong learning opportunities for all".


In a world where access to learning is often limited by poverty, geography, or social status , this platform provides a digital solution to help close the education gap. Inspired by successful models like Khan Academy and Udemy , our goal is to empower individuals with the knowledge and skills they need to improve their lives and build a sustainable future.


This repository contains the first version of the platform's front & back-end, built with a clean, accessible, and responsive interface and a simply but doing-the-job brains behind the scenes.

Current Features:
Responsive Design: The layout correctly adapts to mobile, tablet, and desktop screens using the Bootstrap 5 grid system.
Dynamic & Fixed Navigation: The navbar remains visible at the top (sticky-top) and uses Scrollspy to automatically highlight the user's current section on the page.
Modern Components: Built with Bootstrap components like "Cards" for course listings, a "Hero" section for impact, and a styled contact form.
Custom Styling: While built on Bootstrap, the project features a custom color palette and typography to establish a unique brand identity.


Technologies Used:
HTML5: For semantic content structure.
CSS3: For custom styling and branding.
Bootstrap 5: The primary framework for responsive design, layout, and UI components.


Installation and Local Use:
As a static front-end project, no complex installation is required:
Just clone or download this repository.
Open the index2.html file in your web browser.


Project Vision & Future Implementations:
This project is the first phase of a scalable, long-term vision. The technical roadmap is designed to evolve this static site into a full-featured, dynamic platform.


Planned Core Features (from our project proposal ):
Free and Open Access: Core courses in mathematics, science, languages, and digital literacy will remain 100% free of charge.
True Inclusiveness & Multilingual Design: The platform is intended to support multiple languages and accessibility tools for learners with disabilities.
Community & Mentorship: Future versions will include spaces for discussion, study groups, and mentorship to connect learners and educators globally.


Open Collaboration: 
We plan to build a system where qualified educators, professionals, and volunteers can contribute, review, and update course content to ensure its quality and diversity.


Technical Roadmap (in progress phases):

Backend: An Express.js server will be built to handle business logic, contact form submissions, and user management.

Database: A MongoDB database using Mongoose will be implemented to dynamically store and manage courses, user data, and platform content.

Authentication: Users will be able to register and log in with Google to track their progress and participate in the community.

Independance: The team will set up the page in a render host service. Because of the low traffic and low capital, the page will "wake up" whenever a user tries to go to the page. This avoids to local host the page in users machine and, having it on cloude with this strategy, save us lots of money.


Future implementations:
The page will soon have a full & complete back-end, database, authentication and live on the cloud, but there are no courses yet. We, as a team, have two options,create courses from AI or redirect to YouTube videos from world-renowned channels such as Harvard, MIT, etcetera. 