AI Usage Report: Academia del Amigo Project


This document outlines how our team used an AI assistant as a conceptual and technical advisor during the development of the "Academia del Amigo" frontend, in compliance with the project's AI usage policy.


Overview of AI Assistance


Throughout this project, our team used an AI assistant primarily as a Socratic partner and a technical consultant. The AI's role was to help us brainstorm solutions for a professional UI/UX, explain complex CSS implementation strategies, and assist in identifying logical errors in our code.


At no point was the AI asked to "do the work for us" or generate code blindly. Instead, we presented it with conceptual goals or technical problems, and it provided strategies and explanations. Our team then used that guidance to write, adapt, and implement the final code.


Documented Prompts and Adaptation


Here are examples of the prompt-and-response process, moving from the most complex conceptual task to the simplest debugging task.


---


1. Refactoring the Bootstrap Implementation for a Professional UI/UX


Our initial Bootstrap file was functional but lacked a professional, aesthetic feel. We needed a strategy to elevate the design based on the UI/UX principles from our course materials.


Our Team's Prompt:
"Our team is working on a bootstrap.html file for an educational platform. The current version is functional but doesn't look professional. Based on the principles of modern UI/UX (like typography, color theory, and white space), what is a strategy to refactor this page? We want to incorporate custom fonts from Google Fonts and a more professional color palette, while still using Bootstrap's core components."




Summary of AI Guidance and Our Adaptation:
The AI suggested a "content-first" strategy focusing on typography and color.


Typography: It recommended creating a strong typographic hierarchy by pairing a "serif" font (like 'Merriweather') for headings with a clean "sans-serif" font (like 'Lato') for the body text.


Color & Space: It advised replacing the bright bg-warning hero with a bg-light section to leverage "white space" for a cleaner, more elegant feel. It also suggested using a single, consistent accent color (like a "growth" associated green) for all primary buttons.


Our team implemented this strategy by adding the Google Fonts <link> to our <head> and then adding an internal <style> block to override Bootstrap's default font-family and .btn-primary color.


---


 2. Creating a Parallel Custom CSS Layout


We wanted to demonstrate our understanding of core CSS by replicating the responsive Bootstrap design using pure, custom CSS. This required a deep understanding of modern layout techniques.


Our Team's Prompt:
"We now need to build a parallel index.html file that *doesn't* use the Bootstrap framework but *achieves the same elegant design* (sticky nav, serif/sans-serif fonts, and a responsive 3-column grid). What is the pure CSS implementation logic for this? Specifically, how do we build a mobile-first, responsive grid for our .card elements using Flexbox and @media queries?"


Summary of AI Guidance and Our Adaptation:
The AI explained the "mobile-first" methodology in detail. It provided the core logic for a .card-list wrapper using display: flex and flex-wrap: wrap.


The most critical part was the use of @media queries, which the AI explained. We used this concept to write the final code:
1.  Default (Mobile): We set the .card width to 100%.
2.  Tablet (@media (min-width: 768px)): We overrode the width to calc(50% - ...) to create a 2-column grid.
3.  Desktop (@media (min-width: 992px)): We overrode it again to calc(33.333% - ...) for the final 3-column grid.


This allowed us to perfectly replicate Bootstrap's grid behavior using 100% custom CSS, demonstrating our understanding of the underlying responsive principles.


---


 3. Debugging CSS Layout and File Path Issues


At one point, our custom CSS grid was broken (cards were stacking vertically) and a footer link wasn't working. This was a debugging task.


Our Team's Prompt:
"We're having two problems. First, our index.html file (in the root) isn't loading styles.css (in /css/). Our link is href="css/styles.css". Second, even when the CSS loads, our cards are stacking vertically. We're using display: flex on .card-list in our CSS. Here is our HTML structure for the 'courses' section... [code snippet]. Can you analyze our structure and CSS logic and explain what we're missing?"


Summary of AI Guidance and Our Adaptation:
The AI helped us spot two different logical errors:


1.  The Grid: The AI pointed out that in our HTML, our <article> class="card" elements were *siblings* to the <h2> tag, not *children* of the .card-list div we were styling. Our CSS was correct, but our HTML structure was wrong. Our team fixed this by moving all our <article> tags *inside* the required <div class="card-list">.
2.  The Link: The AI also explained that our "Back to top" link (href="top") was "fighting" with our position: sticky header. The browser saw that the top was already at the top of the screen (because it was sticky), so it refused to scroll. We adapted this by changing the link to href="", the universal browser command to return to the top of the document.


In all cases, our team used the AI to debug our logic and accelerate problem-solving, and we performed the code corrections ourselves. Also, it helped
us to improve our documentation files so they are now more professional and descriptive of what the project is about and so.